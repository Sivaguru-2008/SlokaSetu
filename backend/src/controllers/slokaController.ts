import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export const getSlokas = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || '12'), 10)));
    const skip = (page - 1) * limit;

    const { deity, category, language, script, occasion, hasPdf, search, sort } = req.query;

    const whereClause: any = { isPublished: true };

    if (search) {
      const q = String(search).trim();
      whereClause.OR = [
        { canonicalTitle: { contains: q, mode: 'insensitive' } },
        { backgroundContext: { contains: q, mode: 'insensitive' } },
        { significanceNotes: { contains: q, mode: 'insensitive' } },
        { aliases: { some: { aliasTitle: { contains: q, mode: 'insensitive' } } } }
      ];
    }

    if (deity) {
      whereClause.deity = {
        OR: [
          { slug: String(deity) },
          { id: String(deity) },
          { name: { contains: String(deity), mode: 'insensitive' } }
        ]
      };
    }

    if (category) {
      whereClause.category = {
        OR: [
          { slug: String(category) },
          { id: String(category) }
        ]
      };
    }

    if (language) {
      whereClause.versions = {
        some: {
          isPublished: true,
          language: {
            OR: [
              { code: String(language) },
              { id: String(language) }
            ]
          }
        }
      };
    }

    if (script) {
      whereClause.versions = {
        ...whereClause.versions,
        some: {
          ...(whereClause.versions?.some || {}),
          isPublished: true,
          script: {
            OR: [
              { code: String(script) },
              { id: String(script) }
            ]
          }
        }
      };
    }

    if (occasion) {
      whereClause.occasionSlokas = {
        some: {
          occasion: {
            OR: [
              { slug: String(occasion) },
              { id: String(occasion) }
            ]
          }
        }
      };
    }

    if (hasPdf === 'true') {
      whereClause.pdfResources = {
        some: { isPublic: true }
      };
    }

    let orderBy: any = { canonicalTitle: 'asc' };
    if (sort === 'recent') {
      orderBy = { createdAt: 'desc' };
    } else if (sort === 'category') {
      orderBy = { category: { name: 'asc' } };
    }

    const [totalCount, slokas] = await Promise.all([
      prisma.sloka.count({ where: whereClause }),
      prisma.sloka.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy,
        include: {
          category: true,
          deity: true,
          aliases: true,
          versions: {
            where: { isPublished: true },
            select: {
              id: true,
              versionType: true,
              language: { select: { code: true, name: true, nativeName: true } },
              script: { select: { code: true, name: true, nativeName: true } }
            }
          },
          pdfResources: {
            where: { isPublic: true },
            select: { id: true, fileName: true, fileSize: true, title: true }
          },
          _count: {
            select: { occasionSlokas: true }
          }
        }
      })
    ]);

    res.json({
      success: true,
      data: slokas,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getSlokaBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slugOrId } = req.params;

    const sloka = await prisma.sloka.findFirst({
      where: {
        OR: [
          { slug: slugOrId },
          { id: slugOrId }
        ],
        isPublished: true
      },
      include: {
        category: true,
        deity: true,
        primarySource: true,
        aliases: {
          include: { script: true }
        },
        versions: {
          where: { isPublished: true },
          include: {
            language: true,
            script: true,
            source: true
          },
          orderBy: [
            { language: { isClassical: 'desc' } },
            { script: { name: 'asc' } }
          ]
        },
        pdfResources: {
          where: { isPublic: true },
          include: { source: true }
        },
        occasionSlokas: {
          include: {
            occasion: {
              include: {
                category: true,
                institution: true,
                dates: { orderBy: { gregorianDate: 'asc' }, take: 1 }
              }
            }
          }
        }
      }
    });

    if (!sloka) {
      res.status(404).json({ success: false, message: `Sloka '${slugOrId}' not found.` });
      return;
    }

    res.json({
      success: true,
      data: sloka
    });
  } catch (err) {
    next(err);
  }
};

export const getSlokaVersions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const sloka = await prisma.sloka.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      select: { id: true }
    });

    if (!sloka) {
      res.status(404).json({ success: false, message: 'Sloka not found.' });
      return;
    }

    const versions = await prisma.slokaVersion.findMany({
      where: { slokaId: sloka.id, isPublished: true },
      include: {
        language: true,
        script: true,
        source: true,
        pdfResources: { where: { isPublic: true } }
      }
    });

    res.json({
      success: true,
      count: versions.length,
      data: versions
    });
  } catch (err) {
    next(err);
  }
};

export const getSlokaRelated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const current = await prisma.sloka.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      select: { id: true, deityId: true, categoryId: true }
    });

    if (!current) {
      res.status(404).json({ success: false, message: 'Sloka not found.' });
      return;
    }

    const [relatedSlokas, occasionLinks] = await Promise.all([
      prisma.sloka.findMany({
        where: {
          id: { not: current.id },
          isPublished: true,
          OR: [
            current.deityId ? { deityId: current.deityId } : {},
            { categoryId: current.categoryId }
          ]
        },
        take: 6,
        include: {
          category: true,
          deity: true
        }
      }),
      prisma.occasionSloka.findMany({
        where: { slokaId: current.id },
        include: {
          occasion: {
            include: {
              category: true,
              institution: true,
              dates: { orderBy: { gregorianDate: 'asc' }, take: 1 }
            }
          }
        }
      })
    ]);

    const formattedOccasions = occasionLinks.map(ol => ({
      relationshipType: ol.relationshipType,
      notes: ol.notes,
      ...ol.occasion
    }));

    res.json({
      success: true,
      data: {
        relatedSlokas,
        relatedOccasions: formattedOccasions,
        relatedByOccasions: formattedOccasions,
        relatedByDeity: relatedSlokas.filter(s => current.deityId && s.deityId === current.deityId),
        relatedByCategory: relatedSlokas.filter(s => s.categoryId === current.categoryId)
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getDailySloka = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const count = await prisma.sloka.count({ where: { isPublished: true } });
    if (count === 0) {
      res.json({ success: true, data: null });
      return;
    }

    // Deterministic rotation based on day of year
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const skipIndex = dayOfYear % count;

    const sloka = await prisma.sloka.findFirst({
      where: { isPublished: true },
      skip: skipIndex,
      include: {
        category: true,
        deity: true,
        versions: {
          where: { isPublished: true },
          take: 3,
          include: { language: true, script: true }
        },
        pdfResources: {
          where: { isPublic: true },
          take: 2
        }
      }
    });

    res.json({
      success: true,
      data: sloka
    });
  } catch (err) {
    next(err);
  }
};

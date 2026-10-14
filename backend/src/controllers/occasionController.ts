import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export const getOccasions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, institution, year, region, search } = req.query;

    const whereClause: any = { isActive: true };

    if (category) {
      whereClause.category = {
        OR: [
          { slug: String(category) },
          { id: String(category) }
        ]
      };
    }

    if (institution === 'amrita') {
      whereClause.institutionId = { not: null };
    } else if (institution === 'general') {
      whereClause.institutionId = null;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
        { significance: { contains: String(search), mode: 'insensitive' } }
      ];
    }

    const occasions = await prisma.occasion.findMany({
      where: whereClause,
      include: {
        category: true,
        institution: true,
        deity: true,
        dates: {
          orderBy: { gregorianDate: 'asc' },
          where: year ? { year: parseInt(String(year), 10) } : undefined
        },
        occasionSlokas: {
          orderBy: { displayOrder: 'asc' },
          include: {
            sloka: {
              include: {
                category: true,
                deity: true,
                versions: {
                  where: { isPublished: true },
                  include: {
                    language: true,
                    script: true
                  }
                },
                pdfResources: {
                  where: { isPublic: true },
                  select: { id: true, fileName: true, fileSize: true, title: true }
                }
              }
            }
          }
        },
        _count: {
          select: {
            occasionSlokas: true,
            pdfResources: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json({
      success: true,
      count: occasions.length,
      data: occasions
    });
  } catch (err) {
    next(err);
  }
};

export const getOccasionBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slugOrId } = req.params;

    const occasion = await prisma.occasion.findFirst({
      where: {
        OR: [
          { slug: slugOrId },
          { id: slugOrId }
        ]
      },
      include: {
        category: true,
        institution: true,
        deity: true,
        primarySource: true,
        dates: {
          orderBy: { gregorianDate: 'asc' }
        },
        occasionSlokas: {
          orderBy: { displayOrder: 'asc' },
          include: {
            sloka: {
              include: {
                category: true,
                deity: true,
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
                  select: { id: true, fileName: true, fileSize: true }
                }
              }
            }
          }
        },
        pdfResources: {
          where: { isPublic: true },
          include: { source: true }
        }
      }
    });

    if (!occasion) {
      res.status(404).json({ success: false, message: `Occasion '${slugOrId}' not found.` });
      return;
    }

    res.json({
      success: true,
      data: occasion
    });
  } catch (err) {
    next(err);
  }
};

export const getOccasionSlokas = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const occasion = await prisma.occasion.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      select: { id: true, name: true }
    });

    if (!occasion) {
      res.status(404).json({ success: false, message: 'Occasion not found.' });
      return;
    }

    const items = await prisma.occasionSloka.findMany({
      where: { occasionId: occasion.id },
      orderBy: { displayOrder: 'asc' },
      include: {
        sloka: {
          include: {
            category: true,
            deity: true,
            versions: {
              where: { isPublished: true },
              include: { language: true, script: true }
            },
            pdfResources: { where: { isPublic: true } }
          }
        }
      }
    });

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (err) {
    next(err);
  }
};

export const getOccasionDates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const occasion = await prisma.occasion.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      select: { id: true }
    });

    if (!occasion) {
      res.status(404).json({ success: false, message: 'Occasion not found.' });
      return;
    }

    const dates = await prisma.occasionDate.findMany({
      where: { occasionId: occasion.id },
      orderBy: { gregorianDate: 'asc' }
    });

    res.json({
      success: true,
      count: dates.length,
      data: dates
    });
  } catch (err) {
    next(err);
  }
};

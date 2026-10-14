import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export const globalSearch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const q = String(req.query.q || '').trim();
    const type = String(req.query.type || 'all').toLowerCase();

    if (!q) {
      res.json({
        success: true,
        query: '',
        results: { slokas: [], occasions: [] }
      });
      return;
    }

    const slokasPromise = (type === 'all' || type === 'sloka')
      ? prisma.sloka.findMany({
          where: {
            isPublished: true,
            OR: [
              { canonicalTitle: { contains: q, mode: 'insensitive' } },
              { backgroundContext: { contains: q, mode: 'insensitive' } },
              { aliases: { some: { aliasTitle: { contains: q, mode: 'insensitive' } } } }
            ]
          },
          take: 10,
          include: {
            category: true,
            deity: true,
            versions: {
              where: { isPublished: true },
              select: {
                language: { select: { code: true, name: true } },
                script: { select: { code: true, name: true } }
              }
            }
          }
        })
      : Promise.resolve([]);

    const occasionsPromise = (type === 'all' || type === 'occasion')
      ? prisma.occasion.findMany({
          where: {
            isActive: true,
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
              { significance: { contains: q, mode: 'insensitive' } }
            ]
          },
          take: 10,
          include: {
            category: true,
            institution: true,
            dates: { orderBy: { gregorianDate: 'asc' }, take: 1 }
          }
        })
      : Promise.resolve([]);

    const [slokas, occasions] = await Promise.all([slokasPromise, occasionsPromise]);

    res.json({
      success: true,
      query: q,
      totalResults: slokas.length + occasions.length,
      results: {
        slokas,
        occasions
      },
      data: {
        slokas,
        occasions
      }
    });
  } catch (err) {
    next(err);
  }
};

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export const getMetadata = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [categories, deities, languages, scripts, institutions] = await Promise.all([
      prisma.category.findMany({ orderBy: { name: 'asc' } }),
      prisma.deity.findMany({ orderBy: { name: 'asc' } }),
      prisma.language.findMany({ orderBy: { isClassical: 'desc' } }),
      prisma.script.findMany({ orderBy: { name: 'asc' } }),
      prisma.institution.findMany({ orderBy: { name: 'asc' } })
    ]);

    res.json({
      success: true,
      data: {
        categories,
        deities,
        languages,
        scripts,
        institutions
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getPublicStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [
      totalSlokas,
      totalVersions,
      totalOccasions,
      totalResources,
      languagesCount,
      scriptsCount
    ] = await Promise.all([
      prisma.sloka.count({ where: { isPublished: true } }),
      prisma.slokaVersion.count({ where: { isPublished: true } }),
      prisma.occasion.count({ where: { isActive: true } }),
      prisma.pdfResource.count({ where: { isPublic: true } }),
      prisma.language.count(),
      prisma.script.count()
    ]);

    res.json({
      success: true,
      data: {
        totalSlokas,
        totalVersions,
        totalOccasions,
        totalResources,
        totalPdfResources: totalResources,
        languagesCount,
        scriptsCount
      }
    });
  } catch (err) {
    next(err);
  }
};

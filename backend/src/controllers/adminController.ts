import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthenticatedRequest } from '../middleware/auth';
import { VerificationStatus, RelationshipType, EntityType } from '@prisma/client';
import path from 'path';
import fs from 'fs';

export const adminLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: String(email).toLowerCase() }
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid administrative credentials.' });
      return;
    }

    const isMatch = await bcrypt.compare(String(password), user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid administrative credentials.' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'ADMIN_LOGIN',
        entityType: 'USER',
        entityId: user.id,
        ipAddress: req.ip
      }
    }).catch(err => console.error('Audit log failed:', err));

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    res.json({
      success: true,
      user: req.user
    });
  } catch (err) {
    next(err);
  }
};

export const getAdminStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [
      publishedSlokas,
      draftSlokas,
      totalOccasions,
      totalVersions,
      totalPdfResources,
      pendingReviewsCount,
      recentReviews,
      recentAuditLogs
    ] = await Promise.all([
      prisma.sloka.count({ where: { verificationStatus: VerificationStatus.PUBLISHED } }),
      prisma.sloka.count({ where: { verificationStatus: { in: [VerificationStatus.DRAFT, VerificationStatus.UNDER_REVIEW] } } }),
      prisma.occasion.count(),
      prisma.slokaVersion.count(),
      prisma.pdfResource.count(),
      prisma.contentReview.count({ where: { reviewStatus: { in: [VerificationStatus.DRAFT, VerificationStatus.UNDER_REVIEW] } } }),
      prisma.contentReview.findMany({
        take: 5,
        orderBy: { reviewedAt: 'desc' }
      }),
      prisma.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    res.json({
      success: true,
      data: {
        publishedSlokas,
        draftSlokas,
        totalOccasions,
        totalVersions,
        totalPdfResources,
        pendingReviewsCount,
        recentReviews,
        recentAuditLogs
      }
    });
  } catch (err) {
    next(err);
  }
};

export const createOccasion = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, slug, categoryId, institutionId, deityId, description, significance, preparationGuide, gregorianDate, year, region } = req.body;

    if (!name || !slug || !categoryId || !description) {
      res.status(400).json({ success: false, message: 'Name, slug, category, and description are required.' });
      return;
    }

    const occasion = await prisma.occasion.create({
      data: {
        name,
        slug,
        categoryId,
        institutionId: institutionId || null,
        deityId: deityId || null,
        description,
        significance: significance || null,
        preparationGuide: preparationGuide || null,
        dates: gregorianDate ? {
          create: {
            gregorianDate: new Date(gregorianDate),
            year: year || new Date(gregorianDate).getFullYear(),
            region: region || 'All India',
            verificationStatus: VerificationStatus.VERIFIED
          }
        } : undefined
      },
      include: { category: true, dates: true }
    });

    res.status(201).json({ success: true, data: occasion });
  } catch (err) {
    next(err);
  }
};

export const updateOccasion = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updated = await prisma.occasion.update({
      where: { id },
      data: {
        name: data.name,
        categoryId: data.categoryId,
        institutionId: data.institutionId || null,
        deityId: data.deityId || null,
        description: data.description,
        significance: data.significance,
        preparationGuide: data.preparationGuide,
        isActive: data.isActive !== undefined ? data.isActive : true
      }
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const createSloka = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { canonicalTitle, slug, categoryId, deityId, backgroundContext, historicalNotes, traditionalNotes, significanceNotes } = req.body;

    if (!canonicalTitle || !slug || !categoryId) {
      res.status(400).json({ success: false, message: 'Title, slug, and category are required.' });
      return;
    }

    const sloka = await prisma.sloka.create({
      data: {
        canonicalTitle,
        slug,
        categoryId,
        deityId: deityId || null,
        backgroundContext,
        historicalNotes,
        traditionalNotes,
        significanceNotes,
        verificationStatus: VerificationStatus.VERIFIED,
        isPublished: true
      },
      include: { category: true, deity: true }
    });

    res.status(201).json({ success: true, data: sloka });
  } catch (err) {
    next(err);
  }
};

export const updateSloka = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updated = await prisma.sloka.update({
      where: { id },
      data: {
        canonicalTitle: data.canonicalTitle,
        categoryId: data.categoryId,
        deityId: data.deityId || null,
        backgroundContext: data.backgroundContext,
        historicalNotes: data.historicalNotes,
        traditionalNotes: data.traditionalNotes,
        significanceNotes: data.significanceNotes,
        verificationStatus: data.verificationStatus,
        isPublished: data.isPublished
      }
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const associateSlokaToOccasion = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params; // occasion id
    const { slokaId, relationshipType, displayOrder, notes } = req.body;

    if (!slokaId) {
      res.status(400).json({ success: false, message: 'Sloka ID is required.' });
      return;
    }

    const link = await prisma.occasionSloka.upsert({
      where: {
        occasionId_slokaId: { occasionId: id, slokaId }
      },
      update: {
        relationshipType: relationshipType || RelationshipType.TRADITIONAL,
        displayOrder: displayOrder || 1,
        notes
      },
      create: {
        occasionId: id,
        slokaId,
        relationshipType: relationshipType || RelationshipType.TRADITIONAL,
        displayOrder: displayOrder || 1,
        notes,
        isVerified: true
      }
    });

    res.json({ success: true, data: link });
  } catch (err) {
    next(err);
  }
};

export const removeSlokaFromOccasion = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id, slokaId } = req.params;

    await prisma.occasionSloka.delete({
      where: {
        occasionId_slokaId: { occasionId: id, slokaId }
      }
    });

    res.json({ success: true, message: 'Sloka association removed.' });
  } catch (err) {
    next(err);
  }
};

export const getReviews = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status } = req.query;

    const reviews = await prisma.contentReview.findMany({
      where: status ? { reviewStatus: status as VerificationStatus } : undefined,
      orderBy: { reviewedAt: 'desc' }
    });

    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
};

export const submitReview = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { entityType, entityId, reviewStatus, reviewNotes } = req.body;

    if (!entityType || !entityId || !reviewStatus) {
      res.status(400).json({ success: false, message: 'entityType, entityId, and reviewStatus are required.' });
      return;
    }

    const review = await prisma.contentReview.create({
      data: {
        entityType: entityType as EntityType,
        entityId,
        reviewStatus: reviewStatus as VerificationStatus,
        reviewerName: req.user?.username || 'admin',
        reviewNotes
      }
    });

    // Update target entity status if publishing
    if (entityType === 'SLOKA') {
      await prisma.sloka.update({
        where: { id: entityId },
        data: {
          verificationStatus: reviewStatus as VerificationStatus,
          isPublished: reviewStatus === VerificationStatus.PUBLISHED || reviewStatus === VerificationStatus.VERIFIED
        }
      }).catch(e => console.warn('Sloka update skipped:', e.message));
    } else if (entityType === 'VERSION') {
      await prisma.slokaVersion.update({
        where: { id: entityId },
        data: {
          verificationStatus: reviewStatus as VerificationStatus,
          isPublished: reviewStatus === VerificationStatus.PUBLISHED || reviewStatus === VerificationStatus.VERIFIED
        }
      }).catch(e => console.warn('Version update skipped:', e.message));
    }

    res.json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

export const uploadPdfResource = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ success: false, message: 'No PDF file uploaded.' });
      return;
    }

    const { title, slokaId, occasionId, licenseType, pageReference } = req.body;

    // Register Source
    const source = await prisma.source.upsert({
      where: { fileName: file.filename },
      update: {
        fileSize: file.size,
        storagePath: file.path
      },
      create: {
        title: title || file.originalname,
        fileName: file.filename,
        storagePath: file.path,
        fileSize: file.size,
        mimeType: file.mimetype,
        licenseInfo: licenseType || 'Uploaded Devotional Resource',
        verificationStatus: VerificationStatus.VERIFIED
      }
    });

    // Create Resource
    const resource = await prisma.pdfResource.create({
      data: {
        title: title || file.originalname,
        fileName: file.filename,
        filePath: file.path,
        fileSize: file.size,
        mimeType: file.mimetype,
        slokaId: slokaId || null,
        occasionId: occasionId || null,
        sourceId: source.id,
        licenseType: licenseType || 'Uploaded Devotional Resource',
        pageReference: pageReference || 'Full Document',
        verificationStatus: VerificationStatus.VERIFIED,
        isPublic: true
      }
    });

    res.status(201).json({ success: true, data: resource });
  } catch (err) {
    next(err);
  }
};

export const getAdmPresets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const presets = [
    {
      id: 'view_occasions',
      name: 'View: Occasion Parayanam Overview',
      description: 'Executes the relational view joining occasions, institutions, dates, and prescribed stotras',
      sql: 'SELECT * FROM slokasetu.v_occasion_parayanam_overview LIMIT 20;'
    },
    {
      id: 'view_multilingual',
      name: 'View: Multilingual Script Availability',
      description: 'Executes the relational view aggregating script and language editions per canonical sloka',
      sql: 'SELECT * FROM slokasetu.v_sloka_multilingual_availability LIMIT 20;'
    },
    {
      id: 'view_reviews',
      name: 'View: Pending Content Reviews',
      description: 'Executes the relational review audit view for human-in-the-loop verification',
      sql: 'SELECT * FROM slokasetu.v_pending_content_reviews;'
    },
    {
      id: 'join_occasions_summary',
      name: 'Multi-Table Join: Occasions Comprehensive Analytics',
      description: '3-way JOIN between occasions, categories, institutions, and date counts',
      sql: `SELECT o.name, c.name AS category, COALESCE(i.name, 'Pan-Indian / General') AS institution, 
COUNT(od.id) AS total_observance_dates, COUNT(os.id) AS total_prescribed_slokas
FROM slokasetu.occasions o
JOIN slokasetu.categories c ON o."categoryId" = c.id
LEFT JOIN slokasetu.institutions i ON o."institutionId" = i.id
LEFT JOIN slokasetu.occasion_dates od ON o.id = od."occasionId"
LEFT JOIN slokasetu.occasion_slokas os ON o.id = os."occasionId"
GROUP BY o.name, c.name, i.name
ORDER BY total_prescribed_slokas DESC LIMIT 15;`
    },
    {
      id: 'script_distribution',
      name: 'Script & Language Cross-Tabulation',
      description: 'Aggregates version counts across all registered Indic scripts and classical languages',
      sql: `SELECT sc.name AS script, l.name AS language, l."isClassical" AS is_classical_language,
COUNT(v.id) AS total_versions, ROUND(AVG(v."confidenceScore")::numeric, 2) AS avg_confidence
FROM slokasetu.sloka_versions v
JOIN slokasetu.scripts sc ON v."scriptId" = sc.id
JOIN slokasetu.languages l ON v."languageId" = l.id
GROUP BY sc.name, l.name, l."isClassical"
ORDER BY total_versions DESC;`
    },
    {
      id: 'fk_integrity_audit',
      name: 'Foreign Key & Referential Integrity Audit',
      description: 'Verifies zero orphan records across occasion_slokas and sloka_versions',
      sql: `SELECT 
(SELECT COUNT(*) FROM slokasetu.occasion_slokas os LEFT JOIN slokasetu.slokas s ON os."slokaId" = s.id WHERE s.id IS NULL) AS orphan_occasion_slokas,
(SELECT COUNT(*) FROM slokasetu.sloka_versions sv LEFT JOIN slokasetu.slokas s ON sv."slokaId" = s.id WHERE s.id IS NULL) AS orphan_versions,
(SELECT COUNT(*) FROM slokasetu.occasion_dates od LEFT JOIN slokasetu.occasions o ON od."occasionId" = o.id WHERE o.id IS NULL) AS orphan_dates;`
    }
  ];

  res.json({ success: true, data: presets });
};

export const runAdmQuery = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ success: false, message: 'Valid SQL query string required.' });
      return;
    }

    const trimmed = query.trim();
    // Safety check: Only permit SELECT queries or EXPLAIN queries for academic demonstration
    const upper = trimmed.toUpperCase();
    if (!upper.startsWith('SELECT') && !upper.startsWith('EXPLAIN') && !upper.startsWith('WITH')) {
      res.status(403).json({ success: false, message: 'Only SELECT and EXPLAIN queries are permitted for ADM demonstration.' });
      return;
    }

    const start = Date.now();
    const result = await prisma.$queryRawUnsafe(trimmed);
    const durationMs = Date.now() - start;
    const rows = Array.isArray(result) ? result : [];
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

    res.json({
      success: true,
      query: trimmed,
      rowCount: rows.length,
      executionTimeMs: durationMs,
      columns,
      rows,
      data: rows
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err?.message || 'SQL execution failed.' });
  }
};


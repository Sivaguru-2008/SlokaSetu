import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import path from 'path';
import fs from 'fs';
import { config } from '../config';

export const downloadResource = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const resource = await prisma.pdfResource.findUnique({
      where: { id },
      include: { source: true }
    });

    if (!resource) {
      res.status(404).json({ success: false, message: 'Requested PDF resource not found.' });
      return;
    }

    if (!resource.isPublic) {
      res.status(403).json({ success: false, message: 'Resource is currently unverified or restricted.' });
      return;
    }

    // Security: Check that filePath is valid and prevent directory traversal
    const baseStorage = path.resolve(config.storageDir);
    const resolvedPath = path.resolve(resource.filePath);

    if (!resolvedPath.startsWith(baseStorage) && !resolvedPath.includes('storage')) {
      res.status(400).json({ success: false, message: 'Invalid file path location.' });
      return;
    }

    if (!fs.existsSync(resolvedPath)) {
      res.status(404).json({
        success: false,
        message: 'The physical PDF file is currently unavailable in server storage.',
        fileName: resource.fileName
      });
      return;
    }

    // Increment download count asynchronously
    await prisma.pdfResource.update({
      where: { id: resource.id },
      data: { downloadCount: { increment: 1 } }
    }).catch(err => console.error('Failed to update download count:', err));

    // Send file securely
    const filename = resource.fileName || path.basename(resolvedPath);
    res.setHeader('Content-Type', resource.mimeType || 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);

    const fileStream = fs.createReadStream(resolvedPath);
    fileStream.pipe(res);
  } catch (err) {
    next(err);
  }
};

export const getVersionResources = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const resources = await prisma.pdfResource.findMany({
      where: {
        slokaVersionId: id,
        isPublic: true
      },
      include: { source: true }
    });

    res.json({
      success: true,
      count: resources.length,
      data: resources
    });
  } catch (err) {
    next(err);
  }
};

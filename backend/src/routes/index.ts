import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { config } from '../config';
import {
  getOccasions,
  getOccasionBySlug,
  getOccasionSlokas,
  getOccasionDates
} from '../controllers/occasionController';
import {
  getSlokas,
  getSlokaBySlug,
  getSlokaVersions,
  getSlokaRelated,
  getDailySloka
} from '../controllers/slokaController';
import { globalSearch } from '../controllers/searchController';
import {
  downloadResource,
  getVersionResources
} from '../controllers/resourceController';
import {
  getMetadata,
  getPublicStats
} from '../controllers/metaController';
import {
  adminLogin,
  getMe,
  getAdminStats,
  createOccasion,
  updateOccasion,
  createSloka,
  updateSloka,
  associateSlokaToOccasion,
  removeSlokaFromOccasion,
  getReviews,
  submitReview,
  uploadPdfResource,
  getAdmPresets,
  runAdmQuery
} from '../controllers/adminController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(config.storageDir)) {
      fs.mkdirSync(config.storageDir, { recursive: true });
    }
    cb(null, config.storageDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, uniqueSuffix + '-' + sanitized);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF documents are permitted for devotional resource uploads.'));
    }
  }
});

// --- PUBLIC ROUTES ---

// Metadata & Stats
router.get('/metadata', getMetadata);
router.get('/stats', getPublicStats);

// Occasions
router.get('/occasions', getOccasions);
router.get('/occasions/:slugOrId', getOccasionBySlug);
router.get('/occasions/:id/slokas', getOccasionSlokas);
router.get('/occasions/:id/dates', getOccasionDates);

// Slokas
router.get('/slokas', getSlokas);
router.get('/slokas/daily', getDailySloka);
router.get('/slokas/:slugOrId', getSlokaBySlug);
router.get('/slokas/:id/versions', getSlokaVersions);
router.get('/slokas/:id/related', getSlokaRelated);

// Search
router.get('/search', globalSearch);

// PDF Downloads & Resources
router.get('/versions/:id/resources', getVersionResources);
router.get('/resources/:id/download', downloadResource);

// --- ADMIN & AUTH ROUTES ---
router.post('/admin/login', adminLogin);
router.get('/admin/me', authenticateToken, getMe);
router.get('/admin/stats', authenticateToken, requireAdmin, getAdminStats);

// Occasion Admin
router.post('/admin/occasions', authenticateToken, requireAdmin, createOccasion);
router.patch('/admin/occasions/:id', authenticateToken, requireAdmin, updateOccasion);

// Sloka Admin
router.post('/admin/slokas', authenticateToken, requireAdmin, createSloka);
router.patch('/admin/slokas/:id', authenticateToken, requireAdmin, updateSloka);

// Relationship Admin
router.post('/admin/occasions/:id/slokas', authenticateToken, requireAdmin, associateSlokaToOccasion);
router.delete('/admin/occasions/:id/slokas/:slokaId', authenticateToken, requireAdmin, removeSlokaFromOccasion);

// Governance & Reviews
router.get('/admin/reviews', authenticateToken, requireAdmin, getReviews);
router.post('/admin/reviews', authenticateToken, requireAdmin, submitReview);

// Resource Management & Upload
router.post('/admin/resources', authenticateToken, requireAdmin, upload.single('file'), uploadPdfResource);

// ADM Relational Query Demonstration Console
router.get('/admin/adm/presets', authenticateToken, requireAdmin, getAdmPresets);
router.post('/admin/adm/query', authenticateToken, requireAdmin, runAdmQuery);

export default router;

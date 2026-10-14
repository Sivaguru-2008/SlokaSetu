import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { prisma } from '../lib/prisma';

const app = createApp();
let adminToken = '';
let testSlokaSlug = 'amma-dhyanam';
let testOccasionSlug = 'amrita-sri-mahaganapathi-homam-2026';
let testResourceId = '';

beforeAll(async () => {
  // Login as admin to get token
  const res = await request(app)
    .post('/api/admin/login')
    .send({
      email: 'admin@slokasetu.org',
      password: 'SlokaSetu@2026'
    });
  
  if (res.body && res.body.token) {
    adminToken = res.body.token;
  }

  // Get a test resource ID
  const resource = await prisma.pdfResource.findFirst({
    where: { isPublic: true }
  });
  if (resource) {
    testResourceId = resource.id;
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('SlokaSetu API Test Suite', () => {

  it('GET /health should return 200 and healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  it('GET /api/occasions should return list of occasions', async () => {
    const res = await request(app).get('/api/occasions');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/occasions/:slug should return detailed occasion with associated slokas', async () => {
    const res = await request(app).get(`/api/occasions/${testOccasionSlug}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe(testOccasionSlug);
    expect(res.body.data.occasionSlokas).toBeDefined();
    expect(Array.isArray(res.body.data.occasionSlokas)).toBe(true);
  });

  it('GET /api/slokas should return paginated list of slokas', async () => {
    const res = await request(app).get('/api/slokas?page=1&limit=5');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(5);
    expect(res.body.pagination.totalCount).toBeGreaterThan(0);
  });

  it('GET /api/slokas?language=sa should filter slokas by Sanskrit language', async () => {
    const res = await request(app).get('/api/slokas?language=sa');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/slokas/:slug should return individual sloka with multilingual versions', async () => {
    const res = await request(app).get(`/api/slokas/${testSlokaSlug}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.canonicalTitle).toBeDefined();
    expect(Array.isArray(res.body.data.versions)).toBe(true);
    expect(res.body.data.versions.length).toBeGreaterThan(0);
  });

  it('GET /api/search?q=Ganesha should find Ganesha related slokas and occasions', async () => {
    const res = await request(app).get('/api/search?q=Ganesha');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.results.slokas.length + res.body.results.occasions.length).toBeGreaterThan(0);
  });

  it('GET /api/resources/:id/download should download an existing valid PDF resource', async () => {
    if (!testResourceId) return;
    const res = await request(app).get(`/api/resources/${testResourceId}/download`);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/pdf');
  });

  it('GET /api/resources/:id/download should return 404 for non-existent resource', async () => {
    const res = await request(app).get('/api/resources/non-existent-uuid/download');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/admin/occasions without token should be rejected with 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/admin/occasions')
      .send({ name: 'Unauthorized Occasion' });
    expect(res.status).toBe(401);
  });

  it('POST /api/admin/slokas with valid admin token should succeed', async () => {
    const category = await prisma.category.findFirst();
    const res = await request(app)
      .post('/api/admin/slokas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        canonicalTitle: 'Test Automated Sloka',
        slug: `test-automated-sloka-${Date.now()}`,
        categoryId: category?.id,
        backgroundContext: 'Automated integration test context'
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);

    // Clean up test sloka
    if (res.body.data?.id) {
      await prisma.sloka.delete({ where: { id: res.body.data.id } });
    }
  });

  it('Foreign key constraint verification: deleting non-existent relation should fail gracefully', async () => {
    const res = await request(app)
      .delete('/api/admin/occasions/invalid-id/slokas/invalid-sloka')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});

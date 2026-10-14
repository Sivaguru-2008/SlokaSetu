import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { prisma } from '../lib/prisma';

const app = createApp();

beforeAll(async () => {
  // Ensure DB connection is active
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('SlokaSetu End-to-End Workflow Verification', () => {

  it('Step 1: User opens homepage & loads public statistics and upcoming occasions', async () => {
    const statsRes = await request(app).get('/api/stats');
    expect(statsRes.status).toBe(200);
    expect(statsRes.body.data.totalSlokas).toBeGreaterThanOrEqual(27);
    expect(statsRes.body.data.totalVersions).toBeGreaterThanOrEqual(81);
    expect(statsRes.body.data.totalOccasions).toBeGreaterThanOrEqual(7);

    const occasionsRes = await request(app).get('/api/occasions');
    expect(occasionsRes.status).toBe(200);
    expect(occasionsRes.body.data.length).toBeGreaterThan(0);
  });

  it('Step 2: User opens calendar and queries July 2026 observances', async () => {
    const calRes = await request(app).get('/api/occasions?year=2026');
    expect(calRes.status).toBe(200);
    const homam = calRes.body.data.find((o: any) => o.slug === 'amrita-sri-mahaganapathi-homam-2026');
    expect(homam).toBeDefined();
    expect(homam.dates[0].gregorianDate).toContain('2026-07-22');
  });

  it('Step 3: User opens occasion details for Amrita Sri Mahaganapathi Homam', async () => {
    const occRes = await request(app).get('/api/occasions/amrita-sri-mahaganapathi-homam-2026');
    expect(occRes.status).toBe(200);
    expect(occRes.body.data.name).toBe('Sri Mahaganapathi Homam – Chennai Campus');
    expect(occRes.body.data.institution.code).toBe('ASE-CHN');
    expect(occRes.body.data.institution.campus).toBe('Chennai Campus');
  });

  it('Step 4: Website retrieves associated parayanam slokas with relationship types', async () => {
    const occRes = await request(app).get('/api/occasions/amrita-sri-mahaganapathi-homam-2026');
    const slokas = occRes.body.data.occasionSlokas;
    expect(slokas.length).toBeGreaterThanOrEqual(10);
    
    // First item is Amma Dhyanam (Official Programme)
    expect(slokas[0].sloka.slug).toBe('amma-dhyanam');
    expect(slokas[0].relationshipType).toBe('OFFICIAL_PROGRAMME');

    // Concluding item is Kshama Aparadha Stotram (Curated Recommendation)
    const kshama = slokas.find((s: any) => s.sloka.slug === 'kshama-aparadha-stotram');
    expect(kshama).toBeDefined();
    expect(kshama.relationshipType).toBe('CURATED_RECOMMENDATION');
  });

  it('Step 5: User opens a sloka page (Sri Maha Ganesha Pancharatnam)', async () => {
    const slokaRes = await request(app).get('/api/slokas/maha-ganesha-pancharatnam');
    expect(slokaRes.status).toBe(200);
    expect(slokaRes.body.data.canonicalTitle).toBe('Sri Maha Ganesha Pancharatnam');
    expect(slokaRes.body.data.category.name).toBe('Pancharatnam');
    expect(slokaRes.body.data.deity.name).toBe('Ganesha');
    expect(slokaRes.body.data.historicalNotes).toContain('Adi Shankaracharya');
  });

  it('Step 6: Website displays available text editions across Latin, Telugu, and Tamil scripts', async () => {
    const slokaRes = await request(app).get('/api/slokas/maha-ganesha-pancharatnam');
    const versions = slokaRes.body.data.versions;
    expect(versions.length).toBeGreaterThanOrEqual(3);

    const scriptCodes = versions.map((v: any) => v.script.code);
    expect(scriptCodes).toContain('Latn'); // Roman IAST
    expect(scriptCodes).toContain('Telu'); // Telugu script
    expect(scriptCodes).toContain('Taml'); // Tamil script
  });

  it('Step 7: User selects a language/script version and inspects verse segmentation', async () => {
    const slokaRes = await request(app).get('/api/slokas/maha-ganesha-pancharatnam');
    const teluguVer = slokaRes.body.data.versions.find((v: any) => v.script.code === 'Telu');
    expect(teluguVer).toBeDefined();
    expect(teluguVer.textContent).toContain('మోదకం');
    expect(teluguVer.verseData.length).toBeGreaterThan(0);
  });

  it('Step 8: User downloads an available PDF resource and receives valid PDF bytes', async () => {
    const slokaRes = await request(app).get('/api/slokas/maha-ganesha-pancharatnam');
    const resource = slokaRes.body.data.pdfResources[0];
    expect(resource).toBeDefined();

    const dlRes = await request(app).get(`/api/resources/${resource.id}/download`);
    expect(dlRes.status).toBe(200);
    expect(dlRes.headers['content-type']).toContain('application/pdf');
    expect(dlRes.headers['content-disposition']).toContain('attachment; filename=');
    expect(dlRes.body.length).toBeGreaterThan(1000); // Binary PDF content
  });
});

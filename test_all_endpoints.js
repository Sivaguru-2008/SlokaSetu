// test_all_endpoints.js
// Automated verification script to test every response and endpoint in SlokaSetu

const BASE_URL = 'http://localhost:5000';
let adminToken = null;
let sampleOccasionId = null;
let sampleSlokaId = null;
let sampleResourceId = null;

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = { ...(options.headers || {}) };
  if (adminToken && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${adminToken}`;
  }
  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }
  
  const res = await fetch(url, { ...options, headers });
  const contentType = res.headers.get('content-type') || '';
  let data = null;
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else if (contentType.includes('application/pdf')) {
    const buf = await res.arrayBuffer();
    data = { isPdf: true, byteLength: buf.byteLength };
  } else {
    data = await res.text();
  }
  return { status: res.status, data, headers: res.headers };
}

async function runAllTests() {
  console.log('====================================================');
  console.log('SLOKASETU COMPREHENSIVE ENDPOINT & RESPONSE AUDIT');
  console.log('====================================================\n');

  // 1. Health check
  console.log('1. Health Check Endpoint');
  {
    const res = await request('/health');
    assert(res.status === 200, 'GET /health returns HTTP 200');
    assert(res.data.status === 'healthy', 'Health status is "healthy"');
    assert(res.data.service === 'SlokaSetu Backend API', 'Service name matches');
  }

  // 2. Metadata Endpoint
  console.log('\n2. Metadata Endpoint');
  {
    const res = await request('/api/metadata');
    assert(res.status === 200, 'GET /api/metadata returns HTTP 200');
    assert(res.data.success === true, 'Metadata success flag is true');
    assert(Array.isArray(res.data.data.categories) && res.data.data.categories.length > 0, `Loaded ${res.data.data.categories?.length} categories`);
    assert(Array.isArray(res.data.data.languages) && res.data.data.languages.length >= 7, `Loaded ${res.data.data.languages?.length} languages`);
    assert(Array.isArray(res.data.data.scripts) && res.data.data.scripts.length >= 6, `Loaded ${res.data.data.scripts?.length} scripts`);
    assert(Array.isArray(res.data.data.deities) && res.data.data.deities.length > 0, `Loaded ${res.data.data.deities?.length} deities`);
  }

  // 3. Stats Endpoint
  console.log('\n3. Public Statistics Endpoint');
  {
    const res = await request('/api/stats');
    assert(res.status === 200, 'GET /api/stats returns HTTP 200');
    assert(res.data.success === true, 'Stats success flag is true');
    assert(res.data.data.totalOccasions > 0, `Occasions count: ${res.data.data.totalOccasions}`);
    assert(res.data.data.totalSlokas > 0, `Slokas count: ${res.data.data.totalSlokas}`);
    assert(res.data.data.totalVersions > 0, `Multilingual versions count: ${res.data.data.totalVersions}`);
    assert(res.data.data.totalPdfResources > 0, `PDF resources count: ${res.data.data.totalPdfResources}`);
  }

  // 4. Occasions Endpoints
  console.log('\n4. Occasions Endpoints');
  {
    const res = await request('/api/occasions');
    assert(res.status === 200, 'GET /api/occasions returns HTTP 200');
    assert(Array.isArray(res.data.data) && res.data.data.length > 0, `Retrieved ${res.data.data.length} total occasions`);
    
    // Pick Amrita occasion or first occasion
    const amritaOccasion = res.data.data.find(o => o.slug === 'amrita-sri-mahaganapathi-homam-2026') || res.data.data[0];
    sampleOccasionId = amritaOccasion.id;
    assert(Boolean(sampleOccasionId), `Identified test occasion: "${amritaOccasion.name}" (${amritaOccasion.slug})`);

    // Filter by year
    const res2026 = await request('/api/occasions?year=2026');
    assert(res2026.status === 200, 'GET /api/occasions?year=2026 returns HTTP 200');
    assert(res2026.data.data.length > 0, `Filtered occasions in 2026: ${res2026.data.data.length}`);

    // Filter by search query
    const resSearch = await request('/api/occasions?search=Ganesha');
    assert(resSearch.status === 200, 'GET /api/occasions?search=Ganesha returns HTTP 200');
    assert(resSearch.data.data.length > 0, `Searched occasions matching "Ganesha": ${resSearch.data.data.length}`);

    // Occasion by Slug
    const resSlug = await request(`/api/occasions/${amritaOccasion.slug}`);
    assert(resSlug.status === 200, `GET /api/occasions/${amritaOccasion.slug} returns HTTP 200`);
    assert(resSlug.data.data.name === amritaOccasion.name, 'Occasion details name matches');
    assert(Array.isArray(resSlug.data.data.occasionSlokas), 'Occasion contains associated slokas list');
    assert(resSlug.data.data.occasionSlokas.length > 0, `Associated slokas: ${resSlug.data.data.occasionSlokas.length}`);

    // Occasion Slokas sub-resource
    const resOccSlokas = await request(`/api/occasions/${sampleOccasionId}/slokas`);
    assert(resOccSlokas.status === 200, `GET /api/occasions/:id/slokas returns HTTP 200`);
    assert(Array.isArray(resOccSlokas.data.data) && resOccSlokas.data.data.length > 0, `Retrieved ${resOccSlokas.data.data.length} occasion slokas`);

    // Occasion Dates sub-resource
    const resOccDates = await request(`/api/occasions/${sampleOccasionId}/dates`);
    assert(resOccDates.status === 200, `GET /api/occasions/:id/dates returns HTTP 200`);
    assert(Array.isArray(resOccDates.data.data) && resOccDates.data.data.length > 0, `Retrieved ${resOccDates.data.data.length} scheduled dates`);
  }

  // 5. Slokas Endpoints
  console.log('\n5. Slokas Endpoints');
  {
    const res = await request('/api/slokas');
    assert(res.status === 200, 'GET /api/slokas returns HTTP 200');
    assert(Array.isArray(res.data.data) && res.data.data.length > 0, `Retrieved ${res.data.data.length} slokas on page 1`);
    assert(Boolean(res.data.pagination), 'Pagination metadata present in slokas list');
    
    // Test Daily Sloka
    const resDaily = await request('/api/slokas/daily');
    assert(resDaily.status === 200, 'GET /api/slokas/daily returns HTTP 200');
    assert(resDaily.data.success === true, 'Daily sloka success flag is true');
    assert(Boolean(resDaily.data.data.canonicalTitle), `Today's Daily Sloka: "${resDaily.data.data.canonicalTitle}"`);

    // Pick Maha Ganesha Pancharatnam
    const resSlug = await request(`/api/slokas/maha-ganesha-pancharatnam`);
    assert(resSlug.status === 200, `GET /api/slokas/maha-ganesha-pancharatnam returns HTTP 200`);
    const ganeshaSloka = resSlug.data.data;
    sampleSlokaId = ganeshaSloka.id;
    assert(Boolean(sampleSlokaId), `Identified test sloka: "${ganeshaSloka.canonicalTitle}" (${ganeshaSloka.slug})`);
    assert(ganeshaSloka.canonicalTitle.includes('Maha Ganesha Pancharatnam'), 'Sloka canonical title matches');
    assert(Array.isArray(ganeshaSloka.versions) && ganeshaSloka.versions.length >= 6, `Available multilingual versions: ${ganeshaSloka.versions.length}`);
    
    // Check if scripts include Deva, Latn, Telu, Taml, Knda, Mlym
    const scriptsFound = new Set(ganeshaSloka.versions.map(v => v.script?.code));
    console.log(`    Scripts available for "${ganeshaSloka.slug}": ${Array.from(scriptsFound).join(', ')}`);
    assert(scriptsFound.has('Deva') && scriptsFound.has('Latn') && scriptsFound.has('Telu') && scriptsFound.has('Taml'), 'Contains Devanagari, Latin/IAST, Telugu, and Tamil versions');

    // Sloka Versions sub-resource
    const resVersions = await request(`/api/slokas/${sampleSlokaId}/versions`);
    assert(resVersions.status === 200, `GET /api/slokas/:id/versions returns HTTP 200`);
    assert(Array.isArray(resVersions.data.data) && resVersions.data.data.length > 0, `Versions sub-resource returned ${resVersions.data.data.length} items`);

    // Sloka Related sub-resource
    const resRelated = await request(`/api/slokas/${sampleSlokaId}/related`);
    assert(resRelated.status === 200, `GET /api/slokas/:id/related returns HTTP 200`);
    assert(Array.isArray(resRelated.data.data.relatedByDeity), 'Related by deity array present');
    assert(Array.isArray(resRelated.data.data.relatedByOccasions), 'Related occasions array present');
  }

  // 6. Global Search Endpoints
  console.log('\n6. Global Search Endpoints');
  {
    for (const query of ['Ganesha', 'Amma', 'Shiva', 'Vishnu']) {
      const res = await request(`/api/search?q=${encodeURIComponent(query)}`);
      assert(res.status === 200, `GET /api/search?q=${query} returns HTTP 200`);
      assert(res.data.success === true, `Search for "${query}" successful`);
      const totalResults = (res.data.data.slokas?.length || 0) + (res.data.data.occasions?.length || 0);
      assert(totalResults > 0, `Query "${query}" returned ${totalResults} combined results`);
    }
  }

  // 7. PDF Downloads and Resources
  console.log('\n7. PDF Resource Downloads');
  {
    // Fetch a version that has PDF resources or check occasion resources
    const occRes = await request(`/api/occasions/${sampleOccasionId}`);
    const occPdfs = occRes.data.data.pdfResources || [];
    if (occPdfs.length > 0) {
      sampleResourceId = occPdfs[0].id;
    } else {
      // Find any resource
      const slokaRes = await request(`/api/slokas/${sampleSlokaId}`);
      for (const v of slokaRes.data.data.versions || []) {
        if (v.pdfResources && v.pdfResources.length > 0) {
          sampleResourceId = v.pdfResources[0].id;
          break;
        }
      }
    }

    assert(Boolean(sampleResourceId), `Located test PDF resource ID: ${sampleResourceId}`);
    if (sampleResourceId) {
      const downloadRes = await request(`/api/resources/${sampleResourceId}/download`);
      assert(downloadRes.status === 200, `GET /api/resources/:id/download returns HTTP 200`);
      assert(downloadRes.data.isPdf === true, 'Response content-type is application/pdf');
      assert(downloadRes.data.byteLength > 100, `Downloaded valid binary PDF of ${downloadRes.data.byteLength} bytes`);
    }

    // Negative test: 404 on invalid resource
    const invalidRes = await request('/api/resources/00000000-0000-0000-0000-000000000000/download');
    assert(invalidRes.status === 404, 'Invalid resource ID correctly returns HTTP 404');
  }

  // 8. Admin Authentication & Role Checks
  console.log('\n8. Admin Authentication & RBAC Protection');
  {
    // Negative test: unauthorized access to admin stats
    const unauthRes = await request('/api/admin/stats');
    assert(unauthRes.status === 401, 'Unauthorized request without token returns HTTP 401');

    // Admin Login
    const loginRes = await request('/api/admin/login', {
      method: 'POST',
      body: { email: 'admin@slokasetu.org', password: 'SlokaSetu@2026' }
    });
    assert(loginRes.status === 200, 'POST /api/admin/login returns HTTP 200');
    assert(Boolean(loginRes.data.token), 'JWT token returned on valid login');
    assert(loginRes.data.user.role === 'ADMIN', 'Logged in user has ADMIN role');
    adminToken = loginRes.data.token;

    // Admin Me
    const meRes = await request('/api/admin/me');
    assert(meRes.status === 200, 'GET /api/admin/me with token returns HTTP 200');
    assert(meRes.data.user.email === 'admin@slokasetu.org', 'Identified user as admin@slokasetu.org');

    // Admin Stats
    const adminStatsRes = await request('/api/admin/stats');
    assert(adminStatsRes.status === 200, 'GET /api/admin/stats with admin token returns HTTP 200');
    assert(adminStatsRes.data.data.publishedSlokas > 0, `Admin reported published slokas: ${adminStatsRes.data.data.publishedSlokas}`);

    // Admin Reviews
    const reviewsRes = await request('/api/admin/reviews');
    assert(reviewsRes.status === 200, 'GET /api/admin/reviews returns HTTP 200');
    assert(Array.isArray(reviewsRes.data.data), 'Pending reviews array returned');
  }

  // 9. ADM Relational SQL Console Endpoints
  console.log('\n9. ADM Relational SQL Console Endpoints');
  {
    // Presets
    const presetsRes = await request('/api/admin/adm/presets');
    assert(presetsRes.status === 200, 'GET /api/admin/adm/presets returns HTTP 200');
    assert(Array.isArray(presetsRes.data.data) && presetsRes.data.data.length === 6, `Returned exactly 6 curated demonstration queries`);

    // Test each preset query execution
    for (const preset of presetsRes.data.data) {
      const qRes = await request('/api/admin/adm/query', {
        method: 'POST',
        body: { query: preset.sql }
      });
      assert(qRes.status === 200, `POST /api/admin/adm/query: "${preset.name}" returned HTTP 200`);
      assert(qRes.data.success === true, `Query succeeded in ${qRes.data.executionTimeMs} ms`);
      assert(Array.isArray(qRes.data.columns) && (qRes.data.rowCount === 0 || qRes.data.columns.length > 0), `Columns valid (${qRes.data.columns?.length || 0} cols)`);
      assert(qRes.data.rowCount >= 0, `Returned row count: ${qRes.data.rowCount}`);
    }

    // Safety checks: Disallow DROP / DELETE / INSERT in ADM runner
    const unsafeRes = await request('/api/admin/adm/query', {
      method: 'POST',
      body: { query: 'DELETE FROM slokasetu.slokas;' }
    });
    assert(unsafeRes.status === 403, 'Destructive query (DELETE) blocked with HTTP 403 Forbidden');
  }

  console.log('\n====================================================');
  console.log(`AUDIT COMPLETE: ${passedTests}/${totalTests} TESTS PASSED (${failedTests} FAILED)`);
  console.log('====================================================');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAllTests().catch(err => {
  console.error('Test execution failed with fatal error:', err);
  process.exit(1);
});

import { PrismaClient, CategoryType, VerificationStatus, VersionType, RelationshipType, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SlokaSetu Database with verified datasets...');

  // 1. Languages
  const languagesData = [
    { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', isClassical: true },
    { code: 'en', name: 'English', nativeName: 'English', isClassical: false },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', isClassical: true },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', isClassical: true }
  ];

  const languageMap = new Map<string, string>();
  for (const lang of languagesData) {
    const record = await prisma.language.upsert({
      where: { code: lang.code },
      update: {},
      create: lang
    });
    languageMap.set(lang.code, record.id);
  }

  // 2. Scripts
  const scriptsData = [
    { code: 'Latn', name: 'Latin (IAST Transliteration)', nativeName: 'Romanized', direction: 'ltr' },
    { code: 'Deva', name: 'Devanagari', nativeName: 'देवनागरी', direction: 'ltr' },
    { code: 'Telu', name: 'Telugu', nativeName: 'తెలుగు లిపి', direction: 'ltr' },
    { code: 'Taml', name: 'Tamil', nativeName: 'தமிழ் வரிவடிவம்', direction: 'ltr' }
  ];

  const scriptMap = new Map<string, string>();
  for (const sc of scriptsData) {
    const record = await prisma.script.upsert({
      where: { code: sc.code },
      update: {},
      create: sc
    });
    scriptMap.set(sc.code, record.id);
  }

  // 3. Institutions
  const aseChn = await prisma.institution.upsert({
    where: { code: 'ASE-CHN' },
    update: {},
    create: {
      name: 'Amrita School of Engineering, Chennai',
      code: 'ASE-CHN',
      campus: 'Chennai Campus',
      department: 'Department of Amrita Darshanam',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India'
    }
  });

  // 4. Categories
  const categoriesData = [
    { name: 'Dhyana Sloka', slug: 'dhyana-sloka', description: 'Meditative contemplation verses used for invocation and focus', type: CategoryType.SLOKA },
    { name: 'Stotram', slug: 'stotram', description: 'Classical hymns of praise and adoration', type: CategoryType.SLOKA },
    { name: 'Ashtakam', slug: 'ashtakam', description: 'Eight-stanza poetic hymns celebrated in classical Sanskrit literature', type: CategoryType.SLOKA },
    { name: 'Pancharatnam', slug: 'pancharatnam', description: 'Five-jeweled hymn structures of concise meter and rhythm', type: CategoryType.SLOKA },
    { name: 'Prapatti', slug: 'prapatti', description: 'Hymns expressing total self-surrender (Sharanagati) to the divine', type: CategoryType.SLOKA },
    { name: 'Namavali', slug: 'namavali', description: 'Lyrical congregational chanting of holy names', type: CategoryType.SLOKA },
    { name: 'Sahasranamam', slug: 'sahasranamam', description: 'The thousand sacred names from Puranic literature', type: CategoryType.SLOKA },
    { name: 'Amrita Institutional Occasion', slug: 'amrita-institutional-occasion', description: 'Spiritual observances and programmes at Amrita Vishwa Vidyapeetham', type: CategoryType.OCCASION },
    { name: 'Hindu Festival', slug: 'hindu-festival', description: 'Traditional pan-Indian and regional Hindu festivals and tithi observances', type: CategoryType.OCCASION }
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    });
    categoryMap.set(cat.name, record.id);
  }

  // 5. Deities
  const deitiesData = [
    { name: 'Ganesha', slug: 'ganesha', description: 'Lord of beginnings, wisdom, intellect, and remover of obstacles (Vighnaharta)', iconName: 'Compass' },
    { name: 'Shiva', slug: 'shiva', description: 'The auspicious supreme ascetic, source of yoga, meditation, and cosmic dance', iconName: 'Flame' },
    { name: 'Vishnu', slug: 'vishnu', description: 'The preserver and sustainer of cosmic order (Dharma), who incarnates in diverse ages', iconName: 'Sun' },
    { name: 'Venkateswara', slug: 'venkateswara', description: 'Lord of the Seven Hills (Srinivasa / Balaji), refuge of seekers in Kali Yuga', iconName: 'Sparkles' },
    { name: 'Lakshmi', slug: 'lakshmi', description: 'Goddess of auspiciousness, spiritual wealth, moral courage, and noble prosperity', iconName: 'Heart' },
    { name: 'Lalita Tripurasundari', slug: 'lalita-tripurasundari', description: 'The supreme Divine Mother, embodiment of universal beauty, compassion, and non-dual consciousness', iconName: 'Crown' },
    { name: 'Mata Amritanandamayi Devi', slug: 'amma', description: 'Beloved spiritual master, humanitarian leader, and chancellor of Amrita Vishwa Vidyapeetham', iconName: 'Flower2' },
    { name: 'Guru', slug: 'guru', description: 'The divine principle of the spiritual teacher dispelling darkness and leading to realization', iconName: 'BookOpen' }
  ];

  const deityMap = new Map<string, string>();
  for (const d of deitiesData) {
    const record = await prisma.deity.upsert({
      where: { slug: d.slug },
      update: {},
      create: d
    });
    deityMap.set(d.name, record.id);
  }

  // 6. Sources (Four verified PDF source documents)
  const storageDir = path.resolve(__dirname, '../storage/pdfs');
  const sourcesData = [
    {
      title: 'Sri Mahaganapathi Homam – Chennai Campus Parayanam Programme',
      fileName: 'SRI MAHAGANAPATHI HOMAM JULY.pdf',
      authorPublisher: 'Amrita School of Engineering, Chennai – Department of Amrita Darshanam',
      edition: 'July 2026 Academic Edition',
      licenseInfo: 'Institutional Academic & Devotional Archive'
    },
    {
      title: 'Devotional Stotra Sangraha (Roman Transliteration Edition)',
      fileName: 'ENGLISH.pdf',
      authorPublisher: 'Amrita Devotional Publications',
      edition: 'Comprehensive English Transliteration Edition',
      licenseInfo: 'Educational & Devotional Use'
    },
    {
      title: 'Devotional Stotra Sangraha (Telugu Script Edition)',
      fileName: 'TELUGU.pdf',
      authorPublisher: 'Amrita Devotional Publications',
      edition: 'Telugu Script Devotional Edition',
      licenseInfo: 'Educational & Devotional Use'
    },
    {
      title: 'Devotional Stotra Sangraha (Tamil Script Edition)',
      fileName: 'TAMIL.pdf',
      authorPublisher: 'Amrita Devotional Publications',
      edition: 'Tamil Script Devotional Edition',
      licenseInfo: 'Educational & Devotional Use'
    }
  ];

  const sourceMap = new Map<string, string>();
  for (const s of sourcesData) {
    const fullPath = path.join(storageDir, s.fileName);
    let fileSize = 0;
    if (fs.existsSync(fullPath)) {
      fileSize = fs.statSync(fullPath).size;
    }
    const record = await prisma.source.upsert({
      where: { fileName: s.fileName },
      update: { fileSize, storagePath: fullPath },
      create: {
        title: s.title,
        fileName: s.fileName,
        authorPublisher: s.authorPublisher,
        edition: s.edition,
        licenseInfo: s.licenseInfo,
        fileSize,
        storagePath: fullPath,
        verificationStatus: VerificationStatus.VERIFIED
      }
    });
    sourceMap.set(s.fileName, record.id);
  }

  // 7. Admin User
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('SlokaSetu@2026', salt);
  await prisma.user.upsert({
    where: { email: 'admin@slokasetu.org' },
    update: { passwordHash, role: UserRole.ADMIN },
    create: {
      username: 'sloka_admin',
      email: 'admin@slokasetu.org',
      passwordHash,
      role: UserRole.ADMIN
    }
  });

  // 8. Slokas and Multilingual Versions
  const slokasCatalogPath = path.resolve(__dirname, '../../data/intermediate/slokas_catalog.json');
  const versionsCatalogPath = path.resolve(__dirname, '../../data/intermediate/versions_catalog.json');

  const slokasCatalog = JSON.parse(fs.readFileSync(slokasCatalogPath, 'utf-8'));
  const versionsCatalog = JSON.parse(fs.readFileSync(versionsCatalogPath, 'utf-8'));

  const slokaMap = new Map<string, string>();

  for (const s of slokasCatalog) {
    const categoryId = categoryMap.get(s.category) || categoryMap.get('Stotram')!;
    const deityId = deityMap.get(s.primaryDeity) || null;
    const sourceId = sourceMap.get('ENGLISH.pdf') || null;

    const sloka = await prisma.sloka.upsert({
      where: { slug: s.slug },
      update: {
        canonicalTitle: s.canonicalTitle,
        categoryId,
        deityId,
        backgroundContext: s.backgroundContext,
        historicalNotes: s.historicalNotes,
        traditionalNotes: s.traditionalNotes,
        significanceNotes: s.significanceNotes,
        isPublished: true,
        verificationStatus: VerificationStatus.VERIFIED
      },
      create: {
        slug: s.slug,
        canonicalTitle: s.canonicalTitle,
        categoryId,
        deityId,
        backgroundContext: s.backgroundContext,
        historicalNotes: s.historicalNotes,
        traditionalNotes: s.traditionalNotes,
        significanceNotes: s.significanceNotes,
        primarySourceId: sourceId,
        isPublished: true,
        verificationStatus: VerificationStatus.VERIFIED
      }
    });
    slokaMap.set(s.slug, sloka.id);

    // Also link deity in junction table
    if (deityId) {
      await prisma.slokaDeity.upsert({
        where: { slokaId_deityId: { slokaId: sloka.id, deityId } },
        update: {},
        create: { slokaId: sloka.id, deityId, isPrimary: true }
      });
    }

    // Add phonetic aliases
    const words = s.canonicalTitle.replace(/Sri|Sree|Shree/g, '').trim().split(' ');
    if (words.length > 0 && words[0]) {
      await prisma.slokaAlias.createMany({
        data: [
          { slokaId: sloka.id, aliasTitle: words[0], aliasType: 'PHONETIC' },
          { slokaId: sloka.id, aliasTitle: s.canonicalTitle.replace(/Sri /i, ''), aliasType: 'TRANSLITERATION' }
        ],
        skipDuplicates: true
      });
    }
  }

  // Create Versions
  for (const v of versionsCatalog) {
    const slokaId = slokaMap.get(v.slokaSlug);
    if (!slokaId) continue;

    const languageId = languageMap.get(v.languageCode);
    const scriptId = scriptMap.get(v.scriptCode);
    const sourceId = sourceMap.get(v.sourceFile);

    if (!languageId || !scriptId) continue;

    const version = await prisma.slokaVersion.create({
      data: {
        slokaId,
        languageId,
        scriptId,
        versionType: v.versionType as VersionType,
        textContent: v.textContent,
        verseData: v.verseData,
        sourceId,
        pageStart: v.pageStart,
        pageEnd: v.pageEnd,
        verificationStatus: VerificationStatus.VERIFIED,
        confidenceScore: v.confidenceScore,
        isPublished: true
      }
    });

    // Create a PDF resource linked to this version and sloka
    if (sourceId && v.sourceFile) {
      const sourceRecord = sourcesData.find(sd => sd.fileName === v.sourceFile);
      const filePath = path.join(storageDir, v.sourceFile);
      const fileSize = fs.existsSync(filePath) ? fs.statSync(filePath).size : 0;

      await prisma.pdfResource.create({
        data: {
          title: `${v.slokaSlug.toUpperCase()} - ${v.scriptCode} Edition (${v.sourceFile})`,
          slokaId,
          slokaVersionId: version.id,
          sourceId,
          fileName: v.sourceFile,
          filePath,
          fileSize,
          pageReference: `Pages ${v.pageStart}–${v.pageEnd}`,
          licenseType: sourceRecord?.licenseInfo || 'Educational Archive',
          verificationStatus: VerificationStatus.VERIFIED,
          isPublic: true
        }
      });
    }
  }

  // 9. Occasions and Dates
  const occasionsCatalogPath = path.resolve(__dirname, '../../data/intermediate/occasions_catalog.json');
  const occasionsCatalog = JSON.parse(fs.readFileSync(occasionsCatalogPath, 'utf-8'));

  for (const occ of occasionsCatalog) {
    const categoryId = categoryMap.get(occ.category) || categoryMap.get('Hindu Festival')!;
    const institutionId = occ.institutionCode === 'ASE-CHN' ? aseChn.id : null;
    const deityId = deityMap.get(occ.primaryDeity) || null;
    const sourceId = sourceMap.get(occ.sourceFile) || null;

    const occasion = await prisma.occasion.upsert({
      where: { slug: occ.slug },
      update: {
        name: occ.name,
        categoryId,
        institutionId,
        deityId,
        description: occ.description,
        significance: occ.significance,
        preparationGuide: occ.preparationGuide,
        primarySourceId: sourceId,
        isActive: true
      },
      create: {
        slug: occ.slug,
        name: occ.name,
        categoryId,
        institutionId,
        deityId,
        description: occ.description,
        significance: occ.significance,
        preparationGuide: occ.preparationGuide,
        primarySourceId: sourceId,
        isActive: true
      }
    });

    // Dates
    for (const d of occ.dates) {
      await prisma.occasionDate.create({
        data: {
          occasionId: occasion.id,
          gregorianDate: new Date(d.gregorianDate),
          year: d.year,
          region: d.region,
          calendarConvention: d.calendarConvention,
          verificationStatus: VerificationStatus.VERIFIED,
          sourceReference: d.sourceReference
        }
      });
    }

    // Occasion-Sloka associations
    for (const link of occ.slokaSlugs) {
      const slokaId = slokaMap.get(link.slug);
      if (slokaId) {
        await prisma.occasionSloka.upsert({
          where: { occasionId_slokaId: { occasionId: occasion.id, slokaId } },
          update: {
            relationshipType: link.relationshipType as RelationshipType,
            displayOrder: link.order,
            notes: link.notes,
            isVerified: true
          },
          create: {
            occasionId: occasion.id,
            slokaId,
            relationshipType: link.relationshipType as RelationshipType,
            displayOrder: link.order,
            notes: link.notes,
            isVerified: true
          }
        });
      }
    }

    // Also link PDF resource to occasion
    if (sourceId && occ.sourceFile) {
      const filePath = path.join(storageDir, occ.sourceFile);
      const fileSize = fs.existsSync(filePath) ? fs.statSync(filePath).size : 0;
      await prisma.pdfResource.create({
        data: {
          title: `${occ.name} - Official Document (${occ.sourceFile})`,
          occasionId: occasion.id,
          sourceId,
          fileName: occ.sourceFile,
          filePath,
          fileSize,
          pageReference: 'Complete Document',
          licenseType: 'Institutional Document',
          verificationStatus: VerificationStatus.VERIFIED,
          isPublic: true
        }
      });
    }
  }

  // 10. Sample Content Reviews for Governance Demonstrations
  await prisma.contentReview.createMany({
    data: [
      {
        entityType: 'SLOKA',
        entityId: slokaMap.get('amma-dhyanam') || 'sample',
        reviewerName: 'Dr. S. Ramakrishnan (Amrita Darshanam)',
        reviewStatus: VerificationStatus.PUBLISHED,
        reviewNotes: 'Verified against traditional Amritapuri Ashram prayer manual and institutional event schedule.',
        reviewedAt: new Date('2026-07-20T10:00:00Z')
      },
      {
        entityType: 'OCCASION',
        entityId: 'amrita-sri-mahaganapathi-homam-2026',
        reviewerName: 'Amrita Darshanam Review Committee',
        reviewStatus: VerificationStatus.VERIFIED,
        reviewNotes: 'Official circular and parayanam schedule verified from SRI MAHAGANAPATHI HOMAM JULY.pdf.',
        reviewedAt: new Date('2026-07-21T14:30:00Z')
      },
      {
        entityType: 'VERSION',
        entityId: slokaMap.get('maha-ganesha-pancharatnam') || 'sample',
        reviewerName: 'Vidwan K. Narayanan (Sanskrit Reviewer)',
        reviewStatus: VerificationStatus.VERIFIED,
        reviewNotes: 'Textual integrity verified across Latin, Telugu, and Tamil script representations.',
        reviewedAt: new Date('2026-07-21T16:00:00Z')
      }
    ]
  });

  console.log('Database seeding successfully finished!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

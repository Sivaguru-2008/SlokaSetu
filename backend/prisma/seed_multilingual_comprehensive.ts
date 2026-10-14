import { PrismaClient, RelationshipType, VerificationStatus, VersionType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Comprehensive Multilingual Slokas & Hindu Calendar Dataset...');

  const dataPath = path.resolve(__dirname, '../../data/intermediate/multilingual_comprehensive_dataset.json');
  if (!fs.existsSync(dataPath)) {
    throw new Error(`Data file not found at ${dataPath}`);
  }
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // 1. Upsert Languages
  const languagesData = [
    { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', isClassical: true },
    { code: 'en', name: 'English', nativeName: 'English', isClassical: false },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', isClassical: true },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', isClassical: true },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', isClassical: true },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', isClassical: true },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', isClassical: false }
  ];

  const langMap = new Map<string, string>();
  for (const l of languagesData) {
    const rec = await prisma.language.upsert({
      where: { code: l.code },
      update: { name: l.name, nativeName: l.nativeName, isClassical: l.isClassical },
      create: l
    });
    langMap.set(l.code, rec.id);
  }

  // 2. Upsert Scripts
  const scriptsData = [
    { code: 'Latn', name: 'Latin (IAST Transliteration)', nativeName: 'Romanized', direction: 'ltr' },
    { code: 'Deva', name: 'Devanagari', nativeName: 'देवनागरी', direction: 'ltr' },
    { code: 'Telu', name: 'Telugu', nativeName: 'తెలుగు లిపి', direction: 'ltr' },
    { code: 'Taml', name: 'Tamil', nativeName: 'தமிழ் வரிவடிவம்', direction: 'ltr' },
    { code: 'Knda', name: 'Kannada', nativeName: 'ಕನ್ನಡ ಲಿಪಿ', direction: 'ltr' },
    { code: 'Mlym', name: 'Malayalam', nativeName: 'മലയാളം ലിപി', direction: 'ltr' }
  ];

  const scriptMap = new Map<string, string>();
  for (const s of scriptsData) {
    const rec = await prisma.script.upsert({
      where: { code: s.code },
      update: { name: s.name, nativeName: s.nativeName, direction: s.direction },
      create: s
    });
    scriptMap.set(s.code, rec.id);
  }

  // 3. Upsert Categories
  const categoriesData = [
    { name: 'Annual Festival', slug: 'annual-festival', description: 'Major pan-Indian Hindu festivals' },
    { name: 'Institutional Event', slug: 'institutional-event', description: 'Amrita institutional devotional occasions' },
    { name: 'Vratam', slug: 'vratam', description: 'Sacred Hindu fasting observances' },
    { name: 'Dhyana Sloka', slug: 'dhyana-sloka', description: 'Meditative contemplation verses' },
    { name: 'Stotram', slug: 'stotram', description: 'Hymns of praise and devotion' },
    { name: 'Pancharatnam', slug: 'pancharatnam', description: 'Five-jeweled devotional hymns' },
    { name: 'Ashtakam', slug: 'ashtakam', description: 'Eight-stanza hymns' },
    { name: 'Sahasranamam', slug: 'sahasranamam', description: 'Thousand sacred names' },
    { name: 'Shanti Patha', slug: 'shanti-patha', description: 'Vedic universal peace invocations' }
  ];

  const catMap = new Map<string, string>();
  for (const c of categoriesData) {
    const rec = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description },
      create: c
    });
    catMap.set(c.name, rec.id);
  }

  // 4. Upsert Deities
  const deitiesData = [
    { name: 'Ganesha', slug: 'ganesha', description: 'Lord of beginnings and remover of obstacles' },
    { name: 'Shiva', slug: 'shiva', description: 'The auspicious and transcendent transformer' },
    { name: 'Vishnu', slug: 'vishnu', description: 'The preserver and cosmic sustainer' },
    { name: 'Lakshmi', slug: 'lakshmi', description: 'Goddess of auspicious fortune and spiritual wealth' },
    { name: 'Saraswati', slug: 'saraswati', description: 'Goddess of learning, music, and wisdom' },
    { name: 'Hanuman', slug: 'hanuman', description: 'The embodiment of strength, devotion, and courage' },
    { name: 'Surya', slug: 'surya', description: 'The cosmic solar deity and giver of life' },
    { name: 'Guru', slug: 'guru', description: 'The spiritual master and preceptor lineage' },
    { name: 'Universal', slug: 'universal', description: 'All-pervading divine truth' }
  ];

  const deityMap = new Map<string, string>();
  for (const d of deitiesData) {
    const rec = await prisma.deity.upsert({
      where: { slug: d.slug },
      update: { name: d.name, description: d.description },
      create: d
    });
    deityMap.set(d.name, rec.id);
  }

  // 5. Institutions
  const institution = await prisma.institution.findFirst({ where: { code: 'ASE-CHN' } });
  const instId = institution?.id;

  // 6. Source Document
  const source = await prisma.source.findFirst({ where: { fileName: 'ENGLISH.pdf' } });
  const sourceId = source?.id;

  // 7. Upsert Slokas & Multilingual Versions
  console.log(`Upserting ${data.slokas.length} canonical slokas...`);
  const slokaMap = new Map<string, string>();

  for (const s of data.slokas) {
    const categoryId = catMap.get(s.category) || catMap.get('Stotram')!;
    const deityId = deityMap.get(s.primaryDeity) || deityMap.get('Universal')!;

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
        verificationStatus: VerificationStatus.VERIFIED,
        primarySourceId: sourceId
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
        isPublished: true,
        verificationStatus: VerificationStatus.VERIFIED,
        primarySourceId: sourceId
      }
    });
    slokaMap.set(s.slug, sloka.id);
  }

  // 8. Upsert Multilingual Versions
  console.log(`Upserting ${data.versions.length} multilingual script versions...`);
  for (const v of data.versions) {
    const slokaId = slokaMap.get(v.slokaSlug);
    const languageId = langMap.get(v.languageCode);
    const scriptId = scriptMap.get(v.scriptCode);

    if (!slokaId || !languageId || !scriptId) continue;

    // Check if version exists for this sloka, language, and script
    const existing = await prisma.slokaVersion.findFirst({
      where: {
        slokaId,
        languageId,
        scriptId,
        versionType: v.versionType as VersionType
      }
    });

    if (existing) {
      await prisma.slokaVersion.update({
        where: { id: existing.id },
        data: {
          textContent: v.textContent,
          verseData: v.verseData,
          confidenceScore: 1.0,
          verificationStatus: VerificationStatus.VERIFIED,
          isPublished: true
        }
      });
    } else {
      await prisma.slokaVersion.create({
        data: {
          slokaId,
          languageId,
          scriptId,
          versionType: v.versionType as VersionType,
          textContent: v.textContent,
          verseData: v.verseData,
          confidenceScore: 1.0,
          verificationStatus: VerificationStatus.VERIFIED,
          isPublished: true,
          sourceId
        }
      });
    }
  }

  // 9. Upsert Occasions & Dates & Linkages
  console.log(`Upserting ${data.occasions.length} festival occasions & dates...`);
  for (const o of data.occasions) {
    const categoryId = catMap.get(o.category) || catMap.get('Annual Festival')!;
    const deityId = deityMap.get(o.primaryDeity) || null;
    const institutionId = o.institutionCode === 'ASE-CHN' ? instId : null;

    const occasion = await prisma.occasion.upsert({
      where: { slug: o.slug },
      update: {
        name: o.name,
        categoryId,
        deityId,
        institutionId,
        description: o.description,
        significance: o.significance,
        whatHappensToday: o.whatHappensToday,
        preparationGuide: o.preparationGuide,
        isActive: true
      },
      create: {
        slug: o.slug,
        name: o.name,
        categoryId,
        deityId,
        institutionId,
        description: o.description,
        significance: o.significance,
        whatHappensToday: o.whatHappensToday,
        preparationGuide: o.preparationGuide,
        isActive: true
      }
    });

    // Refresh Dates
    await prisma.occasionDate.deleteMany({ where: { occasionId: occasion.id } });
    for (const d of o.dates) {
      await prisma.occasionDate.create({
        data: {
          occasionId: occasion.id,
          gregorianDate: new Date(d.gregorianDate),
          year: d.year,
          region: d.region,
          calendarConvention: d.tithi || 'Drik Ganita',
          verificationStatus: VerificationStatus.VERIFIED
        }
      });
    }

    // Link slokas
    for (let i = 0; i < o.slokas.length; i++) {
      const link = o.slokas[i];
      const slokaId = slokaMap.get(link.slug);
      if (!slokaId) continue;

      await prisma.occasionSloka.upsert({
        where: {
          occasionId_slokaId: {
            occasionId: occasion.id,
            slokaId
          }
        },
        update: {
          displayOrder: i + 1,
          relationshipType: link.rel as RelationshipType,
          isVerified: true
        },
        create: {
          occasionId: occasion.id,
          slokaId,
          displayOrder: i + 1,
          relationshipType: link.rel as RelationshipType,
          isVerified: true
        }
      });
    }
  }

  console.log('Comprehensive multilingual slokas and calendar seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

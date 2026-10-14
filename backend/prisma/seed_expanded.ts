import { PrismaClient, RelationshipType, VerificationStatus } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function seedExpanded() {
  console.log('Seeding expanded Hindu & Amrita festival roster...');

  const dataPath = path.resolve(__dirname, '../../data/intermediate/expanded_occasions_catalog.json');
  const festivals = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // Get mappings
  const categories = await prisma.category.findMany();
  const deities = await prisma.deity.findMany();
  const institutions = await prisma.institution.findMany();
  const slokas = await prisma.sloka.findMany();
  const sources = await prisma.source.findMany();

  const catMap = new Map(categories.map(c => [c.name, c.id]));
  const deityMap = new Map(deities.map(d => [d.name, d.id]));
  const instMap = new Map(institutions.map(i => [i.code, i.id]));
  const slokaMap = new Map(slokas.map(s => [s.slug, s.id]));
  const sourceMap = new Map(sources.map(s => [s.fileName, s.id]));

  for (const f of festivals) {
    const categoryId = catMap.get(f.category) || categories[0].id;
    const institutionId = f.institutionCode ? instMap.get(f.institutionCode) || null : null;
    const deityId = f.primaryDeity ? deityMap.get(f.primaryDeity) || null : null;
    const sourceId = f.sourceFile ? sourceMap.get(f.sourceFile) || null : null;

    const occasion = await prisma.occasion.upsert({
      where: { slug: f.slug },
      update: {
        name: f.name,
        categoryId,
        institutionId,
        deityId,
        description: f.description,
        significance: f.significance,
        whatHappensToday: f.whatHappensToday,
        preparationGuide: f.preparationGuide,
        primarySourceId: sourceId,
        isActive: true
      },
      create: {
        slug: f.slug,
        name: f.name,
        categoryId,
        institutionId,
        deityId,
        description: f.description,
        significance: f.significance,
        whatHappensToday: f.whatHappensToday,
        preparationGuide: f.preparationGuide,
        primarySourceId: sourceId,
        isActive: true
      }
    });

    // Remove existing dates and re-create all verified dates
    await prisma.occasionDate.deleteMany({ where: { occasionId: occasion.id } });
    for (const d of f.dates) {
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

    // Sloka associations
    for (const link of f.slokaSlugs) {
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
  }

  const count = await prisma.occasion.count();
  const datesCount = await prisma.occasionDate.count();
  console.log(`Successfully seeded ${count} occasions and ${datesCount} observance dates!`);
}

seedExpanded()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

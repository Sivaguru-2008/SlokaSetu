export interface Language {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  isClassical: boolean;
}

export interface Script {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  direction: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: 'OCCASION' | 'SLOKA' | 'BOTH';
}

export interface Deity {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconName?: string;
}

export interface Institution {
  id: string;
  name: string;
  code: string;
  campus: string;
  department: string;
  city: string;
  state: string;
  country: string;
}

export interface VerseItem {
  verseNumber: number;
  text: string;
  transliteration?: string;
  meaning?: string;
}

export interface SlokaVersion {
  id: string;
  slokaId: string;
  languageId: string;
  language: Language;
  scriptId: string;
  script: Script;
  versionType: 'ORIGINAL_TEXT' | 'TRANSLITERATION' | 'TRANSLATION' | 'COMMENTARY';
  textContent: string;
  verseData?: VerseItem[];
  source?: { id: string; title: string; fileName: string; };
  pageStart?: number;
  pageEnd?: number;
  verificationStatus: 'DRAFT' | 'UNDER_REVIEW' | 'VERIFIED' | 'PUBLISHED';
  confidenceScore: number;
  isPublished: boolean;
}

export interface PdfResource {
  id: string;
  title: string;
  slokaId?: string;
  slokaVersionId?: string;
  occasionId?: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  pageReference?: string;
  licenseType: string;
  verificationStatus: string;
  isPublic: boolean;
  downloadCount: number;
  createdAt: string;
}

export interface SlokaAlias {
  id: string;
  aliasTitle: string;
  aliasType: string;
}

export interface Sloka {
  id: string;
  slug: string;
  canonicalTitle: string;
  categoryId: string;
  category: Category;
  deityId?: string;
  deity?: Deity;
  primarySource?: { id: string; title: string; fileName: string; };
  backgroundContext?: string;
  historicalNotes?: string;
  traditionalNotes?: string;
  significanceNotes?: string;
  isPublished: boolean;
  verificationStatus: string;
  aliases?: SlokaAlias[];
  versions?: SlokaVersion[];
  pdfResources?: PdfResource[];
  occasionSlokas?: Array<{
    relationshipType: string;
    notes?: string;
    occasion: Occasion;
  }>;
}

export interface OccasionDate {
  id: string;
  occasionId: string;
  gregorianDate: string;
  year: number;
  region?: string;
  calendarConvention: string;
  verificationStatus: string;
  sourceReference?: string;
}

export interface OccasionSloka {
  id: string;
  occasionId: string;
  slokaId: string;
  sloka: Sloka;
  relationshipType: 'OFFICIAL_PROGRAMME' | 'TRADITIONAL' | 'CURATED_RECOMMENDATION' | 'RITUAL_REQUIRED';
  displayOrder: number;
  notes?: string;
  isVerified: boolean;
}

export interface Occasion {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  category: Category;
  institutionId?: string;
  institution?: Institution;
  deityId?: string;
  deity?: Deity;
  primarySource?: { id: string; title: string; fileName: string; };
  description: string;
  significance?: string;
  whatHappensToday?: string;
  preparationGuide?: string;
  isActive: boolean;
  dates: OccasionDate[];
  occasionSlokas?: OccasionSloka[];
  pdfResources?: PdfResource[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'REVIEWER' | 'VIEWER';
}

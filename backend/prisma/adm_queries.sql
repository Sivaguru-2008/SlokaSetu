-- ===================================================================
-- SLOKASETU: ADVANCED DATABASE MANAGEMENT SYSTEMS (ADM) DEMONSTRATION
-- ===================================================================
-- Schema: slokasetu
-- Database: PostgreSQL 18

SET search_path TO slokasetu;

-- -------------------------------------------------------------------
-- QUERY 1: Finding slokas associated with a specific occasion (JOIN + ORDER BY)
-- Scenario: Retrieve all Parayanam texts for "Sri Mahaganapathi Homam – Chennai Campus"
-- -------------------------------------------------------------------
SELECT 
    o.name AS occasion_name,
    os."displayOrder",
    os."relationshipType",
    s."canonicalTitle" AS sloka_title,
    c.name AS sloka_category,
    d.name AS deity_name,
    os.notes AS liturgical_notes
FROM occasions o
JOIN occasion_slokas os ON o.id = os."occasionId"
JOIN slokas s ON os."slokaId" = s.id
JOIN categories c ON s."categoryId" = c.id
LEFT JOIN deities d ON s."deityId" = d.id
WHERE o.slug = 'amrita-sri-mahaganapathi-homam-2026'
ORDER BY os."displayOrder" ASC;

-- -------------------------------------------------------------------
-- QUERY 2: Finding available versions for a sloka (MULTI-TABLE JOIN)
-- Scenario: Find all language and script editions for "Sri Ganesha Pancharatnam"
-- -------------------------------------------------------------------
SELECT 
    s."canonicalTitle",
    l.name AS language,
    sc.name AS script,
    v."versionType",
    v."pageStart",
    v."pageEnd",
    v."confidenceScore",
    v."verificationStatus"
FROM slokas s
JOIN sloka_versions v ON s.id = v."slokaId"
JOIN languages l ON v."languageId" = l.id
JOIN scripts sc ON v."scriptId" = sc.id
WHERE s.slug = 'maha-ganesha-pancharatnam'
ORDER BY l.name ASC, sc.name ASC;

-- -------------------------------------------------------------------
-- QUERY 3: Finding slokas available in Tamil script (FILTERED JOIN)
-- Scenario: Identify all devotional texts with verified Tamil script renderings
-- -------------------------------------------------------------------
SELECT 
    s."canonicalTitle",
    s.slug,
    c.name AS category,
    v."versionType",
    v."pageStart",
    v."pageEnd",
    src."fileName" AS source_document
FROM slokas s
JOIN sloka_versions v ON s.id = v."slokaId"
JOIN scripts sc ON v."scriptId" = sc.id
JOIN categories c ON s."categoryId" = c.id
LEFT JOIN sources src ON v."sourceId" = src.id
WHERE sc.code = 'Taml' AND v."isPublished" = true
ORDER BY s."canonicalTitle" ASC;

-- -------------------------------------------------------------------
-- QUERY 4: Finding occasions within a selected date range (DATE ARITHMETIC)
-- Scenario: Retrieve all observances occurring between July 1, 2026 and October 31, 2026
-- -------------------------------------------------------------------
SELECT 
    o.name AS occasion_name,
    c.name AS category,
    od."gregorianDate",
    od.year,
    od.region,
    od."calendarConvention"
FROM occasions o
JOIN categories c ON o."categoryId" = c.id
JOIN occasion_dates od ON o.id = od."occasionId"
WHERE od."gregorianDate" >= '2026-07-01' 
  AND od."gregorianDate" <= '2026-10-31'
ORDER BY od."gregorianDate" ASC;

-- -------------------------------------------------------------------
-- QUERY 5: Counting slokas by category (AGGREGATION + GROUP BY)
-- Scenario: Statistical breakdown of canonical slokas across literary genres
-- -------------------------------------------------------------------
SELECT 
    c.name AS category_name,
    COUNT(s.id) AS total_slokas,
    ROUND(COUNT(s.id) * 100.0 / (SELECT COUNT(*) FROM slokas), 2) AS percentage_of_total
FROM categories c
LEFT JOIN slokas s ON c.id = s."categoryId"
WHERE c.type IN ('SLOKA', 'BOTH')
GROUP BY c.name
ORDER BY total_slokas DESC;

-- -------------------------------------------------------------------
-- QUERY 6: Counting versions by language & script (CROSS-DIMENSIONAL AGGREGATION)
-- Scenario: Distribution of textual versions across supported scripts
-- -------------------------------------------------------------------
SELECT 
    l.name AS language_name,
    sc.name AS script_name,
    sc.direction,
    COUNT(v.id) AS published_versions_count
FROM sloka_versions v
JOIN languages l ON v."languageId" = l.id
JOIN scripts sc ON v."scriptId" = sc.id
WHERE v."isPublished" = true
GROUP BY l.name, sc.name, sc.direction
ORDER BY published_versions_count DESC;

-- -------------------------------------------------------------------
-- QUERY 7: Finding slokas without downloadable resources (LEFT EXCLUSION JOIN)
-- Scenario: Quality assurance query to identify slokas requiring PDF creation
-- -------------------------------------------------------------------
SELECT 
    s.id,
    s.slug,
    s."canonicalTitle",
    c.name AS category
FROM slokas s
JOIN categories c ON s."categoryId" = c.id
LEFT JOIN pdf_resources p ON s.id = p."slokaId" AND p."isPublic" = true
WHERE p.id IS NULL;

-- -------------------------------------------------------------------
-- QUERY 8: Finding occasions without associated slokas (LEFT EXCLUSION JOIN)
-- Scenario: Audit query detecting orphaned occasions with no parayanam links
-- -------------------------------------------------------------------
SELECT 
    o.id,
    o.slug,
    o.name AS occasion_name,
    c.name AS category
FROM occasions o
JOIN categories c ON o."categoryId" = c.id
LEFT JOIN occasion_slokas os ON o.id = os."occasionId"
WHERE os.id IS NULL;

-- -------------------------------------------------------------------
-- QUERY 9: Finding slokas associated with multiple occasions (HAVING + AGGREGATION)
-- Scenario: Identify core liturgical texts shared across different festivals
-- -------------------------------------------------------------------
SELECT 
    s."canonicalTitle",
    COUNT(os."occasionId") AS occasion_associations_count,
    STRING_AGG(o.name, ' | ' ORDER BY o.name) AS associated_occasions
FROM slokas s
JOIN occasion_slokas os ON s.id = os."slokaId"
JOIN occasions o ON os."occasionId" = o.id
GROUP BY s.id, s."canonicalTitle"
HAVING COUNT(os."occasionId") > 1
ORDER BY occasion_associations_count DESC;

-- -------------------------------------------------------------------
-- QUERY 10: Retrieving all resources for a selected occasion (TRANSITIVE JUNCTION)
-- Scenario: Find all PDF resources directly or transitively linked to Chennai Homam
-- -------------------------------------------------------------------
SELECT DISTINCT
    o.name AS occasion_name,
    p."fileName",
    p.title AS resource_title,
    p."fileSize",
    p."pageReference",
    p."licenseType"
FROM occasions o
JOIN occasion_slokas os ON o.id = os."occasionId"
JOIN pdf_resources p ON (p."occasionId" = o.id OR p."slokaId" = os."slokaId")
WHERE o.slug = 'amrita-sri-mahaganapathi-homam-2026'
ORDER BY p.title ASC;

-- -------------------------------------------------------------------
-- QUERY 11: Listing records awaiting content review (GOVERNANCE WORKFLOW)
-- Scenario: Content moderation queue for pending drafts or reviews
-- -------------------------------------------------------------------
SELECT 
    cr.id AS review_id,
    cr."entityType",
    cr."entityId",
    cr."reviewStatus",
    cr."reviewerName",
    cr."reviewNotes",
    cr."reviewedAt"
FROM content_reviews cr
WHERE cr."reviewStatus" IN ('DRAFT', 'UNDER_REVIEW')
ORDER BY cr."reviewedAt" DESC;

-- -------------------------------------------------------------------
-- QUERY 12: Finding duplicate candidate titles (SELF JOIN / STRING SIMILARITY)
-- Scenario: Integrity check detecting potential duplicate aliases or sloka titles
-- -------------------------------------------------------------------
SELECT 
    a1.id AS alias_id_1,
    a1."aliasTitle" AS title_1,
    s1."canonicalTitle" AS canonical_sloka_1,
    a2.id AS alias_id_2,
    a2."aliasTitle" AS title_2,
    s2."canonicalTitle" AS canonical_sloka_2
FROM sloka_aliases a1
JOIN slokas s1 ON a1."slokaId" = s1.id
JOIN sloka_aliases a2 ON LOWER(a1."aliasTitle") = LOWER(a2."aliasTitle") AND a1.id < a2.id
JOIN slokas s2 ON a2."slokaId" = s2.id;

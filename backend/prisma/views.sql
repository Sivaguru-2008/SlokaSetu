-- SlokaSetu ADM Views and Advanced Indexes

SET search_path TO slokasetu;

-- 1. Integrated Occasion Parayanam View
CREATE OR REPLACE VIEW v_occasion_parayanam_overview AS
SELECT 
    o.id AS occasion_id,
    o.slug AS occasion_slug,
    o.name AS occasion_name,
    c.name AS category_name,
    i.name AS institution_name,
    i.campus AS institution_campus,
    od."gregorianDate",
    od.year AS observance_year,
    od.region,
    s.id AS sloka_id,
    s.slug AS sloka_slug,
    s."canonicalTitle" AS sloka_title,
    os."relationshipType",
    os."displayOrder",
    os.notes AS relationship_notes
FROM occasions o
JOIN categories c ON o."categoryId" = c.id
LEFT JOIN institutions i ON o."institutionId" = i.id
LEFT JOIN occasion_dates od ON o.id = od."occasionId"
LEFT JOIN occasion_slokas os ON o.id = os."occasionId"
LEFT JOIN slokas s ON os."slokaId" = s.id
ORDER BY od."gregorianDate" ASC, os."displayOrder" ASC;

-- 2. Multilingual Availability View
CREATE OR REPLACE VIEW v_sloka_multilingual_availability AS
SELECT 
    s.id AS sloka_id,
    s."canonicalTitle",
    s.slug,
    c.name AS category,
    d.name AS primary_deity,
    COUNT(DISTINCT v.id) AS total_versions,
    COUNT(DISTINCT v."languageId") AS total_languages,
    COUNT(DISTINCT p.id) AS total_pdf_resources,
    BOOL_OR(l.code = 'sa') AS has_sanskrit,
    BOOL_OR(l.code = 'en') AS has_english,
    BOOL_OR(l.code = 'te') AS has_telugu,
    BOOL_OR(l.code = 'ta') AS has_tamil
FROM slokas s
JOIN categories c ON s."categoryId" = c.id
LEFT JOIN deities d ON s."deityId" = d.id
LEFT JOIN sloka_versions v ON s.id = v."slokaId" AND v."isPublished" = true
LEFT JOIN languages l ON v."languageId" = l.id
LEFT JOIN pdf_resources p ON s.id = p."slokaId" AND p."isPublic" = true
GROUP BY s.id, s."canonicalTitle", s.slug, c.name, d.name;

-- 3. Pending Content Reviews View
CREATE OR REPLACE VIEW v_pending_content_reviews AS
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

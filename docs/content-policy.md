# SlokaSetu: Devotional Content Governance Policy

## 1. Principles of Scriptural Integrity

1. **Preservation of Authentic Source Documents:** Original archival PDF documents (`ENGLISH.pdf`, `TELUGU.pdf`, `TAMIL.pdf`, `SRI MAHAGANAPATHI HOMAM JULY.pdf`) are maintained intact as physical source archives in `backend/storage/pdfs/`.
2. **Distinct Separation of Language from Script:**
   - A Sanskrit stotra transcribed in Telugu script is classified with `language = 'sa'` (Sanskrit) and `script = 'Telu'` (Telugu script).
   - A Sanskrit stotra transcribed in Tamil script is classified with `language = 'sa'` (Sanskrit) and `script = 'Taml'` (Tamil script).
   - This prevents misclassification of language vs writing system.
3. **Historical Evidence vs Traditional Devotional Accounts:**
   - Historical information (e.g., authorship by Adi Shankaracharya in 8th century CE, Sureshvaracharya's Manasollasa commentary) is explicitly recorded in `historicalNotes`.
   - Traditional accounts and spiritual lore are recorded in `traditionalNotes` and `significanceNotes`.
4. **Prohibition of Pseudo-Scientific Claims:**
   - Explanatory notes focus on spiritual, moral, literary, and devotional themes. Supernatural claims or medicinal healing cures are never presented as scientific facts.
5. **No Automated or Hallucinated Translations:**
   - Text editions are derived strictly from programmatic extraction of verified source material. Automated machine translations are never substituted for authentic liturgical commentary.
6. **Publication Governance & Verification Lifecycle:**
   - Entities progress through explicit review states: `DRAFT` → `UNDER_REVIEW` → `VERIFIED` → `PUBLISHED`.
   - Only `PUBLISHED` records are exposed to public search and reading interfaces.

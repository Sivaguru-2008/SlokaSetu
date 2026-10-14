import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('data/extracted/raw_catalog.json', 'r', encoding='utf-8') as f:
    catalog = json.load(f)

print("=== IDENTIFYING SLOKAS IN ENGLISH.PDF ===")
eng = catalog['ENGLISH.pdf']
eng_titles = []
for p in eng['pages']:
    p_num = p['page_number']
    for line in p['lines']:
        # Match common title patterns: ALL CAPS headings or known stotram/dhyanam keywords
        if re.match(r'^(SRI|SREE|SHREE|OM)\s+[A-Z\s\(\)\-]+$', line) and len(line) > 5:
            eng_titles.append((p_num, line))
        elif any(k in line.upper() for k in ['STOTRAM', 'DHYANAM', 'SUKTHAM', 'SUKTAM', 'ASHTAKAM', 'NAMAVALI', 'PANCHARATNAM', 'GURVASHTAKAM', 'PADUKA', 'DAKSHINAMURTHY', 'LINGASHTAKAM']):
            if len(line) < 60 and not line.endswith('॥') and not re.search(r'\d', line):
                eng_titles.append((p_num, line))

# De-duplicate adjacent/identical
unique_eng = []
for p, t in eng_titles:
    cleaned = re.sub(r'\s+', ' ', t).strip()
    if not unique_eng or unique_eng[-1][1] != cleaned:
        unique_eng.append((p, cleaned))

for p, t in unique_eng:
    print(f"Page {p:2d}: {t}")

print("\n=== IDENTIFYING SLOKAS IN TELUGU.PDF ===")
tel = catalog['TELUGU.pdf']
tel_headings = []
for p in tel['pages']:
    p_num = p['page_number']
    for line in p['lines']:
        if any(k in line for k in ['ధ్యాన', 'స్తోత్ర', 'సూక్త', 'అష్టక', 'నామావళి', 'పంచరత్న', 'శ్లోక']):
            if len(line) < 60:
                tel_headings.append((p_num, line.strip()))

for p, t in tel_headings[:30]:
    print(f"Page {p:2d}: {t}")

print("\n=== IDENTIFYING SLOKAS IN TAMIL.PDF ===")
tam = catalog['TAMIL.pdf']
tam_headings = []
for p in tam['pages']:
    p_num = p['page_number']
    for line in p['lines']:
        if any(k in line for k in ['த்ைான', 'ஸ்தோத்ர', 'ஸூக்த', 'அஷ்டக', 'நாமாவளி', 'பஞ்சரத்ன', 'ஸ்த ாக', 'த்யான']):
            if len(line) < 60:
                tam_headings.append((p_num, line.strip()))

for p, t in tam_headings[:30]:
    print(f"Page {p:2d}: {t}")

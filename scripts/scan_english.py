import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('data/extracted/raw_catalog.json', 'r', encoding='utf-8') as f:
    catalog = json.load(f)

eng = catalog['ENGLISH.pdf']
print(f"Total pages: {len(eng['pages'])}")

for page in eng['pages']:
    p_num = page['page_number']
    lines = page['lines']
    # Check first 5 lines for titles
    header_candidates = []
    for l in lines[:5]:
        if l.isupper() and len(l) > 4 and not l.startswith('PAGE'):
            header_candidates.append(l)
        elif any(k in l.upper() for k in ['STOTRAM', 'DHYANAM', 'SUKTHAM', 'ASHTAKAM', 'NAMAVALI', 'PANCHARATNAM']):
            header_candidates.append(l)
    if header_candidates:
        print(f"Page {p_num:2d}: {', '.join(header_candidates)}")

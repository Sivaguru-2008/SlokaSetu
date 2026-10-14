import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('data/extracted/raw_catalog.json', 'r', encoding='utf-8') as f:
    catalog = json.load(f)

tel = catalog['TELUGU.pdf']
tam = catalog['TAMIL.pdf']

print("=== TELUGU PAGES ===")
for p in tel['pages']:
    p_num = p['page_number']
    lines = [l for l in p['lines'] if len(l) > 2]
    # Check if first 3 lines contain title markers
    top = ' | '.join(lines[:2])
    print(f"Tel P.{p_num:2d}: {top[:80]}")

print("\n=== TAMIL PAGES ===")
for p in tam['pages']:
    p_num = p['page_number']
    lines = [l for l in p['lines'] if len(l) > 2]
    top = ' | '.join(lines[:2])
    print(f"Tam P.{p_num:2d}: {top[:80]}")

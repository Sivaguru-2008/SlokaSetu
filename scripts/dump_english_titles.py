import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('data/extracted/raw_catalog.json', 'r', encoding='utf-8') as f:
    catalog = json.load(f)

eng = catalog['ENGLISH.pdf']
for p in eng['pages']:
    p_num = p['page_number']
    print(f"=== PAGE {p_num} ===")
    for l in p['lines']:
        # If line has no lower case or contains STOTRA/DHYANA/ASHTAKA/NAMAVALI
        up = l.upper()
        if any(w in up for w in ['STOTRA', 'DHYANA', 'ASHTAKA', 'SUKTHA', 'SUKTA', 'NAMAVALI', 'PANCHARATNA', 'GURU', 'GANAPATHI', 'VISHNU', 'LALITA', 'SHIVA', 'MAHALAKSHMI', 'BHAIRAVA', 'CHANDRASEKHARA', 'VAIDYANATHA', 'BILVA', 'VENKATESWARA', 'SUDARSHANA']):
            print(f"  [TITLE/KW]: {l}")

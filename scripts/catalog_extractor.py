import sys
import json
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

def extract_doc_structure(pdf_path, doc_name):
    doc = pymupdf.open(pdf_path)
    pages_data = []
    for page_idx, page in enumerate(doc):
        text = page.get_text()
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        pages_data.append({
            "page_number": page_idx + 1,
            "line_count": len(lines),
            "lines": lines,
            "raw_text": text
        })
    return {
        "document_name": doc_name,
        "total_pages": len(doc),
        "pages": pages_data
    }

docs = [
    ('data/source_documents/SRI MAHAGANAPATHI HOMAM JULY.pdf', 'SRI MAHAGANAPATHI HOMAM JULY.pdf'),
    ('data/source_documents/ENGLISH.pdf', 'ENGLISH.pdf'),
    ('data/source_documents/TELUGU.pdf', 'TELUGU.pdf'),
    ('data/source_documents/TAMIL.pdf', 'TAMIL.pdf')
]

catalog = {}
for path, name in docs:
    print(f"Extracting {name}...")
    catalog[name] = extract_doc_structure(path, name)

with open('data/extracted/raw_catalog.json', 'w', encoding='utf-8') as f:
    json.dump(catalog, f, ensure_ascii=False, indent=2)

print("Saved raw extraction to data/extracted/raw_catalog.json")

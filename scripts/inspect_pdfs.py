import sys
import io
import pymupdf

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

docs = [
    'SRI MAHAGANAPATHI HOMAM JULY.pdf',
    'ENGLISH.pdf',
    'TELUGU.pdf',
    'TAMIL.pdf'
]

for doc_name in docs:
    path = f'data/source_documents/{doc_name}'
    doc = pymupdf.open(path)
    print(f'=== {doc_name} === (Total Pages: {len(doc)})')
    for i in range(len(doc)):
        text = doc[i].get_text()
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        first_lines = '\n'.join(lines[:10])
        print(f'-- Page {i+1} (Lines: {len(lines)}) --\n{first_lines}\n')

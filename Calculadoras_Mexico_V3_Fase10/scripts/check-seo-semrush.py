"""Independent arithmetic, preservation and data-quality checks for the expansion."""
import csv
import hashlib
import json
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path
from lxml import html

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs/seo-semrush-2026-11-10'
read = lambda name: (ROOT / name).read_text()
report = {'status': 'RUNNING', 'conditions': 'Static checks; no production, browser or Google indexing measurement.'}
try:
    preserved = json.loads((OUT / 'preservacion-etapa-anterior.json').read_text())
    for name, expected in preserved.items():
        assert hashlib.sha256((ROOT / name).read_bytes()).hexdigest() == expected, name
    report['preserved_files'] = len(preserved)

    # Independent expected values and Decimal rounding; inspect the published table.
    expected = [
        ['315.04', '440.87'], ['2205.28', '3086.09'], ['4725.60', '6613.05'],
        ['9451.20', '13226.10'], ['9582.47', '13409.80']
    ]
    tree = html.fromstring(read('site-public/articulos/salario-minimo-diario-mensual-2026.html'))
    table = tree.xpath('//table')[0]
    actual = [[t.text_content().replace('$', '').replace(',', '').strip() for t in row.xpath('./td')] for row in table.xpath('.//tbody/tr')]
    assert actual == expected, actual
    for row, (n, d) in zip(expected, [(1, 1), (7, 1), (15, 1), (30, 1), (365, 12)]):
        for value, daily in zip(row, ['315.04', '440.87']):
            assert Decimal(value) == (Decimal(daily) * n / d).quantize(Decimal('.01'), rounding=ROUND_HALF_UP)
    report['minimum_wage_table_cells'] = 10

    # Every schema FAQ answer must be visible on the substantively changed pages.
    changes = json.loads((OUT / 'cambios-implementados.json').read_text())
    checked = 0
    def nodes(obj):
        if isinstance(obj, dict):
            yield obj
            for value in obj.values(): yield from nodes(value)
        elif isinstance(obj, list):
            for value in obj: yield from nodes(value)
    for row in changes['files']:
        page = html.fromstring(read('site-public/' + row['file']))
        body = ' '.join(page.xpath('//body')[0].text_content().split())
        for script in page.xpath('//script[@type="application/ld+json"]'):
            for obj in nodes(json.loads(script.text)):
                if obj.get('@type') == 'FAQPage':
                    for question in obj['mainEntity']:
                        assert ' '.join(question['name'].split()) in body, row['file']
                        assert ' '.join(question['acceptedAnswer']['text'].split()) in body, row['file']
                        checked += 1
    report['visible_faq_answers'] = checked

    analysis = json.loads((OUT / 'verificacion-paquete.json').read_text())
    assert analysis['rows'] == 1272 and analysis['keywords'] == 1023
    assert analysis['first_12_pages_exact_rows'] == 1200
    assert analysis['last_page_missing_url_rows'] == 7
    with (OUT / 'semrush-1272-verificada.csv').open(encoding='utf-8-sig') as stream:
        rows = list(csv.DictReader(stream))
    assert len(rows) == 1272
    missing = [r for r in rows if not r['URL_confirmada_en_origen']]
    assert len(missing) == 7
    report['unknown_source_urls_excluded'] = 7
    audit = json.loads((OUT / 'auditoria-despues.json').read_text())
    assert not audit['issues'], audit['issues']
    assert audit['summary']['indexable_routes'] == 379
    report['indexable_routes_checked'] = 379
    report['status'] = 'PASS'
except Exception as error:
    report['status'] = 'FAIL'
    report['error'] = repr(error)
    raise
finally:
    (OUT / 'validation-preservation-data.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(report, ensure_ascii=False, indent=2))

"""Release assertions for the GSC URL changes, against generated public HTML."""
from pathlib import Path
from collections import Counter
from decimal import Decimal
import csv, hashlib, json
from lxml import html
from seo_preservation import assert_preserved

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs/seo-gsc-2026-11-10'
report={'status':'RUNNING','conditions':'Generated HTML and local assets; not browser, network advertising, Google indexing or CWV.'}
def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def nodes(obj):
    if isinstance(obj,dict):
        yield obj
        for v in obj.values():yield from nodes(v)
    elif isinstance(obj,list):
        for v in obj:yield from nodes(v)
try:
    preserved=json.loads((OUT/'preservacion-base.json').read_text())
    for name,expected in preserved.items():assert_preserved(ROOT,name,expected)
    report['configuration_exception']='Only the reviewed missing-route redirect; all other configuration unchanged.'
    report['preserved_files']=len(preserved)
    css=json.loads((OUT/'preservacion-css.json').read_text())
    for name,expected in css.items():assert digest(ROOT/name)==expected,name
    report['unchanged_css_files']=len(css)
    audit=json.loads((OUT/'auditoria-despues.json').read_text())
    assert not audit['issues'],audit['issues']
    assert audit['summary']['indexable_routes']==379
    assert audit['summary']['sitemap_routes']==379
    report['global_audit']=audit['summary']
    changes=json.loads((OUT/'cambios-implementados.json').read_text())
    assert len(changes['urls'])==8 and len(changes['html_files'])==11
    before={r['url']:r for r in json.loads((OUT/'auditoria-antes.json').read_text())['pages']}
    after={r['url']:r for r in audit['pages']}
    checked=0; titles=0
    for change in changes['html_files']:
        name=change['file'];source=ROOT/name
        assert digest(source)==change['after_sha256'],name
        page=html.fromstring((ROOT/'site-public'/name).read_text())
        if name in ['calculadoras/salario-hora.html','calculadoras/ahorro-mensual.html','calculadoras/margen-ganancia.html']:
            assert not any('/assets/js/calculators.js' in src for src in page.xpath('//script/@src')),name+' unused generic module'
        ids=page.xpath('//*[@id]/@id');assert len(ids)==len(set(ids)),name+' duplicate ID'
        for field in page.xpath('//input[@id and not(@type="hidden")]|//select[@id]'):
            assert page.xpath('//label[@for=$id]',id=field.get('id')) or field.get('aria-label') or field.get('aria-labelledby'),name+' unlabeled '+field.get('id')
        for el in page.xpath('//*[@aria-describedby]'):
            assert all(i in ids for i in el.get('aria-describedby').split()),name+' missing description'
        schemas=[json.loads(s.text) for s in page.xpath('//script[@type="application/ld+json"]')]
        # Exclude scripts: text inside JSON-LD is not a visible FAQ answer.
        for el in page.xpath('//script|//style'):el.getparent().remove(el)
        body=' '.join(page.xpath('//body')[0].text_content().split())
        for obj in schemas:
            for schema in nodes(obj):
                if schema.get('@type')=='FAQPage':
                    for q in schema['mainEntity']:
                        for text in [q['name'],q['acceptedAnswer']['text']]:
                            assert ' '.join(text.split()) in body,(name,text)
                        checked+=1
        route=change['url'].replace('https://calculadora-isr-mexico.vercel.app','') or '/'
        assert before[route]['title']==after[route]['title'],route
        assert before[route]['h1']==after[route]['h1'],route
        assert before[route]['canonical']==after[route]['canonical'],route
        titles+=1
    report['visible_faq_answers']=checked
    report['unchanged_title_h1_canonical_html']=titles
    report['modified_canonical_urls']=8
    # Official UMA reference arithmetic, including validity boundary.
    table=html.fromstring((ROOT/'site-public/articulos/isr-prima-vacacional.html').read_text()).xpath('//table')[0]
    values=[[td.text_content().strip().replace('$','').replace(',','') for td in tr.xpath('./td')] for tr in table.xpath('.//tbody/tr')]
    assert values==[['113.14','1697.10'],['117.31','1759.65']]
    for daily,total in values:assert Decimal(daily)*15==Decimal(total)
    report['uma_reference_cells']=4
    # URL normalization and independent aggregations remain explicit.
    data=json.loads((OUT/'datos-verificados.json').read_text())
    assert data['gsc_urls']==186 and data['semrush_rows']==1272 and data['semrush_unknown_url_rows']==7
    with (OUT/'inventario-union-gsc-semrush.csv').open(encoding='utf-8-sig') as stream:inventory=list(csv.DictReader(stream))
    assert len(inventory)==186 and len({r['URL'] for r in inventory})==186
    report['gsc_urls_checked']=186
    report['status']='PASS'
except Exception as error:
    report['status']='FAIL';report['error']=repr(error);raise
finally:
    (OUT/'validation-preservation-data.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(report,ensure_ascii=False,indent=2))

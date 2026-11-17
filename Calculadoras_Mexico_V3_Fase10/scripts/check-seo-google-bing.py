"""Validate the built SEO release, its sources, preservation and cross-page scenarios."""
from pathlib import Path
from collections import Counter
from urllib.parse import urlsplit,parse_qs
from decimal import Decimal,ROUND_HALF_UP
import csv,hashlib,json
from lxml import html
from seo_preservation import assert_preserved

ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'docs/seo-google-bing-2026-11-11';PUBLIC=ROOT/'site-public'
digest=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def nodes(x):
    if isinstance(x,dict):
        yield x
        for v in x.values():yield from nodes(v)
    elif isinstance(x,list):
        for v in x:yield from nodes(v)
report={'status':'RUNNING','conditions':'Compiled HTML, local configuration, byte preservation and input exports. No browser, real advertising, live indexing or CWV measurement.'}
try:
    before=json.loads((OUT/'preservacion-antes.json').read_text())
    css=[p for p in before if p.endswith('.css') and not p.startswith(('docs/','site-public/'))]
    for p in css:assert digest(ROOT/p)==before[p],p
    report['css_unchanged']=len(css)
    images=[p for p in before if p.startswith('assets/img/')]
    for p in images:assert digest(ROOT/p)==before[p],p
    report['images_unchanged']=len(images)
    old_changes=json.loads((ROOT/'docs/seo-gsc-2026-11-10/cambios-implementados.json').read_text())
    for item in old_changes['html_files']:assert digest(ROOT/item['file'])==item['after_sha256'],item['file']
    preserved=json.loads((ROOT/'docs/seo-gsc-2026-11-10/preservacion-base.json').read_text())
    for p,h in preserved.items():assert_preserved(ROOT,p,h)
    report['previous_gsc_html_unchanged']=len(old_changes['html_files'])
    decisions=json.loads((OUT/'decisiones.json').read_text())
    targets=[p for p,d in decisions.items() if d['prioridad'] in ['Crítica','Alta'] and (ROOT/p.lstrip('/')).exists()]
    config=json.loads((ROOT/'vercel.json').read_text());rewrites={r['source']:r['destination'] for r in config['rewrites']}
    audit=json.loads((OUT/'auditoria-despues.json').read_text());assert not audit['issues'],audit['issues']
    assert audit['summary']['indexable_routes']==379 and audit['summary']['sitemap_routes']==379
    pages={p['url']:p for p in audit['pages']};old_pages={p['url']:p for p in json.loads((OUT/'auditoria-antes.json').read_text())['pages']}
    faq=0;changed=[];links=[];public_files=list(p for p in PUBLIC.rglob('*') if p.is_file())
    assert not any(p.suffix in ['.xlsx','.zip','.py','.md'] or 'fuentes-originales' in str(p) for p in public_files),'Private artifacts leaked into build'
    for route in targets:
        page=pages[route];assert page['indexable'] and page['sitemap'] and page['depth']<=2
        assert page['lastmod']=='2026-11-11',(route,page['lastmod'])
        for k in ['title','h1','canonical']:assert page[k]==old_pages[route][k],(route,k)
        for file in dict.fromkeys([route.lstrip('/'),rewrites.get(route,route).lstrip('/')]):
            t=html.fromstring((PUBLIC/file).read_text());ids=t.xpath('//*[@id]/@id');assert len(ids)==len(set(ids)),file
            for e in t.xpath('//input[@id]|//select[@id]'):
                assert t.xpath('//label[@for=$id]',id=e.get('id')) or e.get('aria-label'),(file,e.get('id'))
            for e in t.xpath('//*[@aria-describedby]'):
                assert all(i in ids for i in e.get('aria-describedby').split()),file
            for e in t.xpath('//div[@role="region" and contains(@class,"table-wrap")]'):
                assert e.get('tabindex')=='0' and e.get('aria-label'),file
            schemas=[json.loads(s.text) for s in t.xpath('//script[@type="application/ld+json"]')]
            for e in t.xpath('//script|//style'):e.drop_tree()
            body=' '.join(t.xpath('//body')[0].text_content().split())
            for s in schemas:
                for n in nodes(s):
                    if n.get('@type')=='FAQPage':
                        for q in n['mainEntity']:
                            assert ' '.join(q['name'].split()) in body,(file,q['name'])
                            assert ' '.join(q['acceptedAnswer']['text'].split()) in body,(file,q['name'])
                            faq+=1
            changed.append({'file':file,'url':route,'before_sha256':before[file],'after_sha256':digest(ROOT/file)})
        if route.startswith('/calculadoras/'):
            t=html.fromstring((ROOT/route.lstrip('/')).read_text());assert not any('/assets/js/calculators.js' in x for x in t.xpath('//script/@src'))
            assert t.xpath('//noscript')
        # Changed contextual links, not auto-generated site-wide graph links.
        new=html.fromstring((ROOT/route.lstrip('/')).read_text())
        oldlinks=Counter(json.loads((OUT/'enlaces-antes.json').read_text())[route]);newlinks=Counter(new.xpath('//main//a/@href'))
        for href,n in (newlinks-oldlinks).items():
            if href.startswith('/'):
                dest=urlsplit(href);assert dest.path in pages,(route,href)
                if dest.fragment:
                    target=html.fromstring((PUBLIC/pages[dest.path]['served_file']).read_text());assert target.xpath('//*[@id=$id]',id=dest.fragment),(route,href)
                links.append({'origen':route,'destino':href,'cantidad':n})
    assert len(targets)==9 and len(changed)==11
    assert sum(len(html.fromstring((ROOT/p).read_text()).xpath('//section[contains(@class,"search-cases")]')) for p in ['calculadoras/iva.html'])==1
    for days,total in [(90,'1479.45'),(180,'2958.90')]:
        assert (Decimal(400)*15*days/365).quantize(Decimal('.01'),rounding=ROUND_HALF_UP)==Decimal(total)
    stats=json.loads((OUT/'datos-verificados.json').read_text())
    for s in stats['fuentes']:assert digest(OUT/'fuentes-originales'/s['archivo'])==s['sha256'],s['archivo']
    matrix=list(csv.DictReader((OUT/'matriz-google-bing-semrush.csv').open(encoding='utf-8-sig')))
    assert len(matrix)==380 and len({r['URL'] for r in matrix})==380
    assert stats['urls_con_impresiones_union']==228 and stats['semrush_registros']==1369
    assert sum(stats['semrush_bandas'].values())==1369 and stats['semrush_asignaciones_provisionales']==5
    assert stats['bing_filas_consultas']==746 and stats['google_pestanas']['Consultas']['registros']==1000
    assert not stats['semrush_resumen_errores']
    report.update(status='PASS',public_files=len(public_files),global_audit=audit['summary'],modified_canonical_destinations=9,modified_html_files=11,
      visible_faq_answers=faq,changed_contextual_link_destinations=len(links),source_exports_verified=len(stats['fuentes']),matrix_rows=len(matrix),queries_processed=1746,
      redirect='One reviewed permanent redirect from absent historical URL to comprehensive finiquito guide; local configuration only.')
    (OUT/'cambios-implementados.json').write_text(json.dumps({'urls':targets,'html_files':changed,'contextual_links':links},ensure_ascii=False,indent=2)+'\n')
except Exception as error:
    report['status']='FAIL';report['error']=repr(error);raise
finally:
    (OUT/'validation-static.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False,indent=2))

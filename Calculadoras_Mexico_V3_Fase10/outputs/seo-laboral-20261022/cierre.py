"""Reconcile changes and build the final evidence; never writes production files."""
from pathlib import Path
import json,re,csv,hashlib,sys,unicodedata
from lxml import html
from patch_html import patch_file
ROOT=Path(__file__).resolve().parents[2]; OUT=Path(__file__).parent
DOMAIN='https://calculadora-isr-mexico.vercel.app'
before=json.loads((OUT/'archivos-antes.json').read_text(encoding='utf-8'))
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
current={str(p.relative_to(ROOT)).replace('\\','/'):digest(p) for p in ROOT.rglob('*') if p.is_file() and not any(x in p.relative_to(ROOT).parts for x in ['outputs','.git','node_modules','.codex','.agents'])}
changed=[p for p in before if p in current and before[p]!=current[p]]
new=[p for p in current if p not in before and (Path(p).suffix in ['.html','.js','.css','.json','.xml','.txt'] or p=='.vercelignore')]
deleted=[p for p in before if p not in current]
def nodes(data):
 if isinstance(data,dict):
  yield data
  for v in data.values():yield from nodes(v)
 elif isinstance(data,list):
  for v in data:yield from nodes(v)
def document(p):return html.fromstring((ROOT/p).read_text(encoding='utf-8'))
def structured(doc):
 return [n for script in doc.xpath('//script[@type="application/ld+json"]/text()') for n in nodes(json.loads(script))]
html_changed=[p for p in changed if p.endswith('.html')]
canonical_dates={}
for p in html_changed:
 doc=document(p);canonical=doc.xpath('//link[@rel="canonical"]/@href')
 dates=[n['dateModified'][:10] for n in structured(doc) if isinstance(n.get('dateModified'),str)]
 if canonical and dates:canonical_dates[canonical[0]]=max(dates)
if '--sitemap-patch' in sys.argv:
 print('*** Begin Patch')
 for p in ['sitemap.xml','sitemap-seo-2026.xml']:
  old=(ROOT/p).read_text(encoding='utf-8')
  def update(m):
   url=re.search(r'<loc>(.*?)</loc>',m[0])[1]
   return re.sub(r'<lastmod>.*?</lastmod>','<lastmod>'+canonical_dates[url]+'</lastmod>',m[0]) if url in canonical_dates else m[0]
  revised=re.sub(r'<url>.*?</url>',update,old,flags=re.S)
  if old!=revised:patch_file(p,old,revised)
 print('*** End Patch');sys.exit()
checks=[]
def check(name,value,detail=None):checks.append({'name':name,'pass':bool(value),'detail':detail})
protected=['calculadoras/pago-quincenal.html','calculadoras/salario-diario.html','calculadoras/bono.html','calculadoras/aguinaldo.html','articulos/aguinaldo-por-antiguedad.html','articulos/aguinaldo-3-meses.html','calculadoras/salario-diario-integrado.html','assets/js/calculators.js']
for p in protected:check('unchanged '+p,before.get(p)==current.get(p))
check('no deleted files',not deleted,deleted)
def clean(s):return ' '.join(unicodedata.normalize('NFC',s).split())
for p in html_changed:
 doc=document(p);schemas=structured(doc);faq=[n for n in schemas if n.get('@type')=='FAQPage']
 check('no duplicate FAQPage '+p,len(faq)<=1, len(faq))
 if faq:
  for q in faq[0].get('mainEntity',[]):
   matches=[d for d in doc.xpath('//details[summary]') if clean(d.find('summary').text_content())==clean(q['name'])]
   answers=[clean(' '.join(c.text_content() for c in d if c.tag!='summary')) for d in matches]
   check('FAQ visible '+p+' '+q['name'],clean(q['acceptedAnswer']['text']) in answers,{'matches':len(matches)})
 if p.startswith('fallback-'):continue
 oldpath=OUT/'antes'/p
 if oldpath.exists():
  old=html.fromstring(oldpath.read_text(encoding='utf-8'))
  check('canonical preserved '+p,old.xpath('//link[@rel="canonical"]/@href')==doc.xpath('//link[@rel="canonical"]/@href'))
for file in ['sitemap.xml','sitemap-seo-2026.xml']:
 text=(ROOT/file).read_text(encoding='utf-8')
 for url,date in canonical_dates.items():
  match=re.search(r'<url>\s*<loc>'+re.escape(url)+r'</loc>(.*?)</url>',text,re.S)
  if match:check('lastmod '+file+' '+url,'<lastmod>'+date+'</lastmod>' in match[0])
report={'date':'2026-10-25','deployment_date':None,'changed':changed,'new':new,'deleted':deleted,'html_files_changed':len(html_changed),'canonical_urls_changed':len(canonical_dates),'canonical_dates':canonical_dates,'checks':checks,'status':'PASS' if all(c['pass'] for c in checks) else 'FAIL'}
(OUT/'cierre-verificado.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({k:v for k,v in report.items() if k!='checks'},ensure_ascii=False,indent=2))
print(json.dumps({'failed':[c for c in checks if not c['pass']]},ensure_ascii=False,indent=2))

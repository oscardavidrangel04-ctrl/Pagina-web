"""Semantic preservation vs the last SEO release; run after build-public.cjs."""
from pathlib import Path
from lxml import html
from collections import Counter
import json, subprocess, hashlib, os
root=Path(__file__).resolve().parents[1]
os.chdir(root)
target='calculadoras/salario-diario.html'
fixture=json.loads(Path('docs/salario-diario-ui/baseline.json').read_text())
base=fixture['html']
current=Path(target).read_text()
a,b=html.fromstring(base),html.fromstring(current)
checks=[]
def check(name, condition):
 assert condition,name
 checks.append(name)
for xp in ['//title/text()','//h1/text()','//meta/@content','//link[@rel="canonical"]/@href','//script[@type="application/ld+json"]/text()']:
 check('Preserved '+xp,a.xpath(xp)==b.xpath(xp))
for level in ['h2','h3']:
 before=Counter(' '.join(e.itertext()).strip() for e in a.xpath('//'+level))
 after=Counter(' '.join(e.itertext()).strip() for e in b.xpath('//'+level))
 check('Original '+level+' retained',not(before-after))
for e in a.xpath('//main//p | //main//li | //main//table'):
 text=' '.join(' '.join(e.itertext()).split())
 check('Content retained '+text[:60],text in ' '.join(' '.join(b.xpath('//main')[0].itertext()).split()))
check('All prior link destinations retained',set(a.xpath('//a/@href'))<=set(b.xpath('//a/@href')))
for href in b.xpath('//*[contains(@class,"salary-next-grid")]//a/@href'):
 check('Related destination '+href,Path(href.lstrip('/')).is_file())
check('Unique IDs',len(b.xpath('//@id'))==len(set(b.xpath('//@id'))))
for frag in b.xpath('//a[starts-with(@href,"#")]/@href'):
 check('Anchor '+frag,frag[1:] in b.xpath('//@id'))
compiled=html.fromstring(Path('site-public',target).read_text())
check('GA single loader',len(compiled.xpath('//script[contains(@src,"gtag/js?id=G-KV44465NKW")]'))==1)
check('Ads outside workspace',not compiled.xpath('//*[@id="calculadora"]//*[contains(@class,"adsterra") or @data-affiliate]'))
# The page-specific calculation function must be byte-identical to the prior release.
js=Path('assets/js/salario-diario.js').read_text(); old=fixture['js']
check('Arithmetic unchanged',js[js.index('  const days'):js.index("  if (typeof module")]==old[old.index('  const days'):old.index("  if (typeof module")])
# Optional pre-task compiled snapshot verifies every other output byte for byte.
snapshot=Path(os.environ.get('SALARY_UI_BASELINE','/tmp/salary-premium-baseline'))
unchanged=0
if snapshot.is_dir():
 changed=[]
 for f in snapshot.rglob('*'):
  if f.is_file():
   rel=f.relative_to(snapshot);now=Path('site-public')/rel
   if now.read_bytes()!=f.read_bytes():changed.append(str(rel))
   else:unchanged+=1
 check('Only 3 public files changed',set(changed)=={target,'assets/css/salario-diario.css','assets/js/salario-diario.js'})
 for xp in ['//script/@src','//*[@data-affiliate]/@data-affiliate','//a[contains(@href,"rzekl") or contains(@href,"dkfrh")]/@href']:
  prior=html.fromstring((snapshot/target).read_text()).xpath(xp);now=compiled.xpath(xp)
  check('Integration preserved '+xp,[x.replace('salario-diario.js?v=1','salario-diario.js?v=2') for x in prior]==now)
report={'status':'PASS','checks':len(checks),'unchangedPublicFiles':unchanged,'publicFiles':sum(f.is_file() for f in Path('site-public').rglob('*')),'checksPassed':checks}
Path('docs/salario-diario-ui/validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='checksPassed'}))

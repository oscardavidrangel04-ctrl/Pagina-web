"""Read compiled pages; report crawlable routes and exact, reproducible findings.

Run after build-public.cjs. No network, edits or inference of Google indexing.
"""
import json,re,csv,sys,gzip
from collections import Counter,defaultdict,deque
from pathlib import Path
from urllib.parse import urljoin,urlsplit,unquote
from lxml import html

ROOT=Path(__file__).resolve().parents[1]
BASE='https://calculadora-isr-mexico.vercel.app'
PUBLIC=ROOT/'site-public'
OUT=Path(sys.argv[1]) if len(sys.argv)>1 else ROOT/'docs/seo-integral-2026-11-09/audit-after.json'
config=json.loads((ROOT/'vercel.json').read_text())
rewrites={r['source']:r['destination'] for r in config.get('rewrites',[])}
redirects={r['source']:r['destination'] for r in config.get('redirects',[])}
header_noindex={r['source'] for r in config.get('headers',[]) if any(h['key'].lower()=='x-robots-tag' and 'noindex' in h['value'] for h in r['headers'])}
sitemap={}
for path in PUBLIC.glob('sitemap*.xml'):
    for loc,last in re.findall(r'<url>\s*<loc>([^<]+)</loc>(?:\s*<lastmod>([^<]+)</lastmod>)?',path.read_text()):sitemap[urlsplit(loc).path]=last
trees={};rows=[];issues=[];edges=defaultdict(set);schema_types=Counter()
def norm(path):return '/' if path=='/index.html' else path
def text(el):return ' '.join(el.text_content().split())
def nodes(obj):
    if isinstance(obj,list):
        for item in obj:yield from nodes(item)
    elif isinstance(obj,dict):
        yield obj
        for value in obj.values():yield from nodes(value)
for file in sorted(PUBLIC.rglob('*.html')):
    route=norm('/'+file.relative_to(PUBLIC).as_posix())
    effective=PUBLIC/rewrites.get(route,route if route!='/' else '/index.html').lstrip('/')
    source=effective.read_text();d=html.fromstring(source);trees[route]=d
    title=' '.join(d.xpath('//title/text()'));desc=''.join(d.xpath('//meta[@name="description"]/@content'))
    canon=d.xpath('//link[@rel="canonical"]/@href');robots=','.join(d.xpath('//meta[@name="robots"]/@content'))
    indexable=route not in redirects and route not in header_noindex and route not in ['/404.html','/offline.html'] and 'noindex' not in robots and (not canon or canon==[BASE+route])
    def issue(kind,detail):issues.append({'url':route,'kind':kind,'detail':detail})
    ids=Counter(d.xpath('//@id'))
    if indexable:
        if canon!=[BASE+route]:issue('canonical',canon)
        if len(d.xpath('//h1'))!=1:issue('h1_count',len(d.xpath('//h1')))
        for kind,values in [('description',d.xpath('//meta[@name="description"]/@content')),('title',d.xpath('//title/text()'))]:
            if len(values)!=1 or not values[0].strip():issue(kind,values)
        for ident,n in ids.items():
            if n>1:issue('duplicate_id',ident)
        for img in d.xpath('//img[not(@alt)]'):issue('image_alt',img.get('src'))
        for el in d.xpath('//input[not(@type="hidden")]|//select|//textarea'):
            ident=el.get('id');label=d.xpath('//label[@for=$ident]',ident=ident or '')
            if not label and not el.get('aria-label') and not el.get('aria-labelledby') and not el.xpath('ancestor::label'):issue('form_label',ident)
        for a in d.xpath('//a[@href]'):
            if not text(a) and not a.get('aria-label') and not a.xpath('.//img[@alt!=""]'):issue('empty_anchor',a.get('href'))
    for script in d.xpath('//script[@type="application/ld+json"]'):
        try:structured=json.loads(script.text or '')
        except Exception as exc:issue('jsonld_parse',str(exc));continue
        for item in nodes(structured):
            typ=item.get('@type');schema_types[str(typ)]+=bool(typ)
            if indexable and typ in ['WebPage','BlogPosting','Article','WebApplication','SoftwareApplication'] and item.get('description') and item.get('description')!=desc:issue('schema_description',{'type':typ,'description':item['description']})
            if typ=='FAQPage':
                plain=text(d).lower()
                for q in item.get('mainEntity',[]):
                    if ' '.join(q.get('name','').lower().split()) not in plain:issue('faq_question_not_visible',q.get('name'))
    js=d.xpath('//script[@src]/@src');css=d.xpath('//link[@rel="stylesheet"]/@href')
    for kind,urls in [('js',js),('css',css)]:
        for url,n in Counter(urls).items():
            if n>1:issue('duplicate_resource',url)
    size={'html_bytes':len(source.encode()),'html_gzip':len(gzip.compress(source.encode()))}
    for kind,urls in [('js',js),('css',css)]:
        files={PUBLIC/urlsplit(u).path.lstrip('/') for u in urls if u.startswith('/') and not u.startswith('/_vercel/')}
        size[kind+'_bytes']=sum(f.stat().st_size for f in files if f.is_file())
    for el,attr in [(e,'src') for e in d.xpath('//script[@src]|//img[@src]')]+[(e,'href') for e in d.xpath('//link[@rel="stylesheet"]')]:
        u=urlsplit(urljoin(BASE+route,el.get(attr,'')))
        if u.netloc==urlsplit(BASE).netloc and not u.path.startswith('/_vercel/') and not (PUBLIC/u.path.lstrip('/')).is_file():issue('missing_asset',u.path)
    rows.append({'url':route,'served_file':str(effective.relative_to(PUBLIC)),'indexable':indexable,'title':title,'description':desc,'h1':' | '.join(map(text,d.xpath('//h1'))),'canonical':canon,'sitemap':route in sitemap,'lastmod':sitemap.get(route),'h2_count':len(d.xpath('//main//h2')),'word_count':len(text(d.xpath('//main')[0] if d.xpath('//main') else d).split()),**size})
for row in rows:
    route=row['url'];d=trees[route]
    for a in d.xpath('//a[@href]'):
        u=urlsplit(urljoin(BASE+route,a.get('href')))
        if u.netloc!=urlsplit(BASE).netloc or u.scheme not in ['http','https']:continue
        target=norm(unquote(u.path))
        if target in trees:
            edges[route].add(target)
            if row['indexable'] and u.fragment and not u.fragment.startswith('categoria=') and not trees[target].xpath('//*[@id=$v]|//a[@name=$v]',v=unquote(u.fragment)):
                issues.append({'url':route,'kind':'broken_fragment','detail':a.get('href')})
        elif not (PUBLIC/target.lstrip('/')).is_file() and target not in redirects:
            issues.append({'url':route,'kind':'broken_link','detail':a.get('href')})
depth={'/':0};queue=deque(['/'])
while queue:
    for target in edges[queue.popleft()]:
        if target not in depth:depth[target]=min(depth[src]+1 for src in depth if target in edges[src]);queue.append(target)
inlinks=Counter(t for src,targets in edges.items() if next(r['indexable'] for r in rows if r['url']==src) for t in targets if t!=src)
for row in rows:row.update(depth=depth.get(row['url']),unique_inlinks=inlinks[row['url']])
for field in ['title','description']:
    vals=defaultdict(list)
    for row in rows:
        if row['indexable']:vals[row[field]].append(row['url'])
    for val,urls in vals.items():
        if len(urls)>1:issues.append({'url':urls,'kind':'duplicate_'+field,'detail':val})
result={'summary':{'physical_html':len(rows),'indexable_routes':sum(r['indexable'] for r in rows),'sitemap_routes':len(sitemap),'orphan_indexable':sum(r['indexable'] and r['unique_inlinks']==0 for r in rows),'unreachable_indexable':sum(r['indexable'] and r['depth'] is None for r in rows),'issues_by_kind':dict(Counter(i['kind'] for i in issues))},'pages':rows,'issues':issues,'schema_types':dict(schema_types),'conditions':'Local Vercel build, rewrites and explicit X-Robots-Tag evaluated; indexable does not mean indexed by Google; no remote HTTP/CWV measurement.'}
OUT.parent.mkdir(parents=True,exist_ok=True);OUT.write_text(json.dumps(result,ensure_ascii=False,indent=2))
with OUT.with_suffix('.csv').open('w',encoding='utf-8-sig',newline='') as f:
    writer=csv.DictWriter(f,fieldnames=rows[0].keys());writer.writeheader();writer.writerows(rows)
print(json.dumps(result['summary'],ensure_ascii=False))

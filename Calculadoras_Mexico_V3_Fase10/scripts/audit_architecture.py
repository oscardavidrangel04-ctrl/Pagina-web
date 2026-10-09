"""Read-only, rewrite-aware static crawl. Run from project root."""
import json, re, sys
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse, unquote
from collections import deque, Counter
ROOT=Path.cwd()
BASE='https://calculadora-isr-mexico.vercel.app'
class Page(HTMLParser):
    def __init__(self,text):
        super().__init__(); self.links=[]; self.canonical=''; self.robots=''; self.title=''; self.stack=[]; self.anchor=None; self.intitle=False; self.feed(text)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag in ('nav','header','footer','main','article','section'): self.stack.append((tag,a.get('class','')+' '+a.get('id','')))
        if tag=='a': self.anchor=[a.get('href',''),'',' / '.join(t+' '+v for t,v in self.stack)]
        if tag=='title': self.intitle=True
        if tag=='link' and 'canonical' in a.get('rel',''): self.canonical=a.get('href','')
        if tag=='meta' and a.get('name','').lower() in ('robots','googlebot'): self.robots+=' '+a.get('content','')
    def handle_data(self,data):
        if self.anchor is not None:self.anchor[1]+=data
        if self.intitle:self.title+=data
    def handle_endtag(self,tag):
        if tag=='a' and self.anchor is not None:self.links.append(self.anchor);self.anchor=None
        if tag=='title':self.intitle=False
        if tag in ('nav','header','footer','main','article','section'):
            for i in range(len(self.stack)-1,-1,-1):
                if self.stack[i][0]==tag:self.stack=self.stack[:i];break
def norm(href,src='/'):
    u=urlparse(urljoin(BASE+src,href))
    if u.netloc!=urlparse(BASE).netloc or u.scheme not in ('http','https'):return None
    p=unquote(u.path)
    return '/' if p=='/index.html' else p
def audit():
    cfg=json.loads((ROOT/'vercel.json').read_text(encoding='utf-8-sig'))
    rewrites={x['source']:x['destination'] for x in cfg.get('rewrites',[]) if ':' not in x['source']}
    redirects={x['source']:x['destination'] for x in cfg.get('redirects',[]) if ':' not in x['source']}
    physical={}
    for f in list(ROOT.glob('*.html'))+list((ROOT/'articulos').glob('*.html'))+list((ROOT/'calculadoras').glob('*.html'))+list((ROOT/'temas').glob('*.html')):
        path='/'+f.relative_to(ROOT).as_posix(); path='/' if path=='/index.html' else path
        physical[path]=f
    maps={}
    for f in ROOT.glob('sitemap*.xml'):
        for loc in re.findall(r'<loc>\s*(.*?)\s*</loc>',f.read_text(encoding='utf-8-sig')):maps.setdefault(norm(loc),[]).append(f.name)
    pages={}
    for path,file in physical.items():
        effective=physical.get(rewrites.get(path,''),file)
        p=Page(effective.read_text(encoding='utf-8-sig'))
        canon=norm(p.canonical,path) if p.canonical else None
        indexable='noindex' not in p.robots.lower() and path not in redirects and (canon is None or canon==path) and path not in ('/404.html','/offline.html')
        pages[path]={'url':BASE+path,'file':str(file.relative_to(ROOT)),'served_file':str(effective.relative_to(ROOT)),'title':p.title,'canonical':p.canonical,'robots':p.robots.strip(),'indexable':indexable,'expected_http':302 if path in redirects else 200,'sitemap':maps.get(path,[]),'links':p.links,'inlinks':[]}
    broken=[]; redlinks=[]; edges={}
    for path,p in pages.items():
        edges[path]=set()
        for href,anchor,context in p['links']:
            target=norm(href,path)
            if target is None or not href or href.startswith('#'):continue
            if target in redirects:redlinks.append({'source':path,'target':target,'destination':redirects[target]})
            if target in pages:
                edges[path].add(target)
                if target!=path and p['indexable']:pages[target]['inlinks'].append({'source':path,'anchor':anchor.strip(),'context':context})
            elif not (ROOT/target.lstrip('/')).exists():broken.append({'source':path,'target':target,'anchor':anchor.strip()})
        p['outlinks']=len(edges[path]-{path})
    depth={'/':0};q=deque(['/'])
    while q:
        src=q.popleft()
        for dest in edges.get(src,[]):
            if dest not in depth:depth[dest]=depth[src]+1;q.append(dest)
    rows=[]
    for path,p in pages.items():
        p['path']=path;p['depth']=depth.get(path);p['unique_inlinks']=len({x['source'] for x in p['inlinks']});p.pop('links');rows.append(p)
    ix=[p for p in rows if p['indexable']]
    summary={'physical_pages':len(rows),'indexable':len(ix),'zero_inlinks':sum(p['unique_inlinks']==0 for p in ix),'one_inlink':sum(p['unique_inlinks']==1 for p in ix),'unreachable':sum(p['depth'] is None for p in ix),'depth':dict(Counter(str(p['depth']) for p in ix)),'broken_links':len(broken),'redirect_links':len(redlinks),'sitemap_missing_pages':[p for p in maps if p not in pages],'sitemap_nonindexable':[p['path'] for p in rows if p['sitemap'] and not p['indexable']],'indexable_not_sitemap':[p['path'] for p in ix if not p['sitemap']]}
    return {'summary':summary,'pages':rows,'broken':broken,'redirect_links':redlinks,'rewrites':rewrites}
if __name__=='__main__':print(json.dumps(audit(),ensure_ascii=False))

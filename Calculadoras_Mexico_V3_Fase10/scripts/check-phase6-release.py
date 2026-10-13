"""Read-only release gate. Resolves served HTML, including Vercel rewrites."""
import importlib.util
import json
import re
import sys
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote
from urllib.robotparser import RobotFileParser
from audit_architecture import audit, BASE, ROOT

spec=importlib.util.spec_from_file_location('technical',ROOT/'scripts/audit-seo-technical.py')
technical=importlib.util.module_from_spec(spec);spec.loader.exec_module(technical)

def check():
    result=technical.inspect(); crawl=audit(); issues=list(result['issues'])
    pages={p['path']:p for p in crawl['pages'] if p['indexable']}
    documents={key:(ROOT/p['served_file']).read_text(encoding='utf-8-sig') for key,p in pages.items()}
    tags={key:technical.Tags(text).tags for key,text in documents.items()}
    ids={key:{a['id'] for _,a in rows if a.get('id')} for key,rows in tags.items()}
    robots=RobotFileParser();robots.parse((ROOT/'robots.txt').read_text().splitlines())
    for key,p in pages.items():
        rows=tags[key];text=documents[key]
        def issue(kind,detail):issues.append({'url':key,'kind':kind,'detail':detail})
        if sum(t=='h1' for t,_ in rows)!=1:issue('h1','Expected one H1')
        if not p['title'].strip():issue('title','Empty title')
        if not any(t=='html' and a.get('lang','').startswith('es') for t,a in rows):issue('language','Spanish language missing')
        if not any(t=='meta' and a.get('name')=='viewport' and 'width=device-width' in a.get('content','') for t,a in rows):issue('viewport','Missing responsive viewport')
        if not robots.can_fetch('Googlebot',p['url']):issue('robots','Blocked by robots.txt')
        for attrs,raw in re.findall(r'<script([^>]*)>(.*?)</script>',text,re.S|re.I):
            if 'application/ld+json' not in attrs:continue
            try:json.loads(raw)
            except ValueError:issue('json_ld','Invalid JSON')
        for tag,a in rows:
            if tag!='a' or not a.get('href'):continue
            u=urlparse(urljoin(p['url'],a['href']))
            if u.netloc!=urlparse(BASE).netloc or not u.fragment or u.fragment.startswith('categoria='):continue
            target='/' if u.path=='/index.html' else unquote(u.path)
            if target in ids and unquote(u.fragment) not in ids[target]:issue('cross_page_anchor',a['href'])
    for key,value in result['architecture'].items():
        if key in ('broken_links','redirect_links','zero_inlinks','unreachable','sitemap_missing_pages','sitemap_nonindexable','indexable_not_sitemap') and value:
            issues.append({'kind':key,'detail':value})
    for key in ('duplicate_titles','duplicate_descriptions'):
        if result[key]:issues.append({'kind':key,'detail':result[key]})
    cfg=json.loads((ROOT/'vercel.json').read_text(encoding='utf-8-sig'))
    for entry in cfg.get('rewrites',[]):
        dest=entry['destination']
        if dest.startswith('/') and ':' not in dest and not (ROOT/dest.lstrip('/')).is_file():issues.append({'kind':'rewrite_destination','detail':entry})
    return {'status':'PASS' if not issues else 'FAIL','checked_urls':len(pages),'architecture':result['architecture'],'issues':issues}

if __name__=='__main__':
    report=check();print(json.dumps(report,ensure_ascii=False,indent=2));sys.exit(0 if report['status']=='PASS' else 1)

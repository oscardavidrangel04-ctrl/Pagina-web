"""Read-only technical checks of effective HTML, including Vercel rewrites."""
import json, re
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from audit_architecture import audit, ROOT, BASE

class Tags(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.tags=[]; self.feed(text)
    def handle_starttag(self, tag, attrs): self.tags.append((tag,dict(attrs)))

def inspect():
    a=audit(); issues=[]; titles={}; descriptions={}
    for page in a['pages']:
        if not page['indexable'] or page['path'].startswith('/google'): continue
        text=(ROOT/page['served_file']).read_text(encoding='utf-8-sig'); tags=Tags(text).tags
        def issue(kind, detail): issues.append({'url':page['path'],'file':page['served_file'],'kind':kind,'detail':detail})
        canon=[x.get('href') for t,x in tags if t=='link' and x.get('rel')=='canonical']
        desc=[x.get('content','') for t,x in tags if t=='meta' and x.get('name')=='description']
        if len(canon)!=1 or canon[0]!=page['url']: issue('canonical',canon)
        if len(desc)!=1 or not desc[0].strip(): issue('description',desc)
        titles.setdefault(page['title'],[]).append(page['path'])
        if desc: descriptions.setdefault(desc[0],[]).append(page['path'])
        ids=[x['id'] for t,x in tags if x.get('id')]
        dup=[k for k,v in Counter(ids).items() if v>1]
        if dup: issue('duplicate_ids',dup)
        for t,x in tags:
            # Category hashes are application state handled by common.js.
            if t=='a' and x.get('href','').startswith('#') and not x['href'].startswith('#categoria=') and len(x['href'])>1 and x['href'][1:] not in ids: issue('broken_anchor',x['href'])
            if t in ('script','img','link'):
                target=x.get('src','') if t!='link' else (x.get('href','') if x.get('rel')=='stylesheet' else '')
                if target.startswith('/') and not target.startswith('//') and not target.startswith('/_vercel/'):
                    f=ROOT/target.split('?')[0].lstrip('/')
                    if not f.exists(): issue('missing_asset',target)
    return {'architecture':a['summary'],'checked_pages':sum(len(v) for v in titles.values()),'issues':issues,'duplicate_titles':{k:v for k,v in titles.items() if len(v)>1},'duplicate_descriptions':{k:v for k,v in descriptions.items() if len(v)>1}}
if __name__=='__main__': print(json.dumps(inspect(),ensure_ascii=False,indent=2))

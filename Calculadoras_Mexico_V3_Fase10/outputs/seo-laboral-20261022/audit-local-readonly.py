"""Read-only evidence helper for the labor SEO audit. Prints JSON; writes nothing."""
import json
import re
import sys
from pathlib import Path
from html.parser import HTMLParser
from collections import Counter, defaultdict
from difflib import SequenceMatcher

ROOT = Path(__file__).resolve().parents[2]
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, str(ROOT / 'scripts'))
from audit_architecture import audit

TERMS = r'aguinaldo|finiquito|liquidacion|vacacion|salario|sueldo|nomina|horas-extra|ptu|utilidades|despido|indemnizacion|antiguedad|factor-integracion|pago-quincenal'

class Text(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.skip = 0
        self.main = 0
        self.chunks = []
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style'): self.skip += 1
        if tag == 'main': self.main += 1
    def handle_endtag(self, tag):
        if tag in ('script', 'style'): self.skip -= 1
        if tag == 'main': self.main -= 1
    def handle_data(self, data):
        if not self.skip and self.main: self.chunks.append(data)

def clean(raw):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]*>', ' ', raw)).strip()

def nodes(obj):
    if isinstance(obj, dict):
        yield obj
        for value in obj.values(): yield from nodes(value)
    elif isinstance(obj, list):
        for value in obj: yield from nodes(value)

def get_pages():
    pages = []
    for page in audit()['pages']:
        if not page['indexable'] or not re.search(TERMS, page['path']): continue
        if any(s in page['path'] for s in ('gat-nominal', 'presupuesto-', 'organizar-primer-sueldo', 'que-hacer-con-aumento')): continue
        raw = (ROOT / page['served_file']).read_text(encoding='utf-8-sig')
        schemas = []
        for attrs, data in re.findall(r'<script([^>]*)>(.*?)</script>', raw, re.S | re.I):
            if 'application/ld+json' in attrs: schemas.extend(nodes(json.loads(data)))
        article_nodes = [n for n in schemas if n.get('@type') in ('Article', 'BlogPosting', 'NewsArticle')]
        text = ' '.join(Text(raw).chunks)
        pages.append({**page, 'raw':raw, 'text':text, 'words': len(text.split()), 'headings':[(t,clean(h)) for t,h in re.findall(r'<(h[123])[^>]*>(.*?)</\1>',raw,re.S|re.I)], 'article_nodes':article_nodes})
    return pages

mode = sys.argv[1] if len(sys.argv)>1 else 'inventory'
pages = get_pages()
if mode == 'inventory':
    print(json.dumps([{k:p[k] for k in ('path','served_file','title','words','unique_inlinks','depth')} for p in pages], ensure_ascii=False, indent=2))
elif mode == 'schema':
    rows=[]
    for p in pages:
        a=p['article_nodes']
        dates=set(n.get('dateModified','') for n in a)
        visible = re.findall(r'(?:Actualizad[oa]|Publicad[oa]|revisad[oa]|consultad[oa])[\s\S]{0,110}', p['text'], re.I)
        if len(a)>1 or len(dates)>1:
            rows.append({'path':p['path'],'article_nodes':a,'visible_dates':visible})
    print(json.dumps(rows,ensure_ascii=False,indent=2))
elif mode == 'copies':
    rows=[]
    for p in pages:
        if p['file']==p['served_file']:continue
        original=(ROOT/p['file']).read_text(encoding='utf-8-sig')
        rows.append({'path':p['path'],'served_file':p['served_file'],'same_bytes':original==p['raw'],'main_text_similarity':round(SequenceMatcher(None,' '.join(Text(original).chunks),p['text']).ratio(),4),'original_words':len(' '.join(Text(original).chunks).split()),'served_words':p['words']})
    print(json.dumps(rows,ensure_ascii=False,indent=2))
elif mode == 'paragraphs':
    blocks=defaultdict(set)
    for p in pages:
        for raw in re.findall(r'<p(?:\s[^>]*)?>(.*?)</p>',p['raw'],re.S|re.I):
            paragraph=clean(raw)
            if len(paragraph.split())>=35:blocks[paragraph].add(p['path'])
    print(json.dumps([{'paragraph':k,'count':len(v),'paths':sorted(v)} for k,v in sorted(blocks.items(),key=lambda x:len(x[1]),reverse=True) if len(v)>1][:35],ensure_ascii=False,indent=2))
elif mode == 'detail':
    selected=sys.argv[2:]
    print(json.dumps([{k:p[k] for k in ('path','title','words','headings','article_nodes','text')} for p in pages if any(s in p['path'] for s in selected)],ensure_ascii=False,indent=2))
elif mode == 'summary':
    doubles=[p['path'] for p in pages if len(p['article_nodes'])>1]
    copies=[p for p in pages if p['file']!=p['served_file']]
    print(json.dumps({'scope_pages':len(pages),'articles':sum(p['path'].startswith('/articulos/') for p in pages),'calculators':sum(p['path'].startswith('/calculadoras/') for p in pages),'rewrites':len(copies),'rewrite_original_differs':sum((ROOT/p['file']).read_text(encoding='utf-8-sig')!=p['raw'] for p in copies),'multiple_article_nodes':doubles,'conflicting_dates':[{'path':p['path'],'dates':[n.get('dateModified') for n in p['article_nodes']]} for p in pages if len({n.get('dateModified') for n in p['article_nodes']})>1]},ensure_ascii=False,indent=2))

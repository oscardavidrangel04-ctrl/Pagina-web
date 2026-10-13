"""Read-only extraction of the supplied GSC workbook and scoped local SEO evidence."""
import json, re
from pathlib import Path
import openpyxl
from html import unescape

source = Path(r'C:/Users/Casa/Downloads/https___calculadora-isr-mexico.vercel.app_-Performance-on-Search-2026-10-11.xlsx')
book = openpyxl.load_workbook(source, read_only=True, data_only=True)
queries = list(book['Consultas'].values)[1:]
def group(q):
    q = q.lower()
    if re.search(r'202[1-5]', q): return 'Años anteriores'
    if 'imss' in q: return 'IMSS'
    if 'isr' in q or 'impuesto' in q or 'neto' in q: return 'ISR y neto'
    if 'mes' in q: return 'Meses trabajados'
    if 'proporcional' in q: return 'Proporcional'
    if 'año' in q or 'dias' in q or 'días' in q: return 'Días y antigüedad'
    return 'General'
groups = {}
for q,c,i,ctr,pos in queries:
    g = groups.setdefault(group(q), {'queries':0,'clicks':0,'impressions':0,'weighted_position_sum':0})
    g['queries']+=1; g['clicks']+=c; g['impressions']+=i; g['weighted_position_sum']+=i*pos
for g in groups.values():
    g['position'] = round(g.pop('weighted_position_sum')/g['impressions'],2)
print(json.dumps({'groups':groups,'sheets':[{ 'name':s.title,'rows':s.max_row,'clicks':sum(r[1] or 0 for r in list(s.values)[1:]) if s.max_column==5 else None,'impressions':sum(r[2] or 0 for r in list(s.values)[1:]) if s.max_column==5 else None} for s in book]},ensure_ascii=True))
root = Path(__file__).resolve().parent.parent
config = json.loads((root/'vercel.json').read_text(encoding='utf-8-sig'))
rewrites = {x['source']:x['destination'] for x in config['rewrites']}
urls = ['/calculadoras/aguinaldo.html','/calculadoras/aguinaldo-proporcional.html','/articulos/como-calcular-aguinaldo.html','/articulos/con-que-salario-se-calcula-aguinaldo.html','/articulos/aguinaldo-isr-2026.html','/articulos/aguinaldo-por-meses.html']
for url in urls:
    file = root/rewrites.get(url,url).lstrip('/')
    html = file.read_text(encoding='utf-8-sig')
    plain = lambda s: unescape(re.sub('<[^>]+>', ' ', s)).strip()
    links = [plain(body) for href,body in re.findall(r'<a\b[^>]*href="([^"]+)"[^>]*>(.*?)</a>',html,re.S) if '/calculadoras/aguinaldo.html' in href]
    print(json.dumps({'url':url,'file':str(file.relative_to(root)),'title':re.search('<title>(.*?)</title>',html,re.S).group(1),'headings':[plain(h) for h in re.findall(r'<h[12]\b[^>]*>(.*?)</h[12]>',html,re.S)],'links_to_main':links},ensure_ascii=True))

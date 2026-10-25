from pathlib import Path
import json,csv,re,datetime,hashlib,shutil
from lxml import html
ROOT=Path(__file__).resolve().parents[2]; OUT=Path(__file__).parent
d=json.loads((OUT/'fuentes-completas.json').read_text(encoding='utf8'))
def num(x):
    return float(str(x).replace('%','').replace(',','.'))
pages=[]
for url,c,i,ctr,pos in d['gsc']['Páginas'][1:]:
    pages.append(dict(url=url,clicks=int(c),impressions=int(i),ctr=c/i if i else 0,position=pos))
querysum={'clicks':sum(r[1] for r in d['gsc']['Consultas'][1:]),'impressions':sum(r[2] for r in d['gsc']['Consultas'][1:])}
weekly=[dict(period=r[0],clicks=r[1],impressions=r[2],ctr=r[1]/r[2] if r[2] else 0,position=r[4]) for r in d['gsc']['Gráfico'][1:]]
b=d['bing']['daily']; bc=sum(num(r['Clics']) for r in b);bi=sum(num(r['Impresiones']) for r in b)
gclicks=sum(r['clicks'] for r in weekly);gimp=sum(r['impressions'] for r in weekly)
base={'prepared':'2026-10-23','deployment_date':None,'gsc':{'period':'2026-07-28/2026-10-22','search_type':'Web (basada en texto)','query_rows':1000,'page_rows':len(pages),'query_url_join':False,'clicks':gclicks,'impressions':gimp,'ctr':gclicks/gimp,'query_export_totals':querysum,'pages':pages,'weekly':weekly,'devices':d['gsc']['Dispositivos']},'bing':{'daily_start':b[0]['Fecha'],'daily_end':b[-1]['Fecha'],'query_period':'No incluido en CSV; no asumir que coincide con diario','page_report':False,'clicks':bc,'impressions':bi,'ctr':bc/bi if bi else 0,'query_rows':len(d['bing']['queries']),'query_clicks':sum(num(r['Clics']) for r in d['bing']['queries']),'query_impressions':sum(num(r['Impresiones']) for r in d['bing']['queries'])},'limitations':['GSC consultas y páginas son agregados distintos; no cruzarlos como tabla consulta–URL.','GSC tiene 1000 consultas exportadas, no toda la demanda; no observado no implica no posiciona.','Bing carece de páginas y rango de fechas en el CSV de keywords.','Los últimos 5 días de GSC no deben compararse como una semana completa.','Los acumulados de periodos diferentes no prueban efecto SEO ni tendencia por URL.']}
(OUT/'linea-base.json').write_text(json.dumps(base,ensure_ascii=False,indent=2),encoding='utf8')
with (OUT/'linea-base-urls.csv').open('w',encoding='utf-8-sig',newline='') as f:
    w=csv.DictWriter(f,fieldnames=pages[0].keys());w.writeheader();w.writerows(pages)
allfiles={}
for p in ROOT.rglob('*'):
    rel=p.relative_to(ROOT)
    if p.is_file() and not any(x in rel.parts for x in ['outputs','.git','node_modules','.codex','.agents']) and p.suffix in ['.html','.js','.css','.json','.xml','.txt']:
        allfiles[str(rel).replace('\\','/')]=hashlib.sha256(p.read_bytes()).hexdigest()
baseline=OUT/'archivos-antes.json'
if not baseline.exists():baseline.write_text(json.dumps(allfiles,indent=2),encoding='utf8')
print(json.dumps({k:v for k,v in base.items() if k not in ['gsc','bing']},ensure_ascii=False))
print('GOOGLE',gclicks,gimp,gclicks/gimp, 'QUERY_SUBSET',querysum)
print('BING',base['bing'])

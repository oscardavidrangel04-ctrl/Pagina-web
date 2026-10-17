import json, zipfile, re, unicodedata
from pathlib import Path
import openpyxl

out=Path(__file__).resolve().parent
downloads=Path(r'C:\Users\Casa\Downloads')
x=downloads/'https___calculadora-isr-mexico.vercel.app_-Performance-on-Search-2026-10-17.xlsx'
w=openpyxl.load_workbook(x,read_only=True,data_only=True)
gsc={s.title:list(s.values) for s in w}
def norm(s):return ''.join(c for c in unicodedata.normalize('NFD',s.lower()) if unicodedata.category(c)!='Mn').strip()
def num(s):
    s=str(s).replace('.','').replace(',','.').upper()
    try:return float(s.rstrip('KM'))*(1000 if s.endswith('K') else 1000000 if s.endswith('M') else 1)
    except ValueError:return None
sources={'propia':'05-19-58-451Z','stori':'05-21-21-681Z','finsus':'05-22-42-213Z','buk':'05-53-33-437Z'}
matrix={};counts={}
for site,t in sources.items():
    with zipfile.ZipFile(downloads/('semrush-organic-positions-2026-10-17T'+t+'.zip')) as z:
        data=json.loads(z.read(next(n for n in z.namelist() if n.endswith('resultado.json'))))
    rows=data['reports'][0]['table']['rows'];unique={}
    for r in rows:
        k=norm(r[0]); p=int(r[2]) if str(r[2]).isdigit() else None
        if k not in unique or (p or 999)<(unique[k]['posicion'] or 999):unique[k]={'keyword':r[0],'posicion':p,'volumen':num(r[6]),'kd':num(r[7]),'url':r[8]}
    counts[site]={'filas':len(rows),'unicas':len(unique),'target':data['reports'][0]['title']}
    for k,v in unique.items():matrix.setdefault(k,{'keyword':v['keyword'],'semrush':{}})['semrush'][site]=v
for r in gsc['Consultas'][1:]:
    k=norm(r[0]);matrix.setdefault(k,{'keyword':r[0],'semrush':{}})['gsc']={'clics':r[1],'impresiones':r[2],'ctr':r[3],'posicion':r[4]}
for k,v in matrix.items():
    if re.search(r'neto a bruto|neto al bruto|netos a brutos|liquido a bruto',k):group='Inversa: enlazar salario-bruto'
    elif re.search(r'isr|impuesto|imss|retenci',k):group='Fiscal: mantener enlace a cálculo especializado'
    elif re.search(r'quincen|seman|mensual',k):group='Periodo: explicar captura y comparación'
    elif re.search(r'\d{4,}|mil',k):group='Importe: ejemplos con supuestos explícitos'
    else:group='Bruto a neto / conceptos: revisar relevancia'
    v['grupo']=group
ordered=sorted(matrix.values(),key=lambda v:-(v.get('gsc',{}).get('impresiones',0)))
audit=downloads/'futbol_seo_scraper_playwright_v4_lotes/futbol_seo_scraper_mejorado/salidas/auditoria_seo_resultados.zip'
with zipfile.ZipFile(audit) as z:
    competitors=[json.loads(z.read(n)) for n in z.namelist() if re.match(r'0[1-4]_.*\.json$',n)]
result={'fuente_gsc':str(x),'inventario_semrush':counts,'gsc':gsc,'matriz':ordered,'competidores':competitors}
(out/'evidencia.json').write_text(json.dumps(result,ensure_ascii=False,indent=2,default=str),encoding='utf-8')
totals={s:{'clics':sum((r[1] or 0) for r in gsc[s][1:]),'impresiones':sum((r[2] or 0) for r in gsc[s][1:])} for s in ['Gráfico','Páginas','Consultas','Dispositivos','Países']}
print(json.dumps({'inventario':counts,'totales':totals,'propias_semrush':[v for v in ordered if 'propia' in v['semrush']][:15],'prioridad_gsc':ordered[:12]},ensure_ascii=False))

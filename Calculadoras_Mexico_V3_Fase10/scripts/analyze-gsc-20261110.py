"""Read the supplied GSC workbook, retaining independent aggregation scopes.

Usage: python3 scripts/analyze-gsc-20261110.py /path/to/workbook.xlsx
This writes research CSV/JSON, never the input workbook or site HTML.
"""
from pathlib import Path
from urllib.parse import urlsplit
from collections import Counter, defaultdict
from datetime import date, timedelta
import csv, hashlib, json, re, sys
import openpyxl

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs/seo-gsc-2026-11-10'
OUT.mkdir(exist_ok=True)
SOURCE=Path(sys.argv[1])
BASE='https://calculadora-isr-mexico.vercel.app'
def writecsv(name,rows,columns=None):
    with (OUT/name).open('w',encoding='utf-8-sig',newline='') as f:
        w=csv.DictWriter(f,fieldnames=columns or list(rows[0]),lineterminator="\n");w.writeheader();w.writerows(rows)
def readcsv(path):
    with path.open(encoding='utf-8-sig') as f:return list(csv.DictReader(f))
workbook=openpyxl.load_workbook(SOURCE,read_only=True,data_only=True)
sheets={};summary={}
for sheet in workbook:
    values=list(sheet.values);columns=list(values[0]);rows=[dict(zip(columns,r)) for r in values[1:]]
    sheets[sheet.title]=rows
    writecsv('gsc-'+re.sub(r'[^a-z0-9]+','-',sheet.title.lower())+'.csv',rows,columns)
    summary[sheet.title]={'rows':len(rows)}
    if 'Clics' in columns:
        summary[sheet.title].update(clicks=sum(r['Clics'] for r in rows),impressions=sum(r['Impresiones'] for r in rows))
assert len(sheets['Páginas'])==186
audit=json.loads((ROOT/'docs/seo-semrush-2026-11-10/auditoria-despues.json').read_text())
known={row['url']:row for row in audit['pages']}
config=json.loads((ROOT/'vercel.json').read_text())
redirects={r['source']:r['destination'] for r in config.get('redirects',[])}
def canonical(url):
    parts=urlsplit(url)
    if parts.hostname!=urlsplit(BASE).hostname:return '', 'Dominio ajeno; no se atribuye a este sitio'
    route=parts.path or '/'
    if route=='/index.html':route='/'
    if route not in known and route.endswith('/') and route[:-1] in known:route=route[:-1]
    seen=set()
    while route in redirects and route not in seen:
        seen.add(route);route=redirects[route]
    if route not in known:return '', 'Ruta no resuelta en la configuración local'
    dest=known[route]['canonical']
    return (dest[0] if dest else BASE+route), 'Canonical HTML/configuración local; parámetros conservados en URL original'

pages={};normalizations=[]
for row in sheets['Páginas']:
    u,reason=canonical(row['Páginas principales']);assert u,row
    assert u not in pages, 'No agregar promedios de duplicados sin ponderación explícita'
    pages[u]=row
    normalizations.append({'original':row['Páginas principales'],'canonical_local':u,'tratamiento':reason})
writecsv('normalizacion-urls.csv',normalizations)
sem=readcsv(ROOT/'docs/seo-semrush-2026-11-10/semrush-1272-verificada.csv')
by_url=defaultdict(list);unassigned=[]
for row in sem:
    if not row['URL_confirmada_en_origen']:
        unassigned.append(row);continue
    u,reason=canonical(row['URL_confirmada_en_origen'])
    if not u:unassigned.append(row);continue
    by_url[u].append(row)

selected={
 '/calculadoras/salario-hora.html':'Comparar dos ofertas por hora y explicitar sus supuestos; corregir estado de resultados.',
 '/calculadoras/ahorro-mensual.html':'Añadir evolución mensual y momento de aportación, con entradas verificadas.',
 '/calculadoras/margen-ganancia.html':'Calcular precio desde margen objetivo sin confundirlo con aumento sobre costo.',
 '/articulos/isr-prima-vacacional.html':'Sustituir el límite hipotético por referencias oficiales fechadas y separación exento/gravado.',
 '/articulos/aguinaldo-por-antiguedad.html':'Corregir mínimo de prestación y estado/validaciones de su calculadora insertada.',
 '/articulos/que-es-propina.html':'Diferenciar definición, sugerencia, importe y total; depurar duplicación de contenido relacionado.',
 '/articulos/horario-transferencias-spei.html':'Resolver fecha de operación y alcance del horario por canal con Banxico.',
 '/articulos/convertir-salario-mensual-diario-hora.html':'Conectar escenarios verificables de conversión y comparación por hora.'
}
protected={
 '/calculadoras/salario-diario.html','/calculadoras/pago-quincenal.html','/calculadoras/salario-neto.html',
 '/calculadoras/bono.html','/articulos/isr-semanal-quincenal-mensual.html'
}
inventory=[];matrix=[]
for url in sorted(set(pages)|set(by_url)):
    p=pages.get(url);rs=by_url.get(url,[]);route=urlsplit(url).path;record=known[route]
    impressions=p['Impresiones'] if p else None;position=p['Posición'] if p else None
    if route in protected:priority='Auditar y proteger';action='Mantener la optimización vigente salvo nueva brecha demostrada; reforzar enlaces desde páginas complementarias.'
    elif route in selected:priority='Implementación seleccionada';action=selected[route]
    elif p and impressions>=300:priority='Revisión individual';action='Contrastar contenido actual y riesgo; conservar si la necesidad ya está cubierta.'
    elif p and 4<=position<=20:priority='Seguimiento de oportunidad';action='Validar consultas por URL antes de cambios amplios; promedio de página no es posición de keyword.'
    else:priority='Conservar / seguimiento';action='No ampliar alcance sin brecha concreta y consulta relevante.'
    inventory.append({'URL':url,'Archivo servido':record['served_file'],'Clics GSC':p['Clics'] if p else '',
      'Impresiones GSC':impressions if p else '', 'CTR exportado':p['CTR'] if p else '',
      'CTR calculado':p['Clics']/impressions if p and impressions else '',
      'Posición media GSC':position if p else '', 'Filas SEMrush':len(rs),
      'Keywords SEMrush distintas':len({r['Palabra clave'] for r in rs}),
      'Prioridad':priority,'Mejora propuesta':action,'Title actual':record['title'],'H1 actual':record['h1'],
      'Enlaces entrantes':record['unique_inlinks'],'Profundidad':record['depth'],
      'Límite de evidencia':'GSC por página 09-ago–10-nov-2026; SEMrush histórico. Sin serie diaria ni consultas GSC por URL.'})
    for r in rs or [None]:
        treatment='Relevancia por confirmar para la intención de la URL'
        if r and r['tratamiento_anio'].startswith('Año'):treatment='Excluir de la optimización vigente: año antiguo'
        elif r and ('margen del 20' in r['Palabra clave'] or 'calculadora de fondo de ahorro'==r['Palabra clave']):treatment='No orientar esta URL: intención distinta'
        elif r and float(r['Posición'])<=3:treatment='Proteger consulta históricamente bien posicionada; no es ranking actual'
        elif r and float(r['Posición'])<=20:treatment='Candidata histórica: comprobar brecha y compatibilidad de intención'
        matrix.append({'URL':url,'Keyword':r['Palabra clave'] if r else '',
         'Posición SEMrush':r['Posición'] if r else '', 'Volumen estimado':r['Volumen'] if r else '',
         'KD':r['KD (%)'] if r else '', 'Fecha SEMrush original':r['Actualización'] if r else '',
         'Clics GSC':p['Clics'] if p else '', 'Impresiones GSC':impressions if p else '',
         'CTR GSC':p['CTR'] if p else '', 'Posición media GSC':position if p else '',
         'Prioridad':priority,'Mejora propuesta':action,'Tratamiento keyword':treatment,
         'Relación consulta URL':'SEMrush histórico; no enlaza consultas GSC agregadas' if r else 'Sin relación consulta–URL aportada'})
writecsv('inventario-union-gsc-semrush.csv',inventory)
writecsv('matriz-url-keyword.csv',matrix)
writecsv('semrush-sin-url-conocida.csv',unassigned)
queries=sorted(sheets['Consultas'],key=lambda r:-r['Impresiones'])
query_groups=defaultdict(list)
for r in queries:
    q=r['Consultas principales'].lower()
    group=next((name for name,pattern in [('Propina',r'propina'),('Aguinaldo',r'aguinaldo'),('Prima vacacional',r'prima vacacional'),('ISR',r'isr'),('Salarios',r'sueldo|salario|quincen|semanal|gano|hora'),('SPEI',r'spei|transferencia'),('Ahorro',r'ahorro'),('Ganancia',r'ganancia|utilidad|margen')] if re.search(pattern,q)),'Otros')
    query_groups[group].append({**r,'URL GSC':'No disponible en esta hoja agregada'})
writecsv('consultas-sin-asignacion-url.csv',[{'Grupo':k,**r} for k,v in query_groups.items() for r in v])

daily={date.fromisoformat(str(r['Fecha'])[:10]):r for r in sheets['Gráfico']}
def period(start,end):
    rows=[r for d,r in daily.items() if start<=d<=end];clicks=sum(r['Clics'] for r in rows);impressions=sum(r['Impresiones'] for r in rows)
    return {'start':str(start),'end':str(end),'days':len(rows),'clicks':clicks,'impressions':impressions,'ctr':clicks/impressions if impressions else None,
      'impression_weighted_position':sum(r['Posición']*r['Impresiones'] for r in rows)/impressions if impressions else None}
last=max(daily)-timedelta(days=1)
stats={'source_filename':SOURCE.name,'source_sha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
 'filters':sheets['Filtros'],'date_start':str(min(daily)),'date_end':str(max(daily)),
 'sheets':summary,'gsc_urls':len(pages),'semrush_urls_confirmed':len(by_url),'intersection_urls':len(set(pages)&set(by_url)),
 'union_urls':len(inventory),'semrush_rows':len(sem),'semrush_unknown_url_rows':len(unassigned),
 'page_position_bands':dict(Counter('Menor de 4' if r['Posición']<4 else '4–10' if r['Posición']<=10 else 'Mayor de 10 hasta 20' if r['Posición']<=20 else 'Mayor de 20 hasta 50' if r['Posición']<=50 else '>50' for r in pages.values())),
 'property_trend_only':{'latest28':period(last-timedelta(days=27),last),'previous28':period(last-timedelta(days=55),last-timedelta(days=28))},
 'limitations':['Páginas sums differ from property graph; do not combine or force equality.',
 'Queries and Pages are independent aggregations; no row-order join.',
 'No per-URL trend available; property daily trend is not assigned to each page.',
 'Current export includes 10 November; omit that potentially partial day from the two 28-day windows.',
 'Overlapping historical periods are not before/after results of unpublished edits.']}
(OUT/'datos-verificados.json').write_text(json.dumps(stats,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(stats,ensure_ascii=False,indent=2))

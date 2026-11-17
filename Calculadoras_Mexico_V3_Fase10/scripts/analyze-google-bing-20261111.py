"""Analyze complete supplied exports; never infer query-to-page joins.

Usage: python3 scripts/analyze-google-bing-20261111.py /path/to/upload
Original files are retained privately under docs, excluded from the public build.
"""
from pathlib import Path
from urllib.parse import urlsplit
from collections import Counter, defaultdict
from datetime import date, datetime, timedelta
import csv, hashlib, json, re, shutil, sys, unicodedata
import openpyxl

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs/seo-google-bing-2026-11-11'
OUT.mkdir(exist_ok=True)
INPUT = Path(sys.argv[1])
BASE = 'https://calculadora-isr-mexico.vercel.app'
AUDIT = json.loads((ROOT/'docs/seo-gsc-2026-11-10/auditoria-despues.json').read_text())
KNOWN = {r['url']: r for r in AUDIT['pages']}
CONFIG_BASELINE=OUT/'configuration-avant.json'
if not CONFIG_BASELINE.exists():shutil.copyfile(ROOT/'vercel.json',CONFIG_BASELINE)
REDIRECTS = {r['source']: r['destination'] for r in json.loads(CONFIG_BASELINE.read_text()).get('redirects', [])}
unresolved_routes=set()

def slug(s):
    return re.sub('[^a-z0-9]+', '-', unicodedata.normalize('NFKD', s).encode('ascii','ignore').decode().lower()).strip('-')

def csvout(name, rows, fields=None):
    if not rows and not fields:
        fields=['Sin registros']
    with (OUT/name).open('w', encoding='utf-8-sig', newline='') as f:
        w=csv.DictWriter(f, fieldnames=fields or list(rows[0]), lineterminator='\n')
        w.writeheader(); w.writerows(rows)

def number(s):
    return float(str(s).replace('%','').replace(',','.'))

def readcsv(f):
    with f.open(encoding='utf-8-sig', newline='') as h: return list(csv.DictReader(h))

sources=[]
def source(pattern):
    files=list(INPUT.glob(pattern)); assert len(files)==1, (pattern,files)
    f=files[0]; dest=OUT/'fuentes-originales'/f.name; dest.parent.mkdir(exist_ok=True)
    if f.resolve()!=dest.resolve():shutil.copyfile(f,dest)
    sources.append({'archivo':f.name,'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'bytes':f.stat().st_size})
    return f

normalizations=[]
def canonical(url, provider):
    parts=urlsplit(url)
    assert parts.hostname==urlsplit(BASE).hostname, url
    route=parts.path or '/'
    if route=='/index.html': route='/'
    if route not in KNOWN and route.endswith('/') and route[:-1] in KNOWN:route=route[:-1]
    seen=set()
    while route in REDIRECTS and route not in seen:
        seen.add(route);route=REDIRECTS[route]
    if route not in KNOWN:
        unresolved_routes.add(route)
        KNOWN[route]={'canonical':[],'indexable':False,'served_file':'ABSENT','title':'NA','h1':'NA','depth':None,'unique_inlinks':0}
    canon=KNOWN[route]['canonical']
    result=canon[0] if canon else BASE+route
    normalizations.append({'Fuente':provider,'URL original':url,'Canonical local':result,'Método':'Configuración y canonical HTML local; parámetros y URL original preservados.'})
    return result

def workbook(f,prefix):
    data={}; meta={}
    for sheet in openpyxl.load_workbook(f,read_only=True,data_only=True):
        vals=list(sheet.values); fields=list(vals[0]); rows=[dict(zip(fields,r)) for r in vals[1:]]
        data[sheet.title]=rows;meta[sheet.title]={'registros':len(rows),'columnas':fields}
        csvout(prefix+'-'+slug(sheet.title)+'.csv', rows, fields)
        if 'Clics' in fields:
            meta[sheet.title].update(clics=sum(r['Clics'] for r in rows),impresiones=sum(r['Impresiones'] for r in rows))
    return data,meta

gsc,gsc_meta=workbook(source('*Performance-on-Search-2026-11-11.xlsx'),'google')
sem,sem_meta=workbook(source('SEMrush*1369*'),'semrush')
bing_pages=readcsv(source('*PageTrafficReport*'))
bing_queries=readcsv(source('*KeywordReport*'))
bing_daily=readcsv(source('*SearchPerformanceOverview*'))
assert len(gsc['Páginas'])==187 and len(sem['Posiciones organicas'])==1369
assert len(bing_pages)==98 and len(bing_queries)==746 and len(bing_daily)==90

google={}
for r in gsc['Páginas']:
    u=canonical(r['Páginas principales'],'Google'); assert u not in google
    google[u]=r
bing={}
for r in bing_pages:
    u=canonical(r['Página'],'Bing');assert u not in bing
    bing[u]={'Clics':int(r['Clics']),'Impresiones':int(r['Impresiones']),'CTR':number(r['CTR'])/100,'Posición':number(r['Posición media'])}
    assert abs(bing[u]['CTR']-bing[u]['Clics']/bing[u]['Impresiones'])<=0.000051
    r.update({'Canonical local':u,'Periodo':'No consta en este CSV; no asumir el periodo del informe diario.'})
csvout('bing-paginas.csv',bing_pages)
for r in bing_queries:
    r.update({'URL':'No disponible: consultas agregadas de propiedad','Periodo':'No consta en este CSV'})
csvout('bing-consultas.csv',bing_queries)
csvout('bing-diario.csv',bing_daily)

# Five page-14 home assignments repeat the unresolved placeholders established
# against original pasted text in stage 2. Keep them; do not use as URL evidence.
provisional={'isr calculadora 2024','isr 2024 calculadora','calculadora de asimilados a salarios','calculadora asimilados','calculadora asimilados 2023'}
by_url=defaultdict(list);all_by_url=defaultdict(list);unresolved=[];bands=Counter();keywords=defaultdict(set)
def band(p):
    return '1–3' if p<=3 else '4–10' if p<=10 else '11–20' if p<=20 else '21–30' if p<=30 else '31–50' if p<=50 else '51–100'
sem_rows=[]
for r in sem['Posiciones organicas']:
    u=canonical(r['URL posicionada'],'SEMrush');p=r['Posición'];bands[band(p)]+=1
    ambiguous=(r['Palabra clave'] in provisional and r['Página fuente']==14 and u==BASE+'/')
    q=r['Palabra clave'].lower();years=re.findall(r'\b20\d{2}\b',q)
    treatment='Revisar intención específica; estimación histórica, no ranking actual'
    if any(y!='2026' for y in years):treatment='Año distinto de 2026: no orientar automáticamente una página vigente'
    if ('credito-automotriz' in u and re.search(r'issste|finanmadrid',q)):treatment='Excluir de la optimización genérica: programa o institución específicos no simulados'
    if ('/bono.html' in u and re.search(r'issste|carbono|rendimiento|pension|pensión|gubernamental|financier',q)):treatment='Excluir: bono financiero, pensión u otra intención ajena al bono laboral'
    if q in ['calculo de valor','75000 mas iva','convertidor de horas de trabajo']:treatment='Intención ambigua o distinta: no reenfocar la URL solo por posición/volumen'
    if ambiguous:treatment='Excluir de priorización por URL: asignación a home no confirmada'
    record={**r,'Canonical local':u,'Banda de posición':band(p),'URL utilizable':not ambiguous,'Tratamiento de intención':treatment,
        'Límite':'Asignación a home pendiente: coincide con marcador no confirmado en fuente anterior.' if ambiguous else 'Relación reportada por el Excel; no se adjuntaron los 14 textos de origen para recotejar.'}
    sem_rows.append(record);all_by_url[r['URL posicionada']].append(r)
    if ambiguous:unresolved.append(record)
    else:by_url[u].append(r);keywords[r['Palabra clave']].add(u)
assert len(unresolved)==5
csvout('semrush-clasificada.csv',sem_rows)
csvout('semrush-asignaciones-provisionales.csv',unresolved)
summary_errors=[]
for r in sem['Resumen por URL']:
    rows=all_by_url[r['URL']];ps=[x['Posición'] for x in rows]
    expected={'Registros':len(rows),'Top 3':sum(p<=3 for p in ps),'Pos. 4-10':sum(4<=p<=10 for p in ps),
        'Pos. 11-20':sum(11<=p<=20 for p in ps),'Pos. 21-50':sum(21<=p<=50 for p in ps),
        'Pos. 51-100':sum(51<=p<=100 for p in ps),'Mejor posición':min(ps),'Volumen total*':sum(x['Volumen mensual'] for x in rows)}
    for key,v in expected.items():
        if r[key]!=v:summary_errors.append({'URL':r['URL'],'columna':key,'hoja':r[key],'recalculado':v})
assert not summary_errors,summary_errors
csvout('keywords-varias-urls.csv',[{'Keyword':k,'URLs SEMrush históricas':' | '.join(sorted(v)),'Diagnóstico':'Solapamiento histórico; no demuestra alternancia ni canibalización causal.'} for k,v in sorted(keywords.items()) if len(v)>1])

decisions=json.loads((OUT/'decisiones.json').read_text()) if (OUT/'decisiones.json').exists() else {}
protected={'/calculadoras/salario-diario.html','/calculadoras/pago-quincenal.html','/calculadoras/salario-neto.html','/calculadoras/bono.html','/articulos/isr-semanal-quincenal-mensual.html'}
recent={r['URL'].replace(BASE,'') for r in readcsv(ROOT/'docs/seo-gsc-2026-11-10/inventario-union-gsc-semrush.csv') if r['Prioridad']=='Implementación seleccionada'}
matrix=[]
for route,record in sorted(KNOWN.items()):
    if not record['indexable'] and route not in unresolved_routes:continue
    u=BASE+route;g=google.get(u);b=bing.get(u);rs=by_url.get(u,[])
    if route in decisions: priority=decisions[route]['prioridad'];action=decisions[route]['decision']
    elif route in protected|recent:priority='Baja';action='Proteger mejora reciente; riesgo de alterar contenido útil sin brecha nueva demostrada.'
    elif (g and g['Impresiones']>=100) or (b and b['Impresiones']>=100):priority='Media';action='Contenido revisado mediante inventario; falta brecha individual demostrada o consulta filtrada por URL antes de ampliar cambios.'
    else:priority='Baja';action='Conservar: evidencia limitada para una modificación adicional.'
    row={'URL':u,'Archivo servido':record['served_file']}
    for label,d in [('Google',g),('Bing',b)]:
        for src,out in [('Clics','Clics'),('Impresiones','Impresiones'),('CTR','CTR exportado'),('Posición','Posición media')]:row[f'{out} {label}']=d[src] if d else 'NA'
        row[f'CTR calculado {label}']=d['Clics']/d['Impresiones'] if d and d['Impresiones'] else 'NA'
    row.update({'Registros SEMrush':len(rs),'Keywords SEMrush distintas':len({r['Palabra clave'] for r in rs}),
      'Mejor posición SEMrush':min((r['Posición'] for r in rs),default='NA'),
      'Keywords SEMrush top 20':' | '.join(dict.fromkeys(r['Palabra clave'] for r in rs if r['Posición']<=20)),
      'Prioridad SEO':priority,'Decisión':action,'Title':record['title'],'H1':record['h1'],'Profundidad':record['depth'],
      'Enlaces entrantes':record['unique_inlinks'],'Google periodo':'09-ago–10-nov-2026','Bing periodo':'No consta en exportación de páginas',
      'Crecimiento por URL':'No evaluable sin serie temporal por URL',
      'Estado local antes':'Ruta ausente en fuente y configuración' if route in unresolved_routes else 'Indexable localmente'})
    matrix.append(row)
csvout('matriz-google-bing-semrush.csv',matrix)
csvout('normalizacion-urls.csv',normalizations)
gdays={date.fromisoformat(str(r['Fecha'])[:10]):r for r in gsc['Gráfico']}
bdays={datetime.strptime(r['Fecha'].split()[0],'%d/%m/%Y').date():{'Clics':int(r['Clics']),'Impresiones':int(r['Impresiones'])} for r in bing_daily}
def period(data,start,end):
    rows=[r for d,r in data.items() if start<=d<=end];c=sum(r['Clics'] for r in rows);i=sum(r['Impresiones'] for r in rows)
    return {'inicio':str(start),'fin':str(end),'dias':len(rows),'clics':c,'impresiones':i,'ctr_calculado':c/i if i else None}
end=min(max(gdays),max(bdays))
trend={name:{'ultimos28':period(data,end-timedelta(days=27),end),'anteriores28':period(data,end-timedelta(days=55),end-timedelta(days=28))} for name,data in [('Google',gdays),('Bing',bdays)]}
google_queries=[{**r,'URL':'No disponible: consultas agregadas de propiedad'} for r in gsc['Consultas']]
csvout('google-consultas-sin-url.csv',google_queries)
query_rows=[]
for provider,rows,key in [('Google',gsc['Consultas'],'Consultas principales'),('Bing',bing_queries,'Palabra clave')]:
    for r in rows:
        q=r[key];text=slug(q)
        group=next((label for label,pattern in [('IVA','iva'),('ISR','isr|subsidio'),('Aguinaldo','aguinaldo'),('Finiquito y liquidación','finiquito|liquidacion|renuncia'),('Vacaciones','vacaciones|vacacional'),('Salario y nómina','salario|sueldo|nomina|quincena|semanal'),('Propinas','propina'),('SPEI','spei|transferencia|rastreo|cep'),('Costos y precios','costo|precio|margen|ganancia'),('Matemáticas','regla-de-tres|regla-de-3|porcentaje'),('Créditos','credito|prestamo|hipotec'),('Ahorro','ahorro|interes-compuesto'),('IMSS y AFORE','imss|afore|pension')] if re.search(pattern,text)),'Otros')
        query_rows.append({'Motor':provider,'Consulta original':q,'Grupo léxico orientativo':group,'Impresiones':r['Impresiones'],'Clics':r['Clics'],'URL':'No aportada; no asociar por parecido ni por número de fila'})
csvout('consultas-ambos-motores-sin-url.csv',query_rows)
csvout('grupos-consultas.csv',[{'Motor':motor,'Grupo':grupo,'Consultas':len(rows),'Impresiones de consultas exportadas':sum(float(r['Impresiones']) for r in rows),'Clics de consultas exportadas':sum(float(r['Clics']) for r in rows)} for motor in ['Google','Bing'] for grupo in sorted({r['Grupo léxico orientativo'] for r in query_rows}) if (rows:=[r for r in query_rows if r['Motor']==motor and r['Grupo léxico orientativo']==grupo])])
diagnostics=[]
for r in matrix:
    groups=[]
    for motor in ['Google','Bing']:
        if r['Impresiones '+motor]=='NA':continue
        im=float(r['Impresiones '+motor]);cl=float(r['Clics '+motor]);pos=float(r['Posición media '+motor])
        if im>=500 and cl/im<.01:groups.append(motor+': ≥500 impresiones y CTR <1%; revisar posición antes del título')
        if 4<=pos<=10:groups.append(motor+': posición media 4–10')
        elif 10<pos<=20:groups.append(motor+': posición media >10–20')
        elif 20<pos<=50:groups.append(motor+': posición media >20–50')
        if cl==0:groups.append(motor+': cero clics en la exportación')
    diagnostics.append({'URL':r['URL'],'Grupos observables':' | '.join(groups),'Crecimiento por URL':'No evaluable','Prioridad':r['Prioridad SEO'],'Decisión':r['Decisión']})
csvout('diagnostico-todas-las-urls.csv',diagnostics)
stats={'fuentes':sources,'google_pestanas':gsc_meta,'google_filtros':gsc['Filtros'],'semrush_pestanas':sem_meta,
 'google_urls':len(google),'bing_urls':len(bing),'semrush_urls_reportadas':len(all_by_url),'semrush_registros':len(sem_rows),
 'semrush_keywords_distintas':len({r['Palabra clave'] for r in sem_rows}),'semrush_bandas':dict(bands),'semrush_tratamientos':dict(Counter(r['Tratamiento de intención'] for r in sem_rows)),'semrush_resumen_errores':summary_errors,
 'semrush_asignaciones_provisionales':len(unresolved),'solapamientos_keyword':sum(len(v)>1 for v in keywords.values()),
 'urls_con_impresiones_union':len(set(google)|set(bing)),'urls_interseccion_google_bing':len(set(google)&set(bing)),
 'urls_union_tres_fuentes':len(set(google)|set(bing)|set(by_url)),'urls_matriz':len(matrix),'rutas_historicas_ausentes':sorted(unresolved_routes),'prioridades':dict(Counter(r['Prioridad SEO'] for r in matrix)),
 'bing_filas_paginas':len(bing_pages),'bing_filas_consultas':len(bing_queries),'bing_diario_inicio':str(min(bdays)),'bing_diario_fin':str(max(bdays)),
 'bing_totales_por_ambito':{name:{'clics':sum(int(r['Clics']) for r in rows),'impresiones':sum(int(r['Impresiones']) for r in rows)} for name,rows in [('paginas',bing_pages),('consultas',bing_queries),('diario',bing_daily)]},
 'tendencia_solo_propiedad_periodos_alineados':trend,
 'limitaciones':['Las consultas y páginas de cada motor son agregaciones independientes, sin relación consulta–URL aportada.',
 'Los CSV de páginas y consultas Bing no indican periodo, filtro ni tipo de búsqueda. No comparar su CTR directamente con Google ni atribuirles los 90 días del CSV diario.',
 'Totales de páginas, consultas y diario pueden diferir por ámbito/filtros; se conservan, no se suman ni se fuerzan a coincidir.',
 '1369 registros SEMrush históricos no son 1369 keywords distintas; volumen/KD/tráfico son estimaciones.',
 'Fechas relativas SEMrush no tienen fecha base verificable; conservar texto original. FS no es variación de posición.',
 'La exportación Google previa tiene el mismo periodo agregado; sus diferencias no prueban crecimiento ni efecto de cambios aún no publicados.',
 'No hay serie por URL: crecimiento reciente por URL ni canibalización causal no pueden determinarse.',
 'La indexabilidad y arquitectura se auditan en archivos locales; no equivalen a indexación real en motores.']}
(OUT/'datos-verificados.json').write_text(json.dumps(stats,ensure_ascii=False,indent=2,default=str)+'\n')
print(json.dumps({k:v for k,v in stats.items() if k not in ['google_pestanas','semrush_pestanas','limitaciones','fuentes']},ensure_ascii=False,indent=2,default=str))

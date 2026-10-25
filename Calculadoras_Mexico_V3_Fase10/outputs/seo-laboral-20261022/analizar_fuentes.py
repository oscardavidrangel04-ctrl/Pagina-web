from pathlib import Path
import json,csv,zipfile,hashlib,io,re,collections,unicodedata
import openpyxl
ROOT=Path(__file__).resolve().parents[2]
OUT=Path(__file__).parent
D=Path('C:/Users/Casa/Downloads')
def norm(x):
    return re.sub(r'\s+',' ',''.join(c for c in unicodedata.normalize('NFD',str(x or '').lower()) if unicodedata.category(c) not in ('Mn','Cf'))).strip()
raw={'sources':[],'records':[],'gsc':{},'bing':{},'base':{},'semrush':[]}
def source(p,kind):
    s={'file':p.name,'path':str(p),'kind':kind,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
    raw['sources'].append(s);return s
for name,kind in [
('https___calculadora-isr-mexico.vercel.app_-Performance-on-Search-2026-10-22.xlsx','gsc'),
('keywords_base_semrush_mexico.xlsx','base')]:
    p=D/name;s=source(p,kind)
    wb=openpyxl.load_workbook(p,read_only=True,data_only=True)
    raw[kind]={sh.title:list(sh.values) for sh in wb}
    s['sheets']={k:len(v)-1 for k,v in raw[kind].items()};wb.close()
for name,kind in [('calculadora-isr-mexico.vercel._KeywordReport_23_10_2026.csv','queries'),('calculadora-isr-mexico.vercel._SearchPerformanceOverview_All_23_10_2026.csv','daily')]:
    p=D/name;s=source(p,'bing_'+kind); data=list(csv.DictReader(io.StringIO(p.read_text(encoding='utf-8-sig'))))
    raw['bing'][kind]=data;s['rows']=len(data);s['columns']=list(data[0]) if data else []
for p in sorted(D.glob('*2026-10-23*.zip')):
    if not (p.name.startswith('semrush-organic-positions-') or p.name=='magic-varias-keywords-2026-10-23T05-10-05-710Z.zip'):continue
    s=source(p,'semrush')
    with zipfile.ZipFile(p) as z:
        names=[n for n in z.namelist() if n.endswith('resultado.json')]
        if not names:
            magic_names=sorted(n for n in z.namelist() if n.endswith('-keyword-magic.csv'))
            if not magic_names:
                s['error']='No resultado.json ni CSV Magic';continue
            s['kind']='semrush_magic';s['reports']=[]
            raw.setdefault('magic',[])
            for member in magic_names:
                rows=list(csv.DictReader(io.StringIO(z.read(member).decode('utf-8-sig'))))
                number=int(Path(member).name.split('-')[0])
                meta_member=next((n for n in z.namelist() if n.endswith('/keyword-'+str(number)+'.json') or n=='keyword-'+str(number)+'.json'),None)
                meta=json.loads(z.read(meta_member)).get('meta',{}) if meta_member else {}
                raw['magic'].append({'source':p.name,'member':member,'meta':meta,'rows':rows})
                s['reports'].append({'member':member,'meta':meta,'rows':len(rows),'unique_keywords':len(set(norm(r.get('Palabra clave')) for r in rows))})
            continue
        parsed=json.loads(z.read(names[0]));raw['semrush'].append({'source':p.name,'data':parsed})
        reports=parsed.get('reports',[])
        s['reports']=[]
        for i,r in enumerate(reports):
            tab=r.get('table',{});rows=tab.get('rows',[])
            s['reports'].append({'index':i,'url':r.get('url'),'title':r.get('title'),'input':r.get('input'),'table_keys':list(tab),'headers':tab.get('headers'),'rows':len(rows),'unique_keywords':len(set(norm(row[0]) for row in rows if row)),'sample':rows[:2]})
(OUT/'fuentes-completas.json').write_text(json.dumps(raw,ensure_ascii=False,indent=2,default=str),encoding='utf-8')
print(json.dumps({'source_files':len(raw['sources']),'organic_reports':len(raw['semrush']),'magic_reports':len(raw.get('magic',[])),'magic_rows':sum(len(r['rows']) for r in raw.get('magic',[]))},ensure_ascii=False))

# Consolidated analytical outputs. Original rows above are retained unchanged.
import html, xml.etree.ElementTree as ET
from urllib.parse import urlparse, parse_qs
SITE='https://calculadora-isr-mexico.vercel.app'
YEAR=2026
def number(value):
    if isinstance(value,(int,float)): return value
    s=str(value or '').strip().replace('\u00a0','').replace(' ','').upper()
    if not s or s in ('N/D','N/A','—','-') or s.startswith('<'): return None
    factor=1000 if s.endswith('K') else 1000000 if s.endswith('M') else 1
    s=s.rstrip('KM%')
    if re.fullmatch(r'\d{1,3}(\.\d{3})+',s): s=s.replace('.','')
    elif ',' in s: s=s.replace('.','').replace(',','.')
    try: return float(s)*factor
    except ValueError: return None
records=[]; groups=[]
def add_group(group_id,kind,file,member,rows,extract,meta=None):
    rr=[]
    for idx,row in enumerate(rows,2):
        kw,metrics=extract(row)
        key=norm(kw)
        if not key: raise ValueError('Empty keyword: '+group_id+':'+str(idx))
        rec={'row_id':group_id+':'+str(idx),'group_id':group_id,'kind':kind,'file':file,'member':member,'source_row':idx,'keyword_original':kw,'keyword_normalized':key,'metrics':metrics,'original':row}
        records.append(rec);rr.append(rec)
    groups.append({'group_id':group_id,'kind':kind,'file':file,'member':member,'rows':len(rr),'unique_keywords':len({r['keyword_normalized'] for r in rr}),'repeated_keyword_rows':len(rr)-len({r['keyword_normalized'] for r in rr}),'exact_duplicate_rows':len(rr)-len({json.dumps(r['original'],ensure_ascii=False,sort_keys=True) for r in rr}),'meta':meta or {}})
gf=next(s['file'] for s in raw['sources'] if s['kind']=='gsc')
add_group('GSC','google_observado',gf,'Consultas',raw['gsc']['Consultas'][1:],lambda r:(r[0],dict(zip(['clicks','impressions','ctr','position'],r[1:5]))),{'period':'2026-07-28/2026-10-22','query_url_join':False})
bf=next(s['file'] for s in raw['sources'] if s['kind']=='bing_queries')
def bing_extract(r):
    d={norm(k):v for k,v in r.items()}
    return d['palabra clave'],{'clicks':number(d['clics']),'impressions':number(d['impresiones']),'ctr':number(d['ctr'])/100 if number(d['ctr']) is not None else None,'position':number(d['posicion media'])}
add_group('BING','bing_observado',bf,'CSV',raw['bing']['queries'],bing_extract)
basef=next(s['file'] for s in raw['sources'] if s['kind']=='base')
add_group('BASE','semilla_sin_metricas',basef,'Keywords base',raw['base']['Keywords base'][1:],lambda r:(r[1],{'seed_cluster':r[2],'export_status_original':r[3]}))
for si,s in enumerate(raw['semrush'],1):
    for ri,r in enumerate(s['data'].get('reports',[]),1):
        query=parse_qs(urlparse(r.get('url','')).query)
        target=query.get('q',[''])[0]
        kind='semrush_propio_estimado' if urlparse(target).hostname==urlparse(SITE).hostname else 'semrush_competidor_estimado'
        def organic_extract(row):
            return row[0],{'intent':row[1],'position':number(row[2]),'position_raw':row[2],'traffic_estimated':number(row[4]),'volume_estimated':number(row[6]),'volume_raw':row[6],'kd_estimated':number(row[7]),'ranking_url':row[8],'updated_raw':row[9]}
        add_group('ORG'+str(si).zfill(2)+'R'+str(ri),kind,s['source'],'reports/'+str(ri-1)+'/table',r.get('table',{}).get('rows',[]),organic_extract,{'target':target,'database':query.get('db',[''])[0],'date':query.get('date',[''])[0],'url':r.get('url'),'filter':query.get('filter',[]),'row_number_note':'source_row 2 means table.rows[0], with header treated as row 1'})
for i,r in enumerate(raw.get('magic',[]),1):
    def magic_extract(row):
        d={norm(k):v for k,v in row.items()}
        return d['palabra clave'],{'intent':d.get('intencion'),'volume_estimated':number(d.get('volumen')),'volume_raw':d.get('volumen'),'kd_estimated':number(d.get('kd %')),'cpc_usd_estimated':number(d.get('cpc (usd)')),'competition_estimated':number(d.get('comp.')),'updated_raw':d.get('actualizado')}
    add_group('MAGIC'+str(i).zfill(2),'semrush_magic_estimado',r['source'],r['member'],r['rows'],magic_extract,r['meta'])
raw['records']=records;raw['analysis_groups']=groups
(OUT/'fuentes-completas.json').write_text(json.dumps(raw,ensure_ascii=False,indent=2,default=str),encoding='utf-8')

# Inventory is rooted in actual files and sitemap URLs, including observed page metrics.
sitemap_urls=set(); sitemap_names=collections.defaultdict(list)
for p in ROOT.glob('sitemap*.xml'):
    for el in ET.parse(p).iter():
        if el.tag.endswith('}loc') and el.text and urlparse(el.text).hostname==urlparse(SITE).hostname:
            sitemap_urls.add(el.text);sitemap_names[el.text].append(p.name)
pages={r[0]:dict(zip(['google_clicks','google_impressions','google_ctr','google_position'],r[1:5])) for r in raw['gsc'].get('Páginas',[])[1:]}
files=[p for folder in ['articulos','calculadoras','temas'] for p in (ROOT/folder).glob('*.html')]+list(ROOT.glob('*.html'))
inventory=[]; urls={}
vercel=json.loads((ROOT/'vercel.json').read_text(encoding='utf-8'))
rewrites={r['source']:r['destination'] for r in vercel.get('rewrites',[]) if not any(x in r['source'] for x in ('*',':','('))}
def html_text(t): return html.unescape(re.sub('<[^>]+>',' ',t)).strip()
def tag(t,pattern):
    m=re.search(pattern,t,re.I|re.S);return html_text(m.group(1)) if m else ''
def robots_noindex(t):
    for mt in re.findall(r'<meta\b[^>]*>',t,re.I):
        attrs=dict((a.lower(),b) for a,q,b in re.findall(r'([\w-]+)\s*=\s*(["\'])(.*?)\2',mt))
        if attrs.get('name','').lower() in ('robots','googlebot') and 'noindex' in attrs.get('content','').lower():return True
    return False
for p in sorted(files):
    content=p.read_text(encoding='utf-8',errors='replace');rel=p.relative_to(ROOT).as_posix()
    url=SITE+('/' if rel=='index.html' else '/'+rel)
    served_rel=rewrites.get(urlparse(url).path,'/'+rel).lstrip('/')
    served_file=ROOT/served_rel
    if served_file.is_file():content=served_file.read_text(encoding='utf-8',errors='replace')
    canonical=tag(content,r'<link[^>]*rel=["\']canonical["\'][^>]*href=["\']([^"\']+)')
    if not canonical: canonical=tag(content,r'<link[^>]*href=["\']([^"\']+)["\'][^>]*rel=["\']canonical')
    item={'url':url,'file':rel,'served_file':served_rel,'rewrite_applied':served_rel!=rel,'title':tag(content,r'<title[^>]*>(.*?)</title>'),'h1':tag(content,r'<h1[^>]*>(.*?)</h1>'),'canonical':canonical,'in_sitemap':url in sitemap_urls,'sitemaps':sitemap_names[url],'noindex':robots_noindex(content),'exists':True,'served_file_exists':served_file.is_file(),**pages.get(url,{})}
    item['indexable_local']=item['in_sitemap'] and item['served_file_exists'] and not item['noindex'] and canonical in ('',url)
    item['eligible_recommendation']=item['indexable_local'] and rel.startswith(('calculadoras/','articulos/'))
    inventory.append(item);urls[url]=item
for url in sorted(sitemap_urls-set(urls)):
    item={'url':url,'file':urlparse(url).path.lstrip('/'),'title':'','h1':'','canonical':'','in_sitemap':True,'sitemaps':sitemap_names[url],'noindex':False,'exists':False,'eligible_recommendation':False,**pages.get(url,{})};inventory.append(item);urls[url]=item

CLUSTERS=['aguinaldo','finiquito','liquidacion','vacaciones','prima_vacacional','salario','sueldo_neto','sueldo_bruto','horas_extra','ptu']
def has(s,p): return bool(re.search(p,s))
def classify(k):
    # Specific benefits precede generic salary/vacation expressions.
    if has(k,r'salario rosa|salario emocional|salario de .*(futbol|messi|ronaldo)|aguinaldo.*(cancion|poema|navideno)|vacaciones.*(pelicula|cancion|escolar|sep|verano|invierno)|liquidacion de (sociedad|activos|inventario)|utilidades retenidas|\bpeso (neto|bruto)\b'):
        return 'fuera_alcance'
    if has(k,r'prima.?vacacion'): return 'prima_vacacional'
    if has(k,r'aguinald|articulo 87.*(lft|ley federal.*trabajo)'): return 'aguinaldo'
    if has(k,r'finiquit|si renuncio|si renuncie|por renuncia|renuncia voluntaria'): return 'finiquito'
    if has(k,r'liquidaci[oó]n|indemniza|despido|despidieron|despiden|prima de antiguedad|prima antiguedad'): return 'liquidacion'
    if has(k,r'\bptu\b|reparto.*utilidad|utilidades.*(trabaj|emplead|empresa)|pag[ao].*utilidades|utilidades.*pag[ao]|derecho.*utilidades'): return 'ptu'
    if has(k,r'horas? extra|trabajo extraordinario|tiempo extra'): return 'horas_extra'
    if has(k,r'vacacion|articulo (76|78|81).*ley federal.*trabajo|art(iculo)?\.? (76|78|81) lft'): return 'vacaciones'
    if has(k,r'(sueldo|salario|nomina|pago|bruto|ingreso|remuneracion).{0,22}net[oa]|net[oa].{0,22}(sueldo|salario|nomina|bruto)'): return 'sueldo_neto'
    if has(k,r'(sueldo|salario|nomina|ingreso|remuneracion).{0,22}brut[oa]|brut[oa].{0,22}(sueldo|salario|nomina)'): return 'sueldo_bruto'
    if has(k,r'salari|sueldo|nomina|quincen|pago semanal|\bsdi\b|\bsbc\b|factor de integracion|prima dominical|aumento salarial|remuneracion|\bsalary\b'): return 'salario'
    return 'fuera_alcance'
COUNTRIES={'espana':r'\bespana\b|irpf|pagas extras','colombia':r'\bcolombia\b|colombian','chile':r'\bchile\b|chilen','peru':r'\bperu\b|peruan','argentina':r'\bargentina\b|argentin','costa_rica':r'costa rica|costarric','ecuador':r'\becuador\b|ecuator','guatemala':r'\bguatemala\b|guatemalt','bolivia':r'\bbolivia\b|bolivian','uruguay':r'\buruguay\b|uruguay','paraguay':r'\bparaguay\b','republica_dominicana':r'republica dominicana','honduras':r'\bhonduras\b','el_salvador':r'\bel salvador\b','venezuela':r'venezuel','panama':r'\bpanama\b','nicaragua':r'nicaragua','estados_unidos':r'estados unidos|\busa\b'}
def intent(k):
    if has(k,r'carta|formato|recibo|plantilla|\bexcel\b|\bpdf\b'): return 'documento'
    if has(k,r'calculador|simulador|calculo|calcula|cuanto.*(toca|corresponde|paga|gano|es|queda|descuenta)|como (sacar|saber|se saca|obtener)|formula'): return 'calculo'
    if has(k,r'(finiquito.*liquidacion|liquidacion.*finiquito|neto.*bruto|bruto.*neto|diferencia|\bvs\b)'): return 'comparacion'
    if has(k,r'cuando|fecha|derecho|oblig|negar|renunci|despid|impuesto|\bisr\b|ley|articulo|exent|grav|limite|pension|jubil|incapac'): return 'regla_o_caso'
    if has(k,r'que es|que significa|definicion|concepto|que son|significado|a que se refiere|cual es|que quiere decir'): return 'definicion'
    return 'general'

# Explicit intent-to-existing-page rules. Unmatched specialized questions remain pending.
rules=[]
def rule(cluster,pattern,path): rules.append((cluster,pattern,SITE+'/'+path))
for c,p,path in [
('aguinaldo',r'pension.*issste|issste.*pension','aguinaldo-pensionados-issste'),('aguinaldo',r'pension.*imss|imss.*pension','aguinaldo-pensionados-imss'),('aguinaldo',r'viudez','pensionados-viudez-reciben-aguinaldo'),('aguinaldo',r'30 dias|doble aguinaldo','aguinaldo-30-dias-aprobado-vigencia'),('aguinaldo',r'\bisr\b|exent|impuesto|grav','aguinaldo-isr-2026'),('aguinaldo',r'trabajadora.*hogar|domestic','aguinaldo-trabajadoras-hogar'),('aguinaldo',r'3 meses|tres meses','aguinaldo-3-meses'),('aguinaldo',r'6 meses|seis meses','aguinaldo-6-meses'),('aguinaldo',r'renunci','aguinaldo-si-renuncio'),('aguinaldo',r'faltas','faltas-afectan-aguinaldo'),('aguinaldo',r'incapac','incapacidades-afectan-aguinaldo'),('aguinaldo',r'cuando.*derecho|derecho.*cuando','cuando-tengo-derecho-aguinaldo'),('aguinaldo',r'cuando.*(paga|deposita)|fecha','cuando-se-paga-aguinaldo'),('aguinaldo',r'recibo','recibo-de-aguinaldo'),('aguinaldo',r'con que salario|sueldo.*base','con-que-salario-se-calcula-aguinaldo'),('aguinaldo',r'cuantos dias|dias de aguinaldo','dias-de-aguinaldo'),('aguinaldo',r'por antiguedad|anos trabaj','aguinaldo-por-antiguedad'),('aguinaldo',r'como.*calcul|como.*sac|formula','como-calcular-aguinaldo'),('aguinaldo',r'que es|definicion|concepto','que-es-el-aguinaldo'),
('finiquito',r'liquidacion|diferencia','finiquito-vs-liquidacion'),('finiquito',r'carta poder','carta-poder-cobrar-finiquito'),('finiquito',r'carta','carta-finiquito-laboral'),('finiquito',r'formato|plantilla','formato-finiquito-laboral'),('finiquito',r'jubil.*issste','finiquito-jubilacion-issste'),('finiquito',r'jubil','finiquito-por-jubilacion'),('finiquito',r'invalidez temporal','finiquito-pension-invalidez-temporal'),('finiquito',r'incapacidad permanente parcial','finiquito-incapacidad-permanente-parcial'),('finiquito',r'firmar.*renuncia','firmar-renuncia-antes-de-finiquito'),('finiquito',r'un ano|1 ano','cuanto-finiquito-un-ano-renuncia'),('finiquito',r'renunci','finiquito-renuncia-voluntaria'),('finiquito',r'despido','finiquito-por-despido'),('finiquito',r'descont','me-pueden-descontar-finiquito'),('finiquito',r'no.*pag|niegan','no-me-quieren-pagar-finiquito'),('finiquito',r'cuando.*pag|cuanto.*tarda','cuando-pagan-finiquito'),('finiquito',r'cuando.*derecho','cuando-tengo-derecho-finiquito'),('finiquito',r'que incluye|conceptos','que-incluye-finiquito'),('finiquito',r'con que salario|salario.*base','con-que-salario-se-calcula-finiquito'),('finiquito',r'ejemplo','ejemplo-calculo-finiquito'),('finiquito',r'que es|definicion|concepto','que-es-el-finiquito'),
('liquidacion',r'demanda','demanda-despido-injustificado'),('liquidacion',r'cierre.*empresa','liquidacion-por-cierre-de-empresa'),('liquidacion',r'prima.*antiguedad','prima-antiguedad-cuando-aplica'),('liquidacion',r'indemnizacion constitucional','que-es-indemnizacion-constitucional'),('liquidacion',r'despido justificado','despido-justificado-cuanto-me-toca'),('liquidacion',r'cuanto.*despido injustificado','cuanto-toca-despido-injustificado'),('liquidacion',r'que es.*despido','que-es-despido-injustificado'),
('vacaciones',r'proporcional','../calculadoras/vacaciones-proporcionales'),('vacaciones',r'negar|niegan','me-pueden-negar-vacaciones'),('vacaciones',r'cuando.*pag','cuando-se-pagan-vacaciones'),('vacaciones',r'cuentan|sabados|domingos|dias naturales','como-se-cuentan-dias-vacaciones'),('vacaciones',r'dias.*antiguedad|tabla|cuantos dias|dias por ano','dias-vacaciones-por-antiguedad-2026'),('vacaciones',r'como.*calcul|como.*pag|pago de vacaciones','como-calcular-pago-vacaciones'),
('prima_vacacional',r'\bisr\b|impuesto|exent|grav','isr-prima-vacacional'),('prima_vacacional',r'como.*calcul|como.*sac|formula|ejemplo','como-calcular-prima-vacacional'),
('salario',r'factor.*integracion','factor-integracion-sdi'),('salario',r'bonos.*cotizacion','bonos-salario-base-cotizacion'),('salario',r'base.*cotizacion|\bsbc\b','que-es-salario-base-cotizacion'),('salario',r'como.*(diario integrado|sdi)','como-calcular-salario-diario-integrado'),('salario',r'que es.*(diario integrado|sdi)','que-es-salario-diario-integrado'),('salario',r'minimo.*frontera','salario-minimo-frontera-norte-2026'),('salario',r'minimo.*(diario|mensual)','salario-minimo-diario-mensual-2026'),('salario',r'minimo','salario-minimo-2026'),('salario',r'recibo.*nomina','leer-recibo-nomina'),
('sueldo_neto',r'bruto|diferencia|que es|que significa','salario-bruto-neto'),('sueldo_neto',r'descuentos.*nomina|imss','descuentos-nomina-isr-imss'),('sueldo_bruto',r'neto|diferencia|que es|que significa','salario-bruto-neto'),
('horas_extra',r'oblig','me-pueden-obligar-horas-extra'),('horas_extra',r'dobles|triples','horas-extra-dobles-triples'),('horas_extra',r'cuantas|limite|seman','cuantas-horas-extra-semana'),('horas_extra',r'ley|derecho|articulo','horas-extra-2026'),
('ptu',r'\bisr\b|exent|grav|impuesto','ptu-exenta-isr'),('ptu',r'tres meses|3 meses|limite|tope','limite-ptu-tres-meses'),('ptu',r'renunci','derecho-ptu-si-renuncio'),('ptu',r'no.*derecho|sin derecho','trabajadores-sin-derecho-reparto-utilidades'),('ptu',r'cuando|fecha','cuando-se-pagan-utilidades'),('ptu',r'oblig','es-obligatorio-reparto-utilidades'),('ptu',r'como.*calcul|formula|ejemplo','como-calcular-ptu'),('ptu',r'que es|que significa|definicion','que-es-ptu')]:
    if path.startswith('../'): route=path[3:]+'.html'
    else: route='articulos/'+path+'.html'
    rule(c,p,route)
calc={'aguinaldo':'aguinaldo','finiquito':'finiquito','liquidacion':'liquidacion','vacaciones':'vacaciones','prima_vacacional':'prima-vacacional','salario':'salario-diario','sueldo_neto':'salario-neto','sueldo_bruto':'salario-bruto','horas_extra':'horas-extra','ptu':'ptu'}
# Verified in the served content: salary basis, annual seniority and unpaid termination benefits.
rules[0:0]=[
    ('aguinaldo',r'(sueldo|salario).*(bruto|neto)|bruto o neto',SITE+'/articulos/con-que-salario-se-calcula-aguinaldo.html'),
    ('aguinaldo',r'aumenta.*(ano|antiguedad)|aumenta el aguinaldo|aguinaldo aumenta|con la antiguedad',SITE+'/articulos/aguinaldo-por-antiguedad.html'),
    ('aguinaldo',r'^aguinaldo neto$',SITE+'/calculadoras/aguinaldo.html'),
    ('finiquito',r'reclam|no cobrado',SITE+'/articulos/no-me-quieren-pagar-finiquito.html'),
    ('vacaciones',r'aumenta.*dias|aumentando.*dias',SITE+'/articulos/dias-vacaciones-por-antiguedad-2026.html'),
]
def recommend(k,c,intention,status):
    if status!='en_alcance': return '',status,'Excluida del mapeo activo por alcance, país o año.'
    if c=='fuera_alcance': return '','fuera_alcance','Sin encaje en los diez clústeres laborales.'
    # Broad homonyms and divergent task types must not inherit a calculator.
    if has(k,r'ofertas|mercancia|mercancias|liquidacion de (sociedad|empresa|activos)|salario emocional|salario rosa|(salario|sueldo) de (un|una|los|las|messi|ronaldo)\b|vacaciones (escolar|sep|verano|invierno)|pascua|semana santa|pelicula|cancion|poema|\bmovie\b|\bpeliculas\b|\bdibujo|\bimagenes\b|\bfrases\b'):
        return '','revision_pendiente','Tema o tipo de respuesta distinto de la calculadora laboral general.'
    if has(k,r'\bexcel\b|\bpdf\b'):
        return '','revision_pendiente','La intención pide un formato descargable; confirmar que la página lo ofrece.'
    if has(k,r'\beuros?\b|\bdolares\b|cesantias|\bafp\b|\bcts\b|\bsac\b'):
        return '','revision_pendiente','Señal monetaria o de otro régimen laboral; confirmar país antes de asignar.'
    if c=='finiquito' and has(k,r'(tiempo|plazo|dias|prescri).*reclam|reclam.*(tiempo|plazo|prescri)'):
        return '','revision_pendiente','La guía de reclamación existente no desarrolla el plazo legal específico.'
    if c in ('sueldo_neto','sueldo_bruto'):
        if intention=='definicion' or has(k,r'antes o despues|como se calcula|como calcular|significado|definicion'):
            url=SITE+'/articulos/salario-bruto-neto.html'
            if urls.get(url,{}).get('eligible_recommendation'):return url,'propuesta_por_intencion','Guía existente explica conceptos y conversión con deducciones conocidas.'
        if intention=='calculo':
            url=SITE+'/calculadoras/'+calc[c]+'.html'
            if urls.get(url,{}).get('eligible_recommendation'):return url,'propuesta_por_intencion','Herramienta existente con deducciones manuales; no inferir estimación automática de nómina.'
    for cl,pattern,url in rules:
        if cl==c and has(k,pattern) and urls.get(url,{}).get('eligible_recommendation'):
            return url,'propuesta_por_intencion','Regla editorial específica; validar equivalencia completa antes de implementar.'
    if c=='salario':
        variants=[(r'diario integrado|\bsdi\b','salario-diario-integrado'),(r'por hora|salario hora|sueldo hora','salario-hora'),(r'quincenal|quincena','pago-quincenal'),(r'diario|mensual a diario','salario-diario')]
        for p,s in variants:
            if has(k,p) and intention in ('calculo','general'):
                url=SITE+'/calculadoras/'+s+'.html'
                if urls.get(url,{}).get('eligible_recommendation'):return url,'propuesta_por_intencion','Conversión salarial identificada por unidad.'
        return '','revision_pendiente','Salario es un tema amplio; falta seleccionar una intención concreta.'
    if intention=='calculo' or k in ('aguinaldo','finiquito','liquidacion','vacaciones','prima vacacional','sueldo neto','salario neto','sueldo bruto','salario bruto','horas extra','horas extras','ptu'):
        special=('aguinaldo-proporcional' if c=='aguinaldo' and 'proporcional' in k else calc[c])
        url=SITE+'/calculadoras/'+special+'.html'
        if urls.get(url,{}).get('eligible_recommendation'): return url,'propuesta_por_intencion','Herramienta existente compatible con cálculo principal; revisar modificadores específicos.'
    return '','revision_pendiente','No hay coincidencia editorial específica suficiente; revisar contenido y demanda.'

by=collections.defaultdict(list)
for r in records:by[r['keyword_normalized']].append(r)
master=[]
for k,rr in sorted(by.items()):
    cluster=classify(k);countries=[c for c,p in COUNTRIES.items() if has(k,p)];years=sorted(set(int(x) for x in re.findall(r'\b(?:19|20)\d{2}\b',k)))
    temporal='anio_antiguo' if years and max(years)<YEAR else 'anio_futuro' if any(y>YEAR for y in years) else 'actual_o_sin_anio'
    status='fuera_alcance' if cluster=='fuera_alcance' else 'otro_pais' if countries else 'anio_antiguo' if temporal=='anio_antiguo' else 'anio_futuro_revision' if temporal=='anio_futuro' else 'en_alcance'
    it=intent(k);url,mapstatus,reason=recommend(k,cluster,it,status)
    obs={kind:[{'row_id':r['row_id'],**r['metrics']} for r in rr if r['kind']==kind] for kind in ('google_observado','bing_observado')}
    estimates=[{'row_id':r['row_id'],'kind':r['kind'],**r['metrics']} for r in rr if r['kind'].startswith('semrush_')]
    volumes=sorted({r['metrics']['volume_estimated'] for r in rr if r['metrics'].get('volume_estimated') is not None})
    kds=sorted({r['metrics']['kd_estimated'] for r in rr if r['metrics'].get('kd_estimated') is not None})
    own=[r['metrics']['position'] for r in rr if r['kind']=='semrush_propio_estimado' and r['metrics'].get('position') is not None and r['metrics']['position']>0]
    comp=[r['metrics']['position'] for r in rr if r['kind']=='semrush_competidor_estimado' and r['metrics'].get('position') is not None and r['metrics']['position']>0]
    google=obs['google_observado'];bing=obs['bing_observado']
    if status!='en_alcance': priority='excluir_o_revisar'
    elif google or bing: priority='1_observada_en_buscador'
    elif own and min(own)<=20:priority='2_posicion_estimada_1_20'
    elif comp and not own:priority='3_brecha_en_exportaciones'
    else:priority='4_demanda_estimada_o_revision'
    item={'keyword_normalizada':k,'variantes_originales':sorted({r['keyword_original'] for r in rr}),'cluster':cluster,'intencion':it,'estado_alcance':status,'paises_explicitos':countries,'pais_inferido':'Mexico' if has(k,r'\bmexico\b|\bmexican') else 'sin_indicar','anios':years,'estado_temporal':temporal,'prioridad':priority,'url_propuesta':url,'estado_mapeo':mapstatus,'motivo_mapeo':reason,'gsc_query_url_observado':False,'fuentes':sorted({r['kind'] for r in rr}),'origen_row_ids':[r['row_id'] for r in rr],'filas_origen':len(rr),'google_observado':google,'bing_observado':bing,'semrush_estimado':estimates,'volumen_estimado_valores':volumes,'volumen_estimado_max_referencia':max(volumes) if volumes else None,'volumen_estimado_conflicto':len(volumes)>1,'kd_estimado_min':min(kds) if kds else None,'kd_estimado_max':max(kds) if kds else None,'semrush_propio_mejor_posicion':min(own) if own else None,'semrush_competidor_mejor_posicion':min(comp) if comp else None,'brecha_exportaciones':bool(comp and not any(r['kind']=='semrush_propio_estimado' for r in rr))}
    for label,vals in [('google',google),('bing',bing)]:
        if vals:
            clicks=sum(v['clicks'] for v in vals);impressions=sum(v['impressions'] for v in vals)
            item[label+'_clicks_observado']=clicks;item[label+'_impressions_observado']=impressions
            item[label+'_ctr_observado']=clicks/impressions if impressions else None
            item[label+'_position_observado']=sum(v['position']*v['impressions'] for v in vals)/impressions if impressions and all(v.get('position') is not None for v in vals) else None
        else:
            for metric in ['clicks','impressions','ctr','position']:item[label+'_'+metric+'_observado']=None
    master.append(item)
(OUT/'keywords-maestro.json').write_text(json.dumps(master,ensure_ascii=False,indent=2),encoding='utf-8')
(OUT/'matriz-inventario-urls.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2),encoding='utf-8')
def csv_write(name,items,fields):
    with (OUT/name).open('w',encoding='utf-8-sig',newline='') as f:
        w=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore');w.writeheader()
        for r in items:w.writerow({k:json.dumps(v,ensure_ascii=False) if isinstance(v,(list,dict)) else v for k,v in r.items() if k in fields})
fields=['keyword_normalizada','cluster','intencion','estado_alcance','paises_explicitos','anios','prioridad','url_propuesta','estado_mapeo','motivo_mapeo','gsc_query_url_observado','google_clicks_observado','google_impressions_observado','google_ctr_observado','google_position_observado','bing_clicks_observado','bing_impressions_observado','bing_ctr_observado','bing_position_observado','volumen_estimado_max_referencia','volumen_estimado_valores','volumen_estimado_conflicto','kd_estimado_min','kd_estimado_max','semrush_propio_mejor_posicion','semrush_competidor_mejor_posicion','brecha_exportaciones','fuentes','filas_origen','origen_row_ids','variantes_originales']
csv_write('keywords-maestro.csv',master,fields)
csv_write('matriz-inventario-urls.csv',inventory,['url','file','served_file','rewrite_applied','title','h1','canonical','in_sitemap','sitemaps','noindex','exists','served_file_exists','indexable_local','eligible_recommendation','google_clicks','google_impressions','google_ctr','google_position'])
csv_write('keywords-fuentes-conteos.csv',groups,['group_id','kind','file','member','rows','unique_keywords','repeated_keyword_rows','exact_duplicate_rows','meta'])
def bucket(p):
    if p is None or p<=0:return 'sin_posicion_numerica'
    return '1-3' if p<=3 else '4-10' if p<=10 else '11-20' if p<=20 else '21-50' if p<=50 else '51-100' if p<=100 else '>100'
own_rows=[r for r in records if r['kind']=='semrush_propio_estimado']
own_keys={r['keyword_normalized'] for r in own_rows}
dist_rows=collections.Counter(bucket(r['metrics'].get('position')) for r in own_rows)
dist_unique=collections.Counter(bucket(next(m['semrush_propio_mejor_posicion'] for m in master if m['keyword_normalizada']==k)) for k in own_keys)
counts={'source_files':len(raw['sources']),'keyword_rows_total':len(records),'unique_keywords_total':len(master),'repeated_keyword_rows_total':len(records)-len(master),'within_group_exact_duplicate_rows':sum(g['exact_duplicate_rows'] for g in groups),'keyword_groups':groups,'source_kind_rows':dict(collections.Counter(r['kind'] for r in records)),'source_kind_unique_keywords':{kind:len({r['keyword_normalized'] for r in records if r['kind']==kind}) for kind in {r['kind'] for r in records}},'clusters':dict(collections.Counter(m['cluster'] for m in master)),'alcance':dict(collections.Counter(m['estado_alcance'] for m in master)),'mapeo':dict(collections.Counter(m['estado_mapeo'] for m in master)),'prioridad':dict(collections.Counter(m['prioridad'] for m in master)),'own_position_rows':dict(dist_rows),'own_position_unique_best':dict(dist_unique),'inventory_files':len(files),'inventory_urls':len(inventory),'sitemap_unique_urls':len(sitemap_urls),'eligible_urls':sum(i['eligible_recommendation'] for i in inventory),'volume_conflicts':sum(m['volumen_estimado_conflicto'] for m in master),'query_url_join_available':False}
counts['indexable_local_urls']=sum(i.get('indexable_local',False) for i in inventory)
counts['sitemap_navigation_and_hub_urls']=sum(i.get('indexable_local',False) and not i['eligible_recommendation'] for i in inventory)
counts['rewrites_checked']=sum(i.get('rewrite_applied',False) for i in inventory)
counts['auxiliary_rows']={'bing_daily':len(raw['bing']['daily']),'gsc_sheets':{k:len(v)-1 for k,v in raw['gsc'].items()}}
counts['brecha_exportaciones_en_alcance']=sum(m['estado_alcance']=='en_alcance' and m['brecha_exportaciones'] for m in master)
(OUT/'keywords-conteos.json').write_text(json.dumps(counts,ensure_ascii=False,indent=2),encoding='utf-8')
gap=sorted((m for m in master if m['estado_alcance']=='en_alcance' and m['brecha_exportaciones']),key=lambda m:-(m['volumen_estimado_max_referencia'] or 0))
observed=sorted((m for m in master if m['estado_alcance']=='en_alcance' and (m['google_observado'] or m['bing_observado'])),key=lambda m:-(m['google_impressions_observado'] or 0))
csv_write('keywords-brechas-priorizadas.csv',gap,fields)
lines=['# Maestro de keywords laborales y conciliación de fuentes','',f'Análisis: 24 de octubre de 2026. Total: **{len(records):,} filas de keywords**, **{len(master):,} keywords normalizadas únicas**. Se conservaron todas las filas y referencias de origen.','',
'## Alcance y lectura','',
'Las métricas de Google y Bing son observaciones de sus exportaciones. Las posiciones, volumen, dificultad, CPC y tráfico de Semrush son estimaciones y se mantienen separados. No se suman volúmenes entre fuentes, keywords, clústeres ni variantes. El máximo por keyword es solo una referencia para ordenar, acompañado por todos los valores y una bandera de conflicto. Una posición vacía no equivale a cero ni demuestra ausencia del ranking. Cuando acentos o mayúsculas unifican varias consultas del mismo buscador, se suman solo sus clics e impresiones, el CTR se recalcula como clics/impresiones y la posición es la media ponderada por impresiones. El JSON mantiene cada observación original.','',
'El GSC suministrado cubre 2026-07-28 a 2026-10-22 y trae 1,000 consultas y 173 páginas por separado. No contiene una dimensión conjunta consulta–URL. Toda URL en el maestro es una propuesta editorial por intención, nunca una URL observada para la consulta. Las métricas de página quedan en el inventario. Bing conserva el período de la exportación original, sin inferirlo del nombre del archivo.','',
'También se conservan, sin convertirlos en keywords, los 77 días de Bing y las hojas GSC de gráfico (13 filas), países (115), dispositivos (3), apariciones de búsqueda (0) y filtros (2). Las 1,000 consultas GSC suman 9 clics y 6,311 impresiones; los 485 registros Bing suman 163 clics y 921 impresiones. Esos totales se conservan después de normalizar. Los totales de consultas no deben sustituir los totales generales de GSC, porque la exportación de consultas está limitada.','',
'## Conteos por conjunto','',
'| Conjunto | Filas | Keywords únicas | Filas repetidas por keyword | Duplicados exactos de fila |','|---|---:|---:|---:|---:|']
for g in groups:lines.append(f"| {g['group_id']} · {g['kind']} | {g['rows']} | {g['unique_keywords']} | {g['repeated_keyword_rows']} | {g['exact_duplicate_rows']} |")
lines+=['',f"Repeticiones globales por keyword: **{len(records)-len(master):,}**. Duplicados exactos dentro de cada conjunto: **{counts['within_group_exact_duplicate_rows']:,}**. Son medidas distintas: una keyword repetida puede tener una posición o URL distinta. Las 44 semillas se conservan como entradas sin métricas, no como exportaciones Magic completadas.",'',
'El ZIP de Magic incluye exactamente diez CSV `*-keyword-magic.csv` con 6,744 filas. Se leyeron esos diez conjuntos y sus `keyword-N.json`; los CSV y JSON consolidados del mismo ZIP no se volvieron a añadir porque repetirían los registros. Sus metadatos indican base México, escritorio, concordancia amplia y KD 0–50. Los conteos de tarjetas de Semrush no sustituyen el número realmente exportado.','',
'## Clasificación','', '| Clúster | Keywords únicas |','|---|---:|']
for c in CLUSTERS+['fuera_alcance']:lines.append(f"| {c} | {counts['clusters'].get(c,0)} |")
lines+=['','| Estado | Keywords únicas |','|---|---:|']
for k,n in sorted(counts['alcance'].items()):lines.append(f'| {k} | {n} |')
lines+=['','Las reglas automáticas normalizan mayúsculas, acentos, espacios y caracteres invisibles. No fusionan singular/plural, sinónimos ni errores ortográficos. Los países se detectan por señales explícitas; una base Semrush México no hace mexicana a toda consulta. Las consultas sin país quedan sin país indicado. Años anteriores a 2026 se conservan y apartan del mapeo activo; 2027 y posteriores requieren revisión.','',
'## Posiciones estimadas del dominio propio','',f"El reporte propio tiene **{len(own_rows)} filas** y **{len(own_keys)} keywords únicas**. La columna única usa la mejor posición numérica de cada keyword y no suma apariciones.",'', '| Posición | Filas | Keywords únicas, mejor posición |','|---|---:|---:|']
for b in ['1-3','4-10','11-20','21-50','51-100','>100','sin_posicion_numerica']:lines.append(f'| {b} | {dist_rows[b]} | {dist_unique[b]} |')
lines+=['','## Inventario y mapa de URLs','',f"Inventario: {len(files)} HTML locales, {len(sitemap_urls)} URLs únicas en los sitemaps y {counts['indexable_local_urls']} URLs indexables en la revisión local. De ellas, {counts['eligible_urls']} son artículos/calculadoras elegibles para el mapa y {counts['sitemap_navigation_and_hub_urls']} son páginas raíz o hubs. Esta diferencia de alcance explica 359 frente a 379; no son páginas faltantes. Se resolvieron {counts['rewrites_checked']} rewrites exactos de Vercel y se leyó título, H1, canonical y robots del archivo servido. La columna served_file conserva esa evidencia. Cada recomendación apunta a una URL verificada en ese inventario. No se crearon rutas nuevas. La indexabilidad local no confirma el estado HTTP ni la indexación en producción.",'',
'El mapeo combina clúster, intención y reglas específicas para temas como renuncia, impuestos, fechas, tablas y conversiones salariales. Las consultas amplias o que piden Excel/PDF quedan pendientes cuando no se puede asegurar equivalencia. La asignación sigue siendo una propuesta y requiere revisar el contenido completo para modificadores y casos particulares.','',
'| Estado del mapa | Keywords |','|---|---:|']
for k,n in sorted(counts['mapeo'].items()):lines.append(f'| {k} | {n} |')
lines+=['','## Prioridades observadas','', 'Primero revisar consultas con exposición real. Las impresiones de Google y Bing no se combinan porque son poblaciones distintas.','', '| Keyword | Google impresiones | Bing impresiones | Propuesta de URL |','|---|---:|---:|---|']
for m in observed[:30]:lines.append(f"| {m['keyword_normalizada']} | {m['google_impressions_observado'] if m['google_impressions_observado'] is not None else ''} | {m['bing_impressions_observado'] if m['bing_impressions_observado'] is not None else ''} | {m['url_propuesta'] or 'Revisión pendiente'} |")
lines+=['','## Brechas presentes en las exportaciones','',f"Hay {len(gap)} keywords en alcance con posición numérica en al menos un competidor y sin fila en el reporte propio. Esto demuestra una diferencia entre los archivos suministrados; no demuestra que el dominio nunca posicione para ellas. Se priorizan por el máximo de volumen estimado, sin suma de volumen.",'', '| Keyword | Volumen estimado de referencia | Mejor posición competidor | Propuesta de URL |','|---|---:|---:|---|']
for m in gap[:35]:lines.append(f"| {m['keyword_normalizada']} | {m['volumen_estimado_max_referencia']} | {m['semrush_competidor_mejor_posicion']} | {m['url_propuesta'] or 'Revisión pendiente'} |")
lines+=['','## Revisión de clasificación y asignación editorial','',
'Se revisó una muestra de términos de alta demanda fuera de alcance y de propuestas pendientes. Se recuperaron variantes como «cuando se pagan las utilidades 2026» (PTU), «cuanto me toca si renuncio» (finiquito), «me despidieron» (liquidación), «tiempo extra» (horas extra), «artículo 76 de la Ley Federal del Trabajo» (vacaciones) y remuneración/bruto/neto (salario). Se apartaron homónimos como salario rosa, salario emocional, vacaciones escolares y liquidación de activos. Las variantes ambiguas permanecen pendientes. Esta es una clasificación por reglas con revisión de muestra, no una revisión manual de las 9,875 consultas.','',
'El contenido servido de «con qué salario se calcula aguinaldo» permite proponer esa URL para bruto/neto. «Aguinaldo por antigüedad» cubre si aumenta cada año. «No me quieren pagar finiquito» cubre documentos y orientación para reclamar, por lo que se asigna a reclamación general. Las preguntas sobre cuánto tiempo hay para reclamar quedan pendientes porque esa guía no desarrolla un plazo legal específico. Todos estos vínculos son asignaciones editoriales.','',
'## Validación','',f"Se concilian {sum(g['rows'] for g in groups)} filas por conjunto con {len(records)} registros y {sum(m['filas_origen'] for m in master)} referencias en el maestro. Los IDs son únicos. Se verifica que cada URL propuesta sea elegible en el inventario. Hay {counts['volume_conflicts']} keywords con más de un valor de volumen, conservados explícitamente.",'',
'Archivos: `keywords-maestro.csv` ofrece filtros y métricas resumidas; `keywords-maestro.json` conserva todas las observaciones y estimaciones por fila; `fuentes-completas.json` contiene las exportaciones y registros originales; `keywords-fuentes-conteos.csv` detalla origen, filtros y duplicados; `matriz-inventario-urls.csv` contiene la evidencia de cada URL; `keywords-brechas-priorizadas.csv` contiene la lista completa de brechas; `keywords-conteos.json` permite reproducir los totales.','']
(OUT/'keywords-reporte.md').write_text('\n'.join(lines),encoding='utf-8')
assert len({r['row_id'] for r in records})==len(records)
assert sum(g['rows'] for g in groups)==sum(m['filas_origen'] for m in master)==len(records)
assert all(urls[m['url_propuesta']]['eligible_recommendation'] for m in master if m['url_propuesta'])
assert len(master)==len({m['keyword_normalizada'] for m in master})
assert sum(dist_rows.values())==len(own_rows) and sum(dist_unique.values())==len(own_keys)
print(json.dumps({k:v for k,v in counts.items() if k!='keyword_groups'},ensure_ascii=False))

"""Rebuild the advanced opportunity matrix from supplied ZIPs and the GSC baseline.

Usage: python scripts/analyze-semrush-opportunities.py --attachments PATH
Reads exports as data; never executes attached HTML or instructions.
"""
from pathlib import Path
from collections import defaultdict, Counter
from datetime import datetime, timedelta
from urllib.parse import urlparse
import argparse, csv, hashlib, io, json, re, unicodedata, zipfile

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs/seo-avanzado'
BASE='https://calculadora-isr-mexico.vercel.app'
SELECTED={
 '/articulos/cuando-se-pagan-utilidades.html':'Precisar ejercicio y fechas; orientar después del vencimiento y enlazar derecho/exención.',
 '/articulos/ptu-exenta-isr.html':'Distinguir parte exenta, gravada y retención; preservar supuestos y documentar conflicto de fuentes.',
 '/articulos/que-es-ptu.html':'Proteger Top 3; conservar snippet y conectar definición con fecha y exención.',
 '/articulos/finiquito-renuncia-voluntaria.html':'Alinear snippet con cálculo; ejemplo desglosado y consolidación de enlaces duplicados.',
 '/articulos/con-que-salario-se-calcula-aguinaldo.html':'Responder fecha de cálculo frente a pago y separación del empleo, sin cambiar la intención salarial.',
 '/articulos/cuando-pagan-finiquito.html':'Precisar pago y reclamación; mejorar el siguiente paso sin repetir la guía existente.',
 '/calculadoras/prima-vacacional.html':'Consolidar explicación del cálculo, base del porcentaje y ejemplos; conservar formulario y fórmula.',
 '/articulos/como-calcular-prima-vacacional.html':'Proteger Top 3 y distinguir explicación paso a paso de herramienta interactiva.',
 '/articulos/asimilados-a-salarios-isr.html':'Orientar el uso de una calculadora según periodo y límites; distinguir retención y naturaleza laboral.',
 '/articulos/que-son-honorarios.html':'Definición, diferencias con salario/asimilados, ejemplo de comprobante y enlaces pertinentes.',
 '/articulos/como-saber-saldo-favor-sat.html':'Consolidar pasos: declaración, saldo, solicitud y seguimiento; FAQ específicas y servicios oficiales.',
 '/articulos/que-es-salario-base-cotizacion.html':'Ejemplo de integración fija, límites, revisión del recibo y distinción SBC/SDI/neto.'}
# A URL being edited does not make every query on it a target of this block.
DEFERRED_TARGET_PAIRS={
 ('/articulos/con-que-salario-se-calcula-aguinaldo.html','calculadora de isr aguinaldo'):'Conservar derivación existente a calculadora; esta intervención trata la fecha y base salarial.',
 ('/articulos/con-que-salario-se-calcula-aguinaldo.html','que porcentaje de aguinaldo me corresponde'):'No ampliar esta intención en la guía de base salarial; evaluar consulta/URL posteriormente.',
 ('/articulos/finiquito-renuncia-voluntaria.html','si tengo 15 anos trabajando y renuncio cuanto me corresponde'):'Requiere revisión específica de prima de antigüedad; el ejemplo nuevo no determina ese derecho.',
 ('/articulos/que-es-ptu.html','parte exenta de ptu'):'Mantener la guía general protegida; la respuesta de exención se trabaja en ptu-exenta-isr.'}

def norm(value):
 return ' '.join(''.join(c for c in unicodedata.normalize('NFD',value.lower()) if unicodedata.category(c)!='Mn').split())
def number(value):
 s=str(value or '').strip().replace(',','.');scale=1000 if s.endswith('K') else 1000000 if s.endswith('M') else 1
 try:return float(s.rstrip('KM'))*scale
 except ValueError:return None
def url(value):
 p=urlparse(value if value.startswith('http') else 'https://'+value)
 return 'https://'+p.netloc+('/' if p.path in ('','/index.html') else p.path)
def date(row):
 stamp=datetime.fromisoformat(row['_snapshot'].replace('Z','+00:00'));text=row['Act.']
 m=re.match(r'(\d+) (día|hora)',text)
 if m:return stamp-timedelta(**({'days':int(m[1])} if m[2]=='día' else {'hours':int(m[1])}))
 m=re.match(r'(\d+) (ago|sept|oct|nov)',text)
 if m:return stamp.replace(month={'ago':8,'sept':9,'oct':10,'nov':11}[m[2]],day=int(m[1]),hour=0,minute=0,second=0)
 raise ValueError('Unknown observation date: '+text)
def write_csv(name,rows):
 with (OUT/name).open('w',encoding='utf-8-sig',newline='') as f:
  w=csv.DictWriter(f,fieldnames=list(rows[0]),lineterminator='\n');w.writeheader();w.writerows(rows)
def main():
 parser=argparse.ArgumentParser();parser.add_argument('--attachments',type=Path,required=True);args=parser.parse_args()
 own=[];peers=[];sources=[]
 for p in sorted(args.attachments.rglob('*.zip')):
  with zipfile.ZipFile(p) as z:
   data=json.loads(z.read('./resultado.json'))
   source={'file':p.name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
   if 'reports' not in data:
    source['rows']=sum(len(t['rows']) for t in data.get('tables',[]));source['note']='Keyword Magic; not an organic positions report';sources.append(source);continue
   report=data['reports'][0];stamp=data.get('extractedAt',data.get('meta',{}).get('extractedAt'))
   rows=list(csv.DictReader(io.StringIO(z.read('./organic-positions-01.csv').decode('utf-8-sig'))))
   source.update(rows=len(rows),snapshot=stamp,title=report['title']);sources.append(source)
   target=own if 'calculadora-isr-mexico' in report['title'] else peers
   target.extend(dict(r,_file=p.name,_snapshot=stamp) for r in rows)
 assert len(own)==1136,'Supplied baseline changed: review before comparing'
 groups=defaultdict(list)
 for r in own:groups[norm(r['Palabra clave']),url(r['URL'])].append(r)
 observations=[max(rs,key=lambda r:(date(r),-(number(r['Posición']) or 1000))) for rs in groups.values()]
 urls_by_keyword=defaultdict(set)
 for r in observations:urls_by_keyword[norm(r['Palabra clave'])].add(url(r['URL']))
 rival=defaultdict(list)
 for r in peers:
  if number(r['Posición']) is not None and number(r['Posición'])<=3:rival[norm(r['Palabra clave'])].append(r)
 gsc={r['url']:{k:r[k] for k in ['google_page_clicks','google_page_impressions','google_page_ctr','google_page_position']} for r in csv.DictReader((ROOT/'docs/seo-geo/matriz-oportunidades-url-keyword.csv').open(encoding='utf-8-sig')) if r['google_page_impressions']}
 matrix=[]
 for r in observations:
  key=norm(r['Palabra clave']);u=url(r['URL']);route=urlparse(u).path;p=number(r['Posición']);kd=number(r['KD %'])
  historic=any(int(y)<2026 for y in re.findall(r'\b20\d{2}\b',key));irrelevant=bool(re.search(r'margen.*20.*noviembre',key))
  band='1–3' if p<=3 else '4–10' if p<=10 else '11–20' if p<=20 else '21–50' if p<=50 else '51+'
  priority='Protección' if p<=3 else 'Máxima' if p<=10 else 'Alta' if p<=20 else 'Media' if p<=50 and kd is not None and kd<=30 else 'Evaluar después'
  chosen=route in SELECTED and p<=50 and not historic and not irrelevant and (route,key) not in DEFERRED_TARGET_PAIRS
  reason='Consulta de año anterior: conservar intención histórica; no sustituir el año por 2026' if historic else 'Intención ajena a cálculo financiero' if irrelevant else SELECTED.get(route,'Mantener inventario y evaluar brecha concreta antes de editar')
  if historic or irrelevant:priority='No priorizar en este bloque'
  if (route,key) in DEFERRED_TARGET_PAIRS:
   priority='Monitorizar, sin ampliación específica';reason=DEFERRED_TARGET_PAIRS[route,key]
  competitors=[];seen=set()
  for c in sorted(rival[key],key=lambda c:(number(c['Posición']),-date(c).timestamp())):
   cu=url(c['URL'])
   if cu in seen:continue
   seen.add(cu);competitors.append({'url':cu,'position':number(c['Posición']),'observation':c['Act.'],'snapshot':c['_snapshot'],'source':c['_file']})
  matrix.append({'keyword':r['Palabra clave'],'url':u,'position_snapshot':p,'band':band,'volume_estimated':number(r['Volumen']),'kd_estimated':kd,'semrush_intent':r['Intención'],'traffic_estimated_in_export':number(r['Tráfico']),'priority':priority,'selected_keyword_url_pair':chosen,'action_or_reason':reason,'traffic_potential':'Cualitativo: demanda estimada y proximidad, sin pronóstico de clics' if chosen else 'No cuantificado','risk':'Alto: proteger Top 3' if p<=3 else 'Medio: fiscal/laboral; conservar intención, formulas y condiciones','same_query_urls':' | '.join(sorted(urls_by_keyword[key])),'overlap_note':'Solapamiento observado; no prueba canibalización perjudicial' if len(urls_by_keyword[key])>1 else 'Una URL en la muestra','competitor_top3_observed':json.dumps(competitors,ensure_ascii=False,separators=(',',':')) if competitors else '', 'competitor_current_rank':'No verificado; export no es SERP actual','observation_text':r['Act.'],'observation_date_inferred':date(r).isoformat(),'snapshot':r['_snapshot'],'source_file':r['_file'],'source_rows_same_keyword_url':len(groups[key,u]),'source_position_min':min(number(x['Posición']) for x in groups[key,u]),'source_position_max':max(number(x['Posición']) for x in groups[key,u]),**{k:gsc.get(u,{}).get(k,'') for k in ['google_page_clicks','google_page_impressions','google_page_ctr','google_page_position']},'google_period':'2026-08-03/2026-11-04; page-level metrics, do not sum by keyword'})
 matrix.sort(key=lambda x:(not x['selected_keyword_url_pair'],x['position_snapshot'],-(x['volume_estimated'] or 0),x['keyword']))
 OUT.mkdir(parents=True,exist_ok=True)
 write_csv('matriz-oportunidades.csv',matrix);write_csv('keywords-priorizadas.csv',[r for r in matrix if r['selected_keyword_url_pair']])
 write_csv('observaciones-originales.csv',own)
 selected=[r for r in matrix if r['selected_keyword_url_pair']]
 summary={'baseline_source_rows':len(own),'keyword_url_pairs':len(matrix),'unique_keywords':len(urls_by_keyword),'observed_urls':len({r['url'] for r in matrix}),'bands':dict(Counter(r['band'] for r in matrix)),'selected_keyword_url_pairs':len(selected),'selected_unique_keywords':len({norm(r['keyword']) for r in selected}),'selected_urls':len({r['url'] for r in selected}),'same_query_multiple_urls':sum(len(v)>1 for v in urls_by_keyword.values()),'historical_year_pairs':sum(any(int(y)<2026 for y in re.findall(r'\b20\d{2}\b',r['keyword'])) for r in matrix),'source_files':sources,'rules':'Latest inferred observation date per normalized keyword/canonical URL; tie selects best numeric position. Selected: implemented URL + position <=50 + no old-year, irrelevant or explicitly deferred intent. Selection means addressed editorially or routed contextually, not rank improvement.'}
 (OUT/'resumen.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps({k:v for k,v in summary.items() if k not in ['source_files','rules']},ensure_ascii=False))
if __name__=='__main__':main()

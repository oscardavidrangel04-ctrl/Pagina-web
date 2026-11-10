from pathlib import Path
from collections import Counter,defaultdict
from urllib.parse import urlsplit
import csv,hashlib,json,re,argparse
import openpyxl

parser=argparse.ArgumentParser(description='Verify the selected SEMrush package against its original text pages. Requires openpyxl.')
parser.add_argument('--package-dir',type=Path,required=True)
parser.add_argument('--source-zip',type=Path,required=True)
parser.add_argument('--output',type=Path,required=True,help='Use a separate directory to preserve editorial reports.')
args=parser.parse_args()
ROOT=Path(__file__).resolve().parents[1];PKG=args.package_dir;OUT=args.output
OUT.mkdir(parents=True,exist_ok=True)
def writecsv(name,rows):
 with (OUT/name).open('w',encoding='utf-8-sig',newline='') as f:
  w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
def number(s):
 if s=='n/d':return None
 return float(s[:-1].replace(',','.'))*1000 if s.endswith('K') else float(s.replace(',','.'))
w=openpyxl.load_workbook(PKG/'01_SEMrush_propias/Posiciones_organicas_SEMrush_1272.xlsx',read_only=True,data_only=True)
a=list(w.worksheets[0].values);rows=[dict(zip(a[0],r)) for r in a[1:]]
writecsv('semrush-1272-original.csv',rows)
raw=[];errors=[]
for f in sorted((PKG/'01_SEMrush_propias').glob('Texto*.txt'),key=lambda p:int(re.search(r'\((\d+)\)',p.name).group(1))):
 page=int(re.search(r'\((\d+)\)',f.name).group(1));lines=[x.strip() for x in f.read_text(encoding='utf-8-sig').splitlines() if x.strip()]
 for i,line in enumerate(lines):
  if not line.startswith('calculadora-isr-mexico.vercel.app'):continue
  start=next((j for j in range(i-1,max(-1,i-13),-1) if lines[j] in ['I','C','N','T','I C','C I']),None)
  if start is None:errors.append([f.name,i]);continue
  tokens=lines[start+2:i];feature=tokens.pop(0) if re.fullmatch(r'[+-]\d+',tokens[0]) else None
  if len(tokens)!=4:errors.append([f.name,i,'fields']);continue
  raw.append(dict(zip(a[0],[lines[start-1],lines[start],int(lines[start+1]),feature,number(tokens[0]),tokens[1] if tokens[1].startswith('<') else number(tokens[1]),number(tokens[2]),number(tokens[3]),'https://'+line,lines[i+1],page])))
assert not errors,errors
first=[r for r in rows if r['Página origen']!=13]
assert raw==first,'Original TXT and first 12 spreadsheet pages do not match'
last=[x.split('|') for x in (PKG/'01_SEMrush_propias/ultima_pagina.txt').read_text().splitlines() if x.strip()]
sheet_last=[r for r in rows if r['Página origen']==13]
assert len(last)==len(sheet_last)
for parts,r in zip(last,sheet_last):
 assert (parts[0],int(parts[1]),number(parts[3]),number(parts[4]),parts[6])==(r['Palabra clave'],r['Posición'],r['Volumen'],r['KD (%)'],r['Actualización'])

verified=[];missing=[]
last_index=0
for r in rows:
 source_url=r['URL'];note='Campos contrastados con el TXT original.'
 if r['Página origen']==13:
  path=last[last_index][5];last_index+=1
  source_url='https://calculadora-isr-mexico.vercel.app/'+path if path else ''
  note='Última página: intención y tráfico fueron completados por el generador; no constan en el TXT.'
  if not path:
   note+=' URL ausente en el TXT: la home del Excel es un valor de relleno, no una URL observada.'
   missing.append(r['Palabra clave'])
 oldyear=bool(re.search(r'\b20(?:0\d|1\d|2[0-5])\b',r['Palabra clave']))
 verified.append({**r,'URL_confirmada_en_origen':source_url,'control_origen':note,'tratamiento_anio':'Año anterior; no insertar en contenido vigente salvo explicación histórica justificada' if oldyear else 'Sin año antiguo explícito','fecha_normalizada':'No inferida; conservar texto original'})
writecsv('semrush-1272-verificada.csv',verified)
groups=defaultdict(list)
for r in verified:
 if r['URL_confirmada_en_origen']:groups[urlsplit(r['URL_confirmada_en_origen']).path or '/'].append(r)
metrics=json.loads((ROOT/'docs/seo-integral-2026-11-09/final-summary.json').read_text())['page_metrics']
summary=[]
for u,rs in sorted(groups.items()):
 elig=[r for r in rs if r['tratamiento_anio']=='Sin año antiguo explícito']
 keys={(r['Palabra clave'],r['Posición']) for r in rs}
 summary.append({'url':'https://calculadora-isr-mexico.vercel.app'+u,'filas':len(rs),'keywords_distintas':len({r['Palabra clave'] for r in rs}),
 'observaciones_distintas_keyword_posicion':len(keys),'posicion_minima_historica':min(r['Posición'] for r in rs),'posicion_maxima_historica':max(r['Posición'] for r in rs),
 'ejemplos_hasta_posicion_30':' | '.join(dict.fromkeys(f"{r['Palabra clave']} (pos. {r['Posición']}, vol. {r['Volumen']}, KD {r['KD (%)']})" for r in sorted(elig,key=lambda r:(r['Posición'],-r['Volumen'])) if r['Posición']<=30)),
 'gsc_clics':metrics.get(u,{}).get('clicks',''),'gsc_impresiones':metrics.get(u,{}).get('impressions',''),'gsc_ctr':metrics.get(u,{}).get('ctr',''),'gsc_posicion':metrics.get(u,{}).get('position',''),
 'fuente_gsc':metrics.get(u,{}).get('source','Sin exportación de página disponible')})
writecsv('oportunidades-por-url.csv',summary)
old=list(csv.DictReader((ROOT/'docs/seo-avanzado/matriz-oportunidades.csv').open(encoding='utf-8-sig')))
oldkeys={(r['keyword'].lower(),urlsplit(r['url']).path or '/',float(r['position_snapshot'])) for r in old if r['position_snapshot']}
newrecords=[r for r in verified if r['URL_confirmada_en_origen'] and (r['Palabra clave'].lower(),urlsplit(r['URL_confirmada_en_origen']).path or '/',float(r['Posición'])) not in oldkeys]
writecsv('observaciones-adicionales-verificadas.csv',newrecords)
overlap=defaultdict(set)
for r in verified:
 if r['URL_confirmada_en_origen']:overlap[r['Palabra clave'].lower()].add(r['URL_confirmada_en_origen'])
ov=[{'keyword':k,'urls':' | '.join(sorted(urls)),'evaluacion':'Solapamiento observado; no demuestra canibalización ni alternancia temporal'} for k,urls in sorted(overlap.items()) if len(urls)>1]
writecsv('solapamientos-verificados.csv',ov)
mapping=list(csv.DictReader((ROOT/'docs/seo-integral-2026-11-09/mapa-keywords-379-urls.csv').open(encoding='utf-8-sig')))
for m in mapping:
 rs=groups.get(urlsplit(m['url']).path or '/',[])
 m['semrush_observaciones_confirmadas']=len(rs)
 m['semrush_keywords_distintas']=len({r['Palabra clave'] for r in rs})
 m['semrush_terminos_historicos']=' | '.join(sorted({r['Palabra clave'] for r in rs}))
 m['limite_semrush']='Posiciones históricas de varias observaciones; no ranking actual ni visitas reales.' if rs else 'Sin observación propia confirmada en este archivo.'
writecsv('mapa-379-urls-con-semrush.csv',mapping)
source={str(p.relative_to(PKG)):{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(PKG.rglob('*')) if p.is_file()}
stats={'selected_zip':'Calculadoras_Mexico_SEO_Completo_Reenviado(1).zip','selected_zip_sha256':hashlib.sha256(args.source_zip.read_bytes()).hexdigest(),
 'files':len(source),'workbooks':3,'screenshots':39,'isr_screenshots_previously_reviewed':38,'additional_image':'Bono músico en Wikipedia; excluida por intención',
 'rows':len(rows),'keywords':len({r['Palabra clave'] for r in rows}),'spreadsheet_url_count':len({r['URL'] for r in rows}),
 'source_confirmed_urls':len(groups),'first_12_pages_exact_rows':len(raw),'last_page_rows':len(last),'last_page_missing_url_rows':len(missing),'missing_url_keywords':missing,
 'position_bands':{'1-10':sum(r['Posición']<=10 for r in rows),'11-20':sum(11<=r['Posición']<=20 for r in rows),'21-50':sum(21<=r['Posición']<=50 for r in rows),'51-100':sum(r['Posición']>=51 for r in rows)},
 'additional_verified_records_vs_old_matrix':len(newrecords),'overlap_keywords':len(ov),'old_year_rows':sum(r['tratamiento_anio'].startswith('Año') for r in verified),
 'source_files':source}
(OUT/'verificacion-paquete.json').write_text(json.dumps(stats,ensure_ascii=False,indent=2))
print(json.dumps({k:v for k,v in stats.items() if k!='source_files'},ensure_ascii=False,indent=2))

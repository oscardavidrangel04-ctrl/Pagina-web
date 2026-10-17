import zipfile,json,csv,io,hashlib,re
from pathlib import Path
from xml.etree import ElementTree as ET
D=Path('C:/Users/Casa/Downloads')
names=['bloque 1.zip','bloque 2.zip','bloque 3.zip','sueldo bruto.zip','sueldo neto .zip','auditoria_seo_resultados.zip','magic-varias-keywords-2026-10-15T04-35-00-285Z(1).zip','magic-varias-keywords-2026-10-15T04-35-00-285Z.zip','salario-diario-2026-10-15T04-24-52-745Z.zip','pago-quincenal-2026-10-14T17-33-24-816Z.zip','calculadora-de-isr-2026-10-14T17-31-31-134Z.zip','sueldo-bruto-2026-10-14T17-28-09-235Z.zip','sueldo-neto-2026-10-14T17-21-21-773Z.zip','calculadora-de-sueldo-2026-10-14T17-17-46-088Z.zip']
for name in names:
 print('\nARCHIVE',name)
 with zipfile.ZipFile(D/name) as z:
  print('SHA256',hashlib.sha256((D/name).read_bytes()).hexdigest())
  for n in z.namelist():
   if n.endswith('.csv'):
    s=z.read(n).decode('utf-8-sig',errors='replace'); lines=s.splitlines()
    print('CSV',n,'lines',len(lines))
   if n.endswith('comparacion_por_keyword.json'):
    v=json.loads(z.read(n))
    for k,a in v.items():
     print('COMPARISON',k,a.get('url_propia'),a.get('competidores_validos'),json.dumps([t['tema'] for t in a.get('matriz_temas',[]) if not any(x in t['tema'] for x in ['@','comentarios','video','YouTube'])][:24],ensure_ascii=False))
   if n.endswith('resultado.json') or re.search(r'keyword-\d+.json$',n):
    v=json.loads(z.read(n));print('MAGIC',v.get('meta',{}).get('target'),v.get('meta',{}).get('magicStatus'),'suggestions:',[a['label'] for a in v.get('links',[]) if '/keywordoverview/' in a.get('url','')][:15])
with zipfile.ZipFile(D/'Palabra clave.docx') as z:
 root=ET.fromstring(z.read('word/document.xml'))
 ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
 print('WORD TEXT',' '.join(t.text or '' for t in root.findall('.//w:t',ns)))

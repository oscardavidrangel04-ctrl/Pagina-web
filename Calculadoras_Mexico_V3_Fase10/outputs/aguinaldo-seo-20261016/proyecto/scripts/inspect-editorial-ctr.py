import json,re,html,zipfile
from pathlib import Path
slugs='salario-bruto-neto descuentos-nomina-isr-imss convertir-salario-mensual-diario-hora isr-semanal-quincenal-mensual como-calcular-aguinaldo aguinaldo-proporcional aguinaldo-por-antiguedad que-es-el-finiquito que-incluye-finiquito finiquito-vs-liquidacion finiquito-renuncia-voluntaria vacaciones-mexico como-calcular-prima-vacacional'.split()
cfg=json.loads(Path('vercel.json').read_text(encoding='utf-8-sig'));rw={r['source']:r['destination'] for r in cfg['rewrites']}
def clean(t):return html.unescape(re.sub('<[^>]+>',' ',t)).strip()
for slug in slugs:
 url='/articulos/'+slug+'.html';file=rw.get(url,url).lstrip('/');s=Path(file).read_text(encoding='utf8')
 print('\nPAGE',slug,'FILE',file)
 print('TITLE',clean(re.search('<title>(.*?)</title>',s,re.S)[1]))
 print('HEADINGS',[(a,clean(b)) for a,b in re.findall(r'<(h[12])[^>]*>(.*?)</h[12]>',s,re.S)])
 m=re.search('<main[^>]*>(.*?)</main>',s,re.S); body=m[1] if m else s
 print('START',clean(body)[:2300])
 print('STRUCTURE',[(tag,attr) for tag,attr in re.findall(r'<(header|article|section)([^>]*)>',body)][:14])
for name in ['bloque 1.zip','bloque 2.zip','bloque 3.zip']:
 with zipfile.ZipFile(Path('C:/Users/Casa/Downloads')/name) as z:
  v=json.loads(z.read('comparacion_por_keyword.json'))
  print('INPUT',name,[(k,a['competidores_validos']) for k,a in v.items()])

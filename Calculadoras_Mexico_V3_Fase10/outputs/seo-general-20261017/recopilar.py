from pathlib import Path
import openpyxl, json, hashlib, zipfile
out = Path(__file__).parent
downloads = Path('C:/Users/Casa/Downloads')
books=[]
for i in range(1,6):
    p=downloads/f'https___calculadora-isr-mexico.vercel.app_-Performance-on-Search-2026-10-17({i}).xlsx'
    w=openpyxl.load_workbook(p,data_only=True)
    data={s.title:list(s.values) for s in w}
    books.append({'file':str(p),'content_sha256':hashlib.sha256(json.dumps(data,default=str).encode()).hexdigest()})
    if i==1: gsc=data
semrush=downloads/'semrush-organic-positions-2026-10-17T06-16-47-037Z.zip'
with zipfile.ZipFile(semrush) as z:
    data=json.loads(z.read('./resultado.json'))
rows=data['reports'][0]['table']['rows']
evidence={'exports':books,'identical_exports':len({b['content_sha256'] for b in books})==1,'gsc':gsc,'semrush_source':str(semrush),'semrush_rows':len(rows),'semrush_data':rows,'caution':'GSC no cruza consulta y URL en este export. No sumar copias duplicadas. Semrush es una estimación con fechas distintas; no equivale a rendimiento actual confirmado.'}
(out/'evidencia.json').write_text(json.dumps(evidence,ensure_ascii=False,indent=2,default=str),encoding='utf8')
print('Evidence saved:',len(rows),'Semrush rows; identical GSC exports:',evidence['identical_exports'])

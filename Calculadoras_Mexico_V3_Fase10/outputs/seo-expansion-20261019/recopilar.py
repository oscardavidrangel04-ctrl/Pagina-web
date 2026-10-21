from pathlib import Path
import openpyxl,json,hashlib,zipfile,collections

out=Path(__file__).parent
downloads=Path('C:/Users/Casa/Downloads')
sources=[]
for p in sorted(downloads.glob('https___calculadora-isr-mexico.vercel.app_-Performance-on-Search-2026-10-19*.xlsx')):
    w=openpyxl.load_workbook(p,data_only=True)
    data={s.title:list(s.values) for s in w}
    digest=hashlib.sha256(json.dumps(data,default=str).encode()).hexdigest()
    sources.append({'path':str(p),'sha256_content':digest})
    if len(sources)==1:gsc=data
exports=[]
for p in sorted(downloads.glob('semrush-organic-positions-2026-10-19*.zip')):
    with zipfile.ZipFile(p) as z:
        key=next(n for n in z.namelist() if n.endswith('resultado.json'))
        data=json.loads(z.read(key))
    exports.append({'path':str(p),'sha256_file':hashlib.sha256(p.read_bytes()).hexdigest(),'data':data})
result={'gsc_sources':sources,'gsc_unique_exports':len(set(s['sha256_content'] for s in sources)),'gsc':gsc,'semrush':exports,'note':'Original export records retained. GSC query and page sheets are not query-page pairs. Do not sum duplicated exports or mix estimated Semrush volume with GSC impressions.'}
(out/'datos-fuente.json').write_text(json.dumps(result,ensure_ascii=False,indent=2,default=str),encoding='utf-8')
print('Saved',len(sources),'GSC files,',result['gsc_unique_exports'],'distinct report;',len(exports),'Semrush exports')
print('GSC top queries:')
for r in sorted(gsc['Consultas'][1:],key=lambda r:r[2],reverse=True)[:60]:print(r)

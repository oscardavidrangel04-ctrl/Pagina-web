from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse, unquote
import json, hashlib, zipfile, xml.etree.ElementTree as ET

base=Path(__file__).resolve().parent
copy=base/'proyecto'
original=base.parent.parent
class Parser(HTMLParser):
    def __init__(self):
        super().__init__();self.urls=[];self.ids=[]
    def handle_starttag(self,t,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        for key in ['href','src']:
            if key in a:self.urls.append(a[key])
p=Parser();p.feed((copy/'calculadoras/aguinaldo.html').read_text(encoding='utf-8'))
missing=[]
for u in p.urls:
    parsed=urlparse(u)
    if parsed.scheme or parsed.netloc or not parsed.path:continue
    if parsed.path.startswith('/_vercel/'):continue
    path=(copy/unquote(parsed.path).lstrip('/')) if parsed.path.startswith('/') else copy/'calculadoras'/unquote(parsed.path)
    if not path.exists():missing.append(u)
assert not missing,missing
assert len(p.ids)==len(set(p.ids)),'duplicate ids'
ET.parse(copy/'sitemap.xml')
ET.parse(copy/'assets/img/aguinaldo-proporcional-pasos.svg')
files=['calculadoras/aguinaldo.html','assets/js/aguinaldo-premium.js','assets/css/aguinaldo-focus.css','assets/img/aguinaldo-proporcional-pasos.svg','sitemap.xml','scripts/test-aguinaldo-focus.cjs']
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest() if p.exists() else None
manifest={f:{'original_sha256':digest(original/f),'nuevo_sha256':digest(copy/f),'bytes':(copy/f).stat().st_size} for f in files}
(base/'MANIFIESTO.json').write_text(json.dumps({'archivos':manifest,'validacion':{'enlaces_y_recursos_locales_faltantes':missing,'ids_unicos':len(p.ids),'sitemap_xml':'OK','svg_xml':'OK'}},indent=2),encoding='utf-8')
with zipfile.ZipFile(base/'aguinaldo-mejoras-seo.zip','w',zipfile.ZIP_DEFLATED) as z:
    for f in files:z.write(copy/f,f)
    for f in ['INFORME.md','MATRIZ_KEYWORDS.md','MATRIZ_KEYWORDS.json','MANIFIESTO.json','EVIDENCIA_COMPETIDORES.json']:
        z.write(base/f,'documentacion/'+f)
print(json.dumps({'zip':str(base/'aguinaldo-mejoras-seo.zip'),'bytes':(base/'aguinaldo-mejoras-seo.zip').stat().st_size,'archivos_sitio_y_test':len(files),'ids':len(p.ids),'recursos_faltantes':missing}))

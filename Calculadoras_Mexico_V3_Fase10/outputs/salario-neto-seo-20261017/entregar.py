from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse, unquote
import hashlib, json, zipfile, xml.etree.ElementTree as ET

base=Path(__file__).resolve().parent
root=base.parent.parent
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.urls=[]; self.ids=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        for attr in ['href','src']:
            if attr in a:self.urls.append(a[attr])
p=Page();p.feed((root/'calculadoras/salario-neto.html').read_text(encoding='utf-8'))
missing=[]
for raw in p.urls:
    u=urlparse(raw)
    if u.scheme or u.netloc or not u.path or u.path.startswith('/_vercel/'):continue
    path=root/unquote(u.path).lstrip('/') if u.path.startswith('/') else root/'calculadoras'/unquote(u.path)
    if not path.exists():missing.append(raw)
assert not missing,missing
assert len(set(p.ids))==len(p.ids),'IDs duplicados'
ET.parse(root/'sitemap.xml')
files=['calculadoras/salario-neto.html','assets/css/salario-neto-focus.css','assets/js/salario-neto-receipt.js','sitemap.xml','scripts/test-salario-neto-focus.cjs']
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
manifest={'recursos_locales_faltantes':missing,'ids_unicos':len(p.ids),'archivos':{f:{'antes':sha(base/'antes'/f),'despues':sha(root/f)} for f in files}}
(base/'MANIFIESTO.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
with zipfile.ZipFile(base/'salario-neto-mejoras-seo.zip','w',zipfile.ZIP_DEFLATED) as z:
    for f in files:z.write(root/f,f)
    for f in ['INFORME.md','MANIFIESTO.json']:z.write(base/f,'documentacion/'+f)
print(json.dumps({'archivos':len(files),'recursos_faltantes':missing,'zip':str(base/'salario-neto-mejoras-seo.zip')}))

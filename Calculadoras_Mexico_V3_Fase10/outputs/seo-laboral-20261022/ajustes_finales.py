from patch_html import *
print('*** Begin Patch')
p='calculadoras/ptu.html';old=(ROOT/p).read_text(encoding='utf8')
new=old.replace('/articulos/ptu-exenta-gravada.html','/articulos/ptu-exenta-isr.html')
if old!=new:patch_file(p,old,new)
p='articulos/horas-extra-2026.html';old=(ROOT/p).read_text(encoding='utf8')
# Keep the site's primary Article node; the legacy BlogPosting described the same article with a conflicting publication date.
def schema(m):
    data=json.loads(m[1]);items=data.get('@graph',[data]);kept=[x for x in items if x.get('@type')!='BlogPosting']
    if len(kept)==len(items):return m[0]
    if not kept:return ''
    if '@graph' in data:data['@graph']=kept
    return '<script type="application/ld+json">'+json.dumps(data,ensure_ascii=False,separators=(',',':'))+'</script>'
new=re.sub(r'<script\b[^>]*type=[\"\']application/ld\+json[\"\'][^>]*>(.*?)</script>',schema,old,flags=re.S)
if old!=new:patch_file(p,old,new)
print('*** End Patch')

import json,re
from pathlib import Path
from audit_architecture import audit,ROOT
def validate():
 a=audit();before=[]
 for f in (ROOT/'auditoria-arquitectura').glob('inventario-antes-*.json'):before.extend(json.loads(f.read_text(encoding='utf-8')))
 old={p['path']:p for p in before};protected=[];h1=[];schemas=[]
 for p in a['pages']:
  s=(ROOT/p['served_file']).read_text(encoding='utf-8-sig')
  if p['path'] in old:
   for key in ['title','canonical','robots']:
    if p[key]!=old[p['path']][key]:protected.append([p['path'],key])
  if p['indexable'] and len(re.findall(r'<h1\b',s,re.I))!=1:h1.append(p['path'])
  for attrs,raw in re.findall(r'<script([^>]*)>(.*?)</script>',s,re.S|re.I):
   if 'application/ld+json' not in attrs:continue
   try:json.loads(raw)
   except Exception:schemas.append(p['path'])
 cfg=json.loads((ROOT/'vercel.json').read_text(encoding='utf-8-sig'))
 return {'summary':a['summary'],'protected_metadata_changes':protected,'h1_errors':h1,'json_ld_errors':schemas,'rewrites':len(cfg.get('rewrites',[])),'redirects':len(cfg.get('redirects',[]))}
if __name__=='__main__':print(json.dumps(validate(),ensure_ascii=False))

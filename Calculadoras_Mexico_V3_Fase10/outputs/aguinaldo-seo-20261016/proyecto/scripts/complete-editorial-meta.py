import json,re,html,difflib
from pathlib import Path
print('*** Begin Patch')
for row in json.loads(Path('outputs/CTR_ARTICULOS_2026-10-15.json').read_text(encoding='utf8')):
 p=Path(row['file']);before=p.read_text(encoding='utf8');s=before;tags=[]
 for attr,key,value in [('property','og:title',row['title']),('property','og:description',row['description']),('name','twitter:title',row['title']),('name','twitter:description',row['description'])]:
  if not re.search(r'<meta\b[^>]*'+attr+'="'+re.escape(key)+'"',s):tags.append('<meta '+attr+'="'+key+'" content="'+html.escape(value,quote=True)+'">')
 if tags:s=s.replace('</head>','\n'+'\n'.join(tags)+'\n</head>',1)
 if p.name=='aguinaldo-proporcional.html':s=s.replace('La diferencia de $41.09','La diferencia de unos $41')
 if s==before:continue
 diff=list(difflib.unified_diff(before.splitlines(),s.splitlines(),n=1,lineterm=''))[2:]
 print('*** Update File: '+row['file']);print('\n'.join('@@' if x.startswith('@@') else x for x in diff))
print('*** End Patch')

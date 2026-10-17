"""Check topic coverage and the 13 corrected parent relationships."""
import re
from audit_architecture import audit, ROOT, Page
from plan_architecture import TOPIC_OVERRIDES

a = audit()
pages = {p['path']: p for p in a['pages'] if p['indexable']}
hub_targets = {}
for file in (ROOT/'temas').glob('*.html'):
    # Exclude curated routes: verify the exhaustive directory itself.
    text = file.read_text(encoding='utf-8-sig')
    sections = re.findall(r'<section class="content-box">.*?</section>', text, re.S)
    hub_targets[file.stem] = {href for section in sections for href,_,_ in Page(section).links}

for slug,(topic,_) in TOPIC_OVERRIDES.items():
    path = next(p for p in pages if p.endswith('/'+slug+'.html'))
    assert path in hub_targets[topic], (path,topic,'missing in topic')
    assert sum(path in targets for targets in hub_targets.values()) == 1, (path,'duplicate directory classification')
    text=(ROOT/pages[path]['served_file']).read_text(encoding='utf-8-sig')
    block=re.search(r'<section class="content-box architecture-related"[^>]*>.*?</section>',text,re.S)[0]
    assert '/temas/'+topic+'.html' in block, (path,'wrong parent')

content={p for p in pages if p.startswith(('/articulos/','/calculadoras/'))}
covered=set().union(*hub_targets.values())
assert not content-covered, content-covered
assert a['summary']['broken_links']==0
print(f'{len(TOPIC_OVERRIDES)} corrected relationships OK; {len(content)} article/calculator URLs covered by 12 topic directories.')

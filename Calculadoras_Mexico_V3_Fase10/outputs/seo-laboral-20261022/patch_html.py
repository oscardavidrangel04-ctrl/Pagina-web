"""Build exact-source patches; only apply_patch writes the website."""
from html.parser import HTMLParser
from pathlib import Path
from lxml import html
import json,re,sys,shutil,difflib
ROOT=Path(__file__).resolve().parents[2];OUT=Path(__file__).parent
class Spans(HTMLParser):
    def __init__(self,text):
        super().__init__(convert_charrefs=False);self.text=text;self.offsets=[0];self.nodes=[];self.stack=[]
        for m in re.finditer('\n',text):self.offsets.append(m.end())
        self.feed(text)
    def pos(self):
        line,col=self.getpos();return self.offsets[line-1]+col
    def handle_starttag(self,tag,attrs):
        n={'tag':tag,'attrs':dict(attrs),'start':self.pos(),'openend':self.pos()+len(self.get_starttag_text())};self.nodes.append(n)
        if tag in {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}:n['end']=n['openend']
        else:self.stack.append(n)
    def handle_endtag(self,tag):
        for i in range(len(self.stack)-1,-1,-1):
            if self.stack[i]['tag']==tag:
                n=self.stack[i];n['end']=self.text.index('>',self.pos())+1;del self.stack[i:];break
def plain(s):return ' '.join(html.fromstring(s).text_content().split())
def patch_file(path,old,new):
    assert old!=new,path+' no change'
    backup=OUT/'antes'/path;backup.parent.mkdir(parents=True,exist_ok=True)
    if not backup.exists():shutil.copy2(ROOT/path,backup)
    print('*** Update File: '+str(ROOT/path))
    diff=list(difflib.unified_diff(old.splitlines(),new.splitlines(),n=3))
    for l in diff[2:]:print('@@' if l.startswith('@@') else l)
def sections(text):
    return [(n,text[n['start']:n['end']]) for n in Spans(text).nodes if n['tag']=='section' and 'end'in n]
def replace_section(text,heading,replacement):
    candidates=[(n,s) for n,s in sections(text) if re.search(r'<h2\b[^>]*>\s*'+re.escape(heading)+r'\s*</h2>',s)]
    assert candidates,heading
    n,s=min(candidates,key=lambda x:len(x[1]));return text[:n['start']]+replacement+text[n['end']:]
def replace_exact(text,old,new):
    assert old in text,old[:100];return text.replace(old,new)
def metadata(text,title=None,description=None):
    doc=html.fromstring(text)
    if title:
        text=text.replace(doc.findtext('.//title'),title)
    if description:
        desc=doc.xpath('//meta[@name="description"]/@content')[0]
        text=text.replace(desc,description)
    return text
def faq(text,questions):
    markup='<section class="content-box" id="preguntas-frecuentes"><h2>Preguntas frecuentes</h2>'+''.join('<details><summary>'+q+'</summary><p>'+a+'</p></details>' for q,a in questions)+'</section>'
    candidates=[(n,s) for n,s in sections(text) if re.search(r'<h2[^>]*>Preguntas frecuentes',s)]
    if candidates:
        n,s=min(candidates,key=lambda x:len(x[1]));text=text[:n['start']]+markup+text[n['end']:]
    def update(m):
        data=json.loads(m[1]);changed=False
        for obj in data.get('@graph',[data]):
            if obj.get('@type')=='FAQPage':
                obj['mainEntity']=[{'@type':'Question','name':q,'acceptedAnswer':{'@type':'Answer','text':plain('<p>'+a+'</p>')}} for q,a in questions];changed=True
        return '<script type="application/ld+json">'+json.dumps(data,ensure_ascii=False,separators=(',',':'))+'</script>' if changed else m[0]
    return re.sub(r'<script\b[^>]*type=[\"\']application/ld\+json[\"\'][^>]*>(.*?)</script>',update,text,flags=re.S)
def consolidate_links(text,classes):
    nodes=[(n,s) for n,s in sections(text) if any(c in n['attrs'].get('class','').split() for c in classes)]
    # Remove only automatically added link blocks; keep each unique destination in one compact group.
    if not nodes:return text
    links={}
    for n,s in nodes:
        for a in html.fromstring(s).xpath('.//a[@href]'):
            label=a.xpath('string(.//strong)') or a.text_content();links.setdefault(a.get('href'),' '.join(label.split()))
    for n,s in sorted(nodes,key=lambda x:x[0]['start'],reverse=True):text=text[:n['start']]+text[n['end']:]
    existing=set(html.fromstring(text).xpath('//main//a/@href'))
    unique={u:l for u,l in links.items() if u not in existing}
    if unique:
        block='<section class="content-box" data-editorial="related-20261023"><details><summary>Otras guías de salario y prestaciones</summary><ul>'+''.join('<li><a href="'+u+'">'+l+'</a></li>' for u,l in unique.items())+'</ul></details></section>'
        text=text.replace('</main>',block+'</main>')
    return text
if __name__=='__main__':
    print('Helper module; import from a task-specific patch builder.')

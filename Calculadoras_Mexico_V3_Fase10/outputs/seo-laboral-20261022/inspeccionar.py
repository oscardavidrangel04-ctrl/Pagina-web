from pathlib import Path
from lxml import html
import sys,json
root=Path(__file__).resolve().parents[2]
for filename in sys.argv[1:]:
    p=root/filename
    if not p.exists():
        print('NO EXISTE',filename);continue
    doc=html.fromstring(p.read_text(encoding='utf-8'))
    print('\nFILE:',filename)
    print('TITLE:',doc.findtext('.//title'))
    print('META:',doc.xpath('//meta[@name="description"]/@content'))
    print('HEADINGS:',[(e.tag,e.get('id'),e.text_content().strip()) for e in doc.xpath('//h1|//h2|//h3')])
    print('FORMS:',[(e.tag,dict(e.attrib)) for e in doc.xpath('//form|//input|//select|//button') if e.tag!='button' or e.get('type')=='submit'])
    for s in doc.xpath('//script|//style|//nav|//footer|//aside|//section[contains(@class,"inlink") or contains(@class,"internal-hub") or contains(@class,"aguinaldo-context") or contains(@class,"seo-agent-related")]'):
        s.drop_tree()
    main=doc.xpath('//main')
    print('TEXT:', ' '.join(main[0].text_content().split()) if main else '')

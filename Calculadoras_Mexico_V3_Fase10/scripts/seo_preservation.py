"""Preserve prior releases, allowing only the explicitly reviewed missing-route redirect."""
from pathlib import Path
import hashlib,json,sys

def assert_preserved(root,name,expected):
    path=root/name
    if name!='vercel.json':
        assert hashlib.sha256(path.read_bytes()).hexdigest()==expected,name
        return
    baseline=root/'docs/seo-google-bing-2026-11-11/configuration-avant.json'
    assert hashlib.sha256(baseline.read_bytes()).hexdigest()==expected,'Untouched configuration baseline'
    before=json.loads(baseline.read_text());after=json.loads(path.read_text())
    allowed={'source':'/articulos/finiquito-por-meses-trabajados.html',
             'destination':'/articulos/que-incluye-finiquito.html','permanent':True}
    assert after['redirects']==before['redirects']+[allowed],'Only the reviewed missing-route redirect may be added'
    after['redirects']=before['redirects']
    assert after==before,'Build, deployment, headers and rewrites remain identical'

if __name__=='__main__':
    assert_preserved(Path(__file__).resolve().parents[1],sys.argv[1],sys.argv[2])

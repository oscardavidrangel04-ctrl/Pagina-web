"""Emit a reviewed patch for shared loading improvements; never write source files."""
from pathlib import Path
import difflib

changes = {}
for name in ('assets/js/common.js', 'assets/js/common.min.js'):
    before = Path(name).read_text(encoding='utf-8')
    after = before
    replacements = [
        ("const money=value=>new Intl.NumberFormat('es-MX',{style: 'currency',currency: 'MXN'}).format(Number(value)||0);", "const CM_MONEY_FORMAT=new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'});const money=value=>CM_MONEY_FORMAT.format(Number(value)||0);"),
        ("let CM_RUNTIME_CATALOG=[];", "let CM_RUNTIME_CATALOG=[];let CM_CATALOG_REQUEST=null;"),
        ("let searchOpener;const render=async(term= '')=>{const catalog=await ensureCatalog();", "let searchOpener;let searchRevision=0;const render=async(term= '')=>{const revision=++searchRevision;const catalog=await ensureCatalog();if(revision!==searchRevision)return;"),
        ("if('serviceWorker'in navigator&&location.protocol=== 'https:')navigator.serviceWorker.register('/sw.js').catch(()=>{});", "if('serviceWorker'in navigator&&location.protocol==='https:'){const install=()=>{const register=()=>navigator.serviceWorker.register('/sw.js').catch(()=>{});if('requestIdleCallback'in window)requestIdleCallback(register,{timeout:5000});else setTimeout(register,1000);};if(document.readyState==='complete')install();else window.addEventListener('load',install,{once:true});}"),
    ]
    for old,new in replacements:
        assert after.count(old)==1,(name,old)
        after=after.replace(old,new)
    start=after.index('async function ensureCatalog()')
    end=after.index('function relatedCalculators',start)
    after=after[:start]+'''async function ensureCatalog(){
  if(Array.isArray(globalThis.CM_CATALOG)&&globalThis.CM_CATALOG.length)return globalThis.CM_CATALOG;
  if(!CM_CATALOG_REQUEST){
    CM_CATALOG_REQUEST=fetch('/assets/data/calculators.json').then(response=>{
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      return response.json();
    }).then(items=>{
      if(!Array.isArray(items)||!items.length||!items.every(item=>item&&/^[a-z0-9-]+$/.test(item.slug)&&typeof item.title==='string'))throw new Error('Invalid catalog');
      CM_RUNTIME_CATALOG=items;return items;
    }).catch(()=>{CM_CATALOG_REQUEST=null;const visible=catalogFromCards();if(visible.length>CM_RUNTIME_CATALOG.length)CM_RUNTIME_CATALOG=visible;return catalogItems();});
  }
  return CM_CATALOG_REQUEST;
}'''+after[end:]
    old="const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible');}),{threshold:.06});document.querySelectorAll('.card,.trust-item,.content-box,.calc-box,.article,.personal-panel').forEach(element=>{element.classList.add('reveal');observer.observe(element);});"
    assert after.count(old)==1
    after=after.replace(old,"/* Content stays visible immediately; no reveal observer or scroll animation required. */")
    changes[name]=(before,after)

name='assets/js/interface-v570.js'
before=Path(name).read_text(encoding='utf-8')
after=before.replace("if (document.readyState !== 'complete')", "if (document.readyState === 'loading')")
assert before!=after
changes[name]=(before,after)
print('*** Begin Patch')
for name,(before,after) in changes.items():
    print('*** Update File: '+name)
    for line in list(difflib.unified_diff(before.splitlines(),after.splitlines(),n=2))[2:]:
        print('@@' if line.startswith('@@') else line)
print('*** End Patch')

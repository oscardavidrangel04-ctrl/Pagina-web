/* Run from any directory. Read-only checks; browser tests refresh QA screenshots. */
const {spawnSync}=require('child_process');
const fs=require('fs'),path=require('path'),os=require('os');
const root=path.resolve(__dirname,'..');
const bundled=path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe');
const python=process.env.SEO_PYTHON||(fs.existsSync(bundled)?bundled:'python');
const checks=[
 ['SEO completo',python,['-X','utf8','scripts/check-phase6-release.py']],
 ['Temas y cobertura',python,['-X','utf8','scripts/check-phase4-topics.py']],
 ['Lote editorial 2',process.execPath,['scripts/check-phase2-seo.cjs']],
 ['Lote editorial 3',process.execPath,['scripts/check-phase2-seo.cjs','--phase3']],
 ['Navegación sin JavaScript',process.execPath,['scripts/check-phase4-seo.cjs']],
 ['Carga y buscador',process.execPath,['scripts/check-phase5-performance.cjs']],
 ['Salario neto',process.execPath,['scripts/test-salario-neto-focus.cjs']],
 ['Salario por hora',process.execPath,['scripts/test-salario-hora-focus.cjs']],
 ['Aguinaldo',process.execPath,['scripts/test-aguinaldo-focus.cjs']],
];
const results=[];
for(const [name,command,args] of checks){
 console.log('Comprobando: '+name);
 const run=spawnSync(command,args,{cwd:root,encoding:'utf8',timeout:120000,windowsHide:true});
 const ok=!run.error&&run.status===0;results.push({name,status:ok?'PASS':'FAIL'});
 if(!ok)console.error(run.error?.message||run.stderr||run.stdout);
 console.log(name+': '+(ok?'PASS':'FAIL'));
}
console.log(JSON.stringify({status:results.every(x=>x.status==='PASS')?'PASS':'FAIL',checks:results},null,2));
process.exitCode=results.some(x=>x.status!=='PASS')?1:0;

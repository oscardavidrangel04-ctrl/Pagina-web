from pathlib import Path
import difflib
changes={
 'calculadoras/salario-diario.html': [('<section class="content-box" data-ctr-review="20261015">','<section class="content-box" id="guia-del-calculo" data-ctr-review="20261015">')],
 'calculadoras/isr.html': [('<label for="salario">Ingreso bruto del periodo</label>','<label for="salario">Ingreso gravable del periodo (MXN)</label>')]
}
print('*** Begin Patch')
for name,pairs in changes.items():
 before=Path(name).read_text(encoding='utf-8');after=before
 for a,b in pairs:
  assert a in after,(name,a)
  after=after.replace(a,b,1)
 diff=list(difflib.unified_diff(before.splitlines(),after.splitlines(),n=1,lineterm=''))
 print('*** Update File: '+name)
 print('\n'.join('@@' if x.startswith('@@') else x for x in diff[2:]))
print('*** End Patch')

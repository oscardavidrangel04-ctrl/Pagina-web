import json, zipfile, re, unicodedata, hashlib
from pathlib import Path

base=Path(__file__).resolve().parent
downloads=Path(r'C:\Users\Casa\Downloads')
sources={'propia':'04-52-42-671Z','fiscoclic':'04-47-04-655Z','novacard':'04-41-40-482Z','nominax':'04-57-37-574Z'}
def norm(s):
    return ''.join(c for c in unicodedata.normalize('NFD',s.lower()) if unicodedata.category(c)!='Mn').strip()
def number(s):
    s=str(s).strip().upper().replace(' ','').replace('.','').replace(',','.')
    try: return float(s.rstrip('KM'))*(1000 if s.endswith('K') else 1000000 if s.endswith('M') else 1)
    except ValueError: return None
def read(t):
    p=downloads/('semrush-organic-positions-2026-10-17T'+t+'.zip')
    with zipfile.ZipFile(p) as z:
        d=json.loads(z.read(next(n for n in z.namelist() if n.endswith('resultado.json'))))
    return d['reports'][0]['table']['rows']
inventory={}; allkeys={}; raw={}
for site,t in sources.items():
    rows=read(t);raw[site]=rows; unique={}
    for r in rows:
        k=norm(r[0]);pos=int(r[2]) if str(r[2]).isdigit() else None
        record={'keyword':r[0],'posicion':pos,'volumen':number(r[6]),'kd':number(r[7]),'url':r[8],'actualizacion':r[9]}
        if k not in unique or (pos or 999)<(unique[k]['posicion'] or 999):unique[k]=record
    inventory[site]={'archivo':'semrush-organic-positions-2026-10-17T'+t+'.zip','filas':len(rows),'keywords_unicas':len(unique)}
    for k,v in unique.items():allkeys.setdefault(k,{'keyword':v['keyword'],'fuentes':{}})['fuentes'][site]=v
for k,v in allkeys.items():
    vol=max((r['volumen'] or 0 for r in v['fuentes'].values()),default=0)
    kd=min((r['kd'] for r in v['fuentes'].values() if r['kd'] is not None),default=100)
    own=v['fuentes'].get('propia',{}).get('posicion')
    if 'aguinaldo' not in k: group='Otro tema: no incorporar'; priority='Excluir'
    elif re.search(r'20(1\d|2[0-5])',k):group='Año anterior: no mezclar con 2026';priority='Excluir'
    elif any(w in k for w in ['pension','imss','issste','jubilad']):group='Pensiones / régimen especial: otra guía';priority='Revisar intención'
    elif any(w in k for w in ['argentina','colombia','guatemala','costa rica','uruguay','salvador','chile','bolivia','honduras','peru','paraguay']):group='Otro país: no incorporar';priority='Excluir'
    elif re.search(r'\d+ (mes|ano)|renunci|finiquito|antiguedad',k):group='Caso específico: enlazar guía existente';priority='P2'
    elif 'proporcional' in k:group='Proporcional: resumen y enlace a herramienta dedicada';priority='P2'
    elif any(w in k for w in ['isr','impuesto','neto','exent','gravad']):group='ISR y neto: estimador + guía fiscal';priority='P1'
    else:group='Calculadora / cálculo general';priority='P1' if any(w in k for w in ['calcul','cuanto']) else 'P2'
    v.update(grupo=group,prioridad=priority,volumen_referencia=vol,kd_minimo_reportado=kd,posicion_propia=own,ausente_export_propio='propia' not in v['fuentes'],cerca_top10=own is not None and 4<=own<=20)
ordered=sorted(allkeys.values(),key=lambda v:(v['prioridad']!='P1',not v['cerca_top10'],-v['volumen_referencia'],v['kd_minimo_reportado']))
duplicate=raw['fiscoclic']==read('04-32-29-634Z')
out={'metodologia':'México; exportaciones aportadas, no SERP actual. Deduplicación por keyword normalizada y mejor posición numérica. Ausente significa no detectado en este export, no ausencia de ranking. Clasificación heurística: validar intención antes de crear contenido. Volumen máximo y KD mínimo entre fuentes, datos originales conservados. No sumar variantes como tráfico potencial.','inventario':inventory,'fiscoclic_export_duplicado':duplicate,'keywords':ordered}
(base/'MATRIZ_KEYWORDS.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
lines=['# Matriz de oportunidades — aguinaldo','',out['metodologia'],'','## Inventario','']
for site,v in inventory.items():lines.append(f"- {site}: {v['filas']} filas; {v['keywords_unicas']} keywords únicas.")
lines+=['',f'Exportaciones de Fiscoclic idénticas en filas: {duplicate}.','',f'Total de keywords normalizadas entre fuentes: {len(ordered)}. Detalle completo en MATRIZ_KEYWORDS.json.','', '## Oportunidades prioritarias (muestra de 40)','', '| Keyword | Volumen | KD mín. | Propia | Fisco | Nominax | Nova | Grupo |','|---|---:|---:|---:|---:|---:|---:|---|']
for v in [v for v in ordered if v['prioridad']=='P1'][:40]:
    positions=[str(v['fuentes'].get(s,{}).get('posicion') or '—') for s in ['propia','fiscoclic','nominax','novacard']]
    lines.append('| '+v['keyword']+' | '+str(v['volumen_referencia'])+' | '+str(v['kd_minimo_reportado'])+' | '+' | '.join(positions)+' | '+v['grupo']+' |')
(base/'MATRIZ_KEYWORDS.md').write_text('\n'.join(lines),encoding='utf-8')
audit=Path(r'C:\Users\Casa\AppData\Local\Temp\codex-file-preview-WToaCV\auditoria_seo_resultados(1).zip')
with zipfile.ZipFile(audit) as z:
    docs=[json.loads(z.read(n)) for n in z.namelist() if re.match(r'0[1-4]_.*\.json$',n)]
(base/'EVIDENCIA_COMPETIDORES.json').write_text(json.dumps(docs,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'inventario':inventory,'keywords':len(ordered),'duplicado':duplicate}))

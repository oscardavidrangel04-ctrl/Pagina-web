"""Generate a reviewable change plan, never write site files."""
import json,re,sys
from pathlib import Path
from html import escape
from collections import defaultdict
from audit_architecture import audit,ROOT,BASE,Page
TOPICS={
 'nomina':('Salario y nómina','Convierte periodos de sueldo, entiende tu recibo y distingue el salario diario del integrado.'),
 'prestaciones':('Prestaciones y derechos laborales','Consulta aguinaldo, vacaciones, utilidades y terminación laboral. Elige primero el concepto que corresponde a tu situación.'),
 'impuestos':('Impuestos y trámites SAT','Relaciona el cálculo orientativo de ISR o IVA con las guías de facturación y declaración que correspondan a tu régimen.'),
 'ahorro':('Ahorro y cuentas','Organiza una meta, compara cuentas y revisa disponibilidad y costos antes de separar tu dinero.'),
 'presupuesto':('Presupuesto y finanzas personales','Registra ingresos y gastos, prepara reservas y da seguimiento a tu presupuesto sin contar movimientos dos veces.'),
 'inversion':('Inversión y rendimientos','Comprende plazos, tasas, inflación y liquidez. Los resultados de las herramientas son escenarios, no promesas de ganancia.'),
 'credito':('Créditos, tarjetas y deudas','Compara el costo de financiarte, interpreta pagos y saldos y organiza la amortización según tu capacidad de pago.'),
 'transferencias':('Transferencias y SPEI','Entiende los datos de una transferencia, verifica su estado y consulta qué revisar si el dinero no llega.'),
 'seguros':('Seguros y protección','Distingue coberturas, deducibles y coaseguro. Usa estas guías para preparar preguntas al comparar pólizas.'),
 'retiro':('AFORE, pensión y seguridad social','Ubica las guías sobre ahorro para el retiro, pensiones e incapacidades según el trámite y la institución.'),
 'negocios':('Precios y finanzas del negocio','Analiza costos, precio de venta, margen y punto de equilibrio sin confundir ingresos con utilidad.'),
 'herramientas':('Cálculos cotidianos','Resuelve porcentajes, fechas, propinas y conversiones con herramientas y explicaciones específicas.')}
def classify(path):
 s=path.rsplit('/',1)[-1].replace('.html','')
 if re.search('finiquito|liquidacion|despido|renuncia|indemnizacion|prima-antiguedad',s):
  if re.search('carta|formato|firmar|descontar|pagar|cuando',s):return 'prestaciones','Cobro y documentos de terminación'
  if re.search('jubilacion|pension|incapacidad',s):return 'prestaciones','Terminación y seguridad social'
  if re.search('despido|indemnizacion|liquidacion',s):return 'prestaciones','Despido e indemnización'
  return 'prestaciones','Finiquito y renuncia'
 if re.search('aguinaldo|dias-de-aguinaldo',s):return 'prestaciones','Aguinaldo'
 if re.search('vacacion|prima-dominical|dias-festivos',s):return 'prestaciones','Vacaciones y descanso'
 if re.search('ptu|utilidades',s):return 'prestaciones','Reparto de utilidades'
 if re.search('infonavit|hipoteca',s):return 'credito','Vivienda e Infonavit'
 if re.search('afore|pension|modalidad-40|semanas-cotizadas|ley-73|ley-97|conservacion-derechos',s):return 'retiro','AFORE y pensiones'
 if re.search('imss-incapacidad|incapacidad-imss|incapacidad|incapacidades',s):return 'retiro','Incapacidades y seguridad social'
 if re.search('seguro|coaseguro|deducible|poliza|cnsf',s):return 'seguros','Coberturas y costos'
 if re.search('spei|clabe|clave-rastreo|transferencia',s) and 'tarjeta' not in s:return 'transferencias','Datos, estados y seguimiento'
 if re.search('isr|iva|sat|resico|factura|cfdi|honorarios|deducciones-personales|persona-fisica|subsidio',s):return 'impuestos','ISR y nómina' if re.search('isr|subsidio',s) else 'Declaración y facturación'
 if re.search('tarjeta|buro|score|meses-sin-intereses|linea-credito',s):
  if re.search('buro|score|linea-credito',s):return 'credito','Historial y capacidad de crédito'
  if re.search('pago|pagar|saldo|corte|intereses|meses-sin',s):return 'credito','Pagos y saldos de tarjetas'
  return 'credito','Elegir y utilizar tarjetas'
 if re.search('prestamo|credito|deuda|amortizacion|abono-capital|abonar-capital',s):return 'credito','Préstamos y pagos'
 if re.search('cetes|inversion|invertir|rendimiento|interes-compuesto|interes-simple|tasa-efectiva|inflacion|pagare',s):return 'inversion','CETES' if 'cetes' in s else 'Plazos, tasas y rendimientos'
 if re.search('cuenta-ahorro|cuenta-de-ahorro|cuentas-ahorro|donde-ahorrar',s):return 'ahorro','Elegir y usar una cuenta'
 if re.search('fondo|emergencia',s):return 'presupuesto','Reservas para imprevistos'
 if re.search('ahorr|ahorro|kakebo|sobres',s):return 'ahorro','Hábitos y metas de ahorro'
 if re.search('finanzas|presupuesto|gastos|dashboard|primer-sueldo|aumento-de-sueldo',s):return 'presupuesto','Presupuesto por periodo y objetivo' if 'presupuesto' in s else 'Organización y seguimiento'
 if re.search('margen|precio-venta|costo-unidad|punto-equilibrio|roi',s):return 'negocios','Costos y rentabilidad'
 if re.search('salario|sueldo|nomina|horas-extra|pago-quincenal|bono|comision',s):return 'nomina','Horas extra' if 'horas-extra' in s else 'Salario y recibo'
 return 'herramientas','Propinas y cuentas compartidas' if re.search('propina|reparto-cuenta',s) else 'Porcentajes, fechas y otros cálculos'
BRIDGES={'nomina':['impuestos','prestaciones'],'prestaciones':['nomina','retiro'],'impuestos':['nomina','inversion'],'ahorro':['presupuesto','inversion'],'presupuesto':['ahorro','credito'],'inversion':['ahorro','retiro'],'credito':['presupuesto','seguros'],'transferencias':['ahorro'],'seguros':['presupuesto','retiro'],'retiro':['inversion','prestaciones'],'negocios':['impuestos','presupuesto'],'herramientas':['negocios','presupuesto']}
SUBINTRO={
 'Aguinaldo':'Empieza por la fórmula y el tiempo trabajado; después consulta salario base, fecha de pago o impuestos según tu duda.',
 'Vacaciones y descanso':'Distingue los días de descanso del pago de prima vacacional. Las guías cubren antigüedad, disfrute y pago proporcional.',
 'Reparto de utilidades':'Comprende quién tiene derecho, cuándo se paga y cómo revisar días, salarios y límites del reparto.',
 'Cobro y documentos de terminación':'Prepara la revisión de conceptos y documentos antes de firmar o cobrar. Estas guías no sustituyen asesoría laboral.',
 'Terminación y seguridad social':'Jubilación, incapacidad e invalidez requieren distinguir el trámite de seguridad social de las prestaciones laborales pendientes.',
 'Despido e indemnización':'Identifica el motivo de terminación y distingue indemnización, liquidación y prestaciones pendientes antes de estimar montos.',
 'Finiquito y renuncia':'Revisa conceptos pendientes y proporcionalidad. Usa un ejemplo o la calculadora para contrastar el desglose de tu caso.',
 'Salario y recibo':'Convierte periodos de pago, distingue bruto de neto y revisa el salario integrado sin confundirlo con el sueldo recibido.',
 'Horas extra':'Consulta la jornada y el tipo de horas antes de estimar el pago; diferencia un escenario de cálculo del caso laboral concreto.',
 'ISR y nómina':'Ubica la tarifa y el periodo de ingreso; consulta por separado retenciones, subsidio y conceptos exentos cuando correspondan.',
 'Declaración y facturación':'El régimen y la actividad determinan obligaciones. Consulta el trámite y sus documentos antes de usar un cálculo orientativo.',
 'Elegir y usar una cuenta':'Compara costos, disponibilidad, acceso y condiciones del producto; después elige la guía que corresponde a tu uso.',
 'Hábitos y metas de ahorro':'Define cuánto necesitas y cuándo. Estas herramientas ayudan a convertir la meta en aportaciones que caben en tu presupuesto.',
 'Reservas para imprevistos':'Separa el dinero de emergencias de las metas y gastos previsibles. Revisa monto, liquidez y frecuencia de reposición.',
 'Organización y seguimiento':'Empieza por registrar movimientos; después utiliza balances, hojas de seguimiento o indicadores para entender el resultado.',
 'Presupuesto por periodo y objetivo':'Ajusta el presupuesto al momento en que recibes ingresos y a las obligaciones que debes cubrir durante el periodo.',
 'CETES':'Relaciona el plazo con tu meta y revisa escenarios de rendimiento. Ninguna tasa usada como ejemplo es una oferta garantizada.',
 'Plazos, tasas y rendimientos':'Compara capital, plazo y forma de cálculo. Distingue rendimiento nominal, inflación y disponibilidad antes de interpretar resultados.',
 'Vivienda e Infonavit':'Revisa requisitos, costos y obligaciones del crédito de vivienda; las guías explican escenarios y trámites específicos.',
 'Préstamos y pagos':'Compara mensualidad y costo total. Consulta cómo leer la amortización y qué verificar antes de adelantar o reestructurar pagos.',
 'Historial y capacidad de crédito':'Distingue historial, límite disponible y capacidad para pagar; estos conceptos responden preguntas diferentes.',
 'Pagos y saldos de tarjetas':'Ubica fecha de corte, vencimiento y tipo de pago. Después revisa intereses, saldos o alternativas de liquidación.',
 'Elegir y utilizar tarjetas':'Compara condiciones y uso previsto sin elegir solo por una promoción; consulta reglas y riesgos de cada operación.',
 'Datos, estados y seguimiento':'Primero identifica cuenta y datos de la operación. Si hay un problema, revisa estado, comprobante y ruta de aclaración.',
 'Coberturas y costos':'Entiende qué cubre el contrato y qué queda a tu cargo. Distingue prima, deducible y coaseguro al comparar.',
 'AFORE y pensiones':'Identifica institución, régimen y trámite. Consulta ahorro voluntario por separado de requisitos para pensión o retiro.',
 'Incapacidades y seguridad social':'Revisa el tipo de incapacidad y el trámite correspondiente antes de estimar días o pagos.',
 'Costos y rentabilidad':'Empieza por el costo y las unidades vendidas; distingue margen, utilidad y recuperación de la inversión.',
 'Propinas y cuentas compartidas':'Calcula un porcentaje o reparto y consulta las guías sobre propinas para interpretar el pago.',
 'Porcentajes, fechas y otros cálculos':'Selecciona la operación que necesitas y confirma unidades, fechas o base del porcentaje antes de interpretar el resultado.'}
def label(p):
 txt=Page((ROOT/p['served_file']).read_text(encoding='utf-8-sig'))
 raw=(ROOT/p['served_file']).read_text(encoding='utf-8-sig')
 m=re.search(r'<h1\b[^>]*>(.*?)</h1>',raw,re.S|re.I)
 return re.sub('<[^>]+>','',m.group(1)) if m else p['title'].split('|')[0].strip()
def hub_url(k):return '/temas/'+k+'.html'
def link(path,text):return '<a href="'+escape(path,quote=True)+'">'+escape(text)+'</a>'
def build():
 a=audit();pages=[p for p in a['pages'] if p['indexable'] and p['path'].startswith(('/articulos/','/calculadoras/'))]
 groups=defaultdict(list)
 for p in pages:p['cluster'],p['subtopic']=classify(p['path']);p['label']=label(p);groups[p['cluster']].append(p)
 changes={}; additions={}
 for k,(title,desc) in TOPICS.items():
  subs=defaultdict(list)
  for p in groups[k]:subs[p['subtopic']].append(p)
  sections=''
  for sub,ps in subs.items():
   sections+='<section class="content-box"><h2>'+escape(sub)+'</h2><p>'+escape(SUBINTRO[sub])+'</p>'
   for typ,heading in [('/calculadoras/','Herramientas'),('/articulos/','Guías y preguntas concretas')]:
    chosen=[p for p in ps if p['path'].startswith(typ)]
    if chosen:sections+='<h3>'+heading+'</h3><ul>'+''.join('<li>'+link(p['path'],p['label'])+'</li>' for p in chosen)+'</ul>'
   sections+='</section>'
  cross='<section class="content-box"><h2>Continúa con un tema relacionado</h2><p>'+ ' · '.join(link(hub_url(b),TOPICS[b][0]) for b in BRIDGES[k])+'</p></section>'
  schema={'@context':'https://schema.org','@type':'CollectionPage','name':title,'url':BASE+hub_url(k),'inLanguage':'es-MX'}
  additions['temas/'+k+'.html']='<!DOCTYPE html>\n<html lang="es-MX"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escape(title)+' | Calculadoras México</title><meta name="description" content="'+escape(desc,quote=True)+'"><meta name="robots" content="index,follow"><link rel="canonical" href="'+BASE+hub_url(k)+'"><link rel="icon" href="/assets/img/favicon.svg"><link rel="stylesheet" href="/styles-v5628.css?v=5.6.28"><link rel="stylesheet" href="/assets/css/interface-v570.css?v=5.7.0"><script type="application/ld+json">'+json.dumps(schema,ensure_ascii=False)+'</script></head><body class="cm-ui"><header class="site-header"><div class="header-inner container"><a class="brand" href="/"><img class="logo-img" src="/assets/img/logo.svg" width="190" height="50" alt="Calculadoras México"></a><nav class="main-nav" aria-label="Navegación principal"><a href="/calculadoras.html">Calculadoras</a><a href="/articulos.html">Guías</a></nav></div></header><main class="page-wrap"><nav class="breadcrumb" aria-label="Ruta">'+link('/','Inicio')+' / '+escape(title)+'</nav><div class="page-head"><h1>'+escape(title)+'</h1><p>'+escape(desc)+'</p></div>'+sections+cross+'</main><footer class="site-footer"><div class="container"><p>'+link('/acerca-de.html','Metodología y proyecto')+' · '+link('/contacto.html','Contacto')+' · '+link('/privacidad.html','Privacidad')+'</p></div></footer></body></html>\n'
 def insert(file,block):
  old=changes.get(file,(ROOT/file).read_text(encoding='utf-8-sig'))
  if block in old:changes[file]=old;return
  if '</main>' not in old:raise ValueError(file)
  changes[file]=old.replace('</main>',block+'</main>',1)
 home='<section class="section" id="temas"><div class="container"><div class="section-title"><h2>Explora herramientas y guías por tema</h2><p>Elige tu objetivo para encontrar los cálculos y explicaciones relacionados.</p></div><div class="grid">'+''.join('<article class="card"><h3>'+link(hub_url(k),t)+'</h3><p>'+escape(d)+'</p></article>' for k,(t,d) in TOPICS.items())+'</div></div></section>'
 insert('index.html',home)
 catalog='<section class="content-box" id="temas"><h2>Encuentra un tema y sus guías</h2><p>Estas categorías reúnen herramientas y explicaciones según lo que necesitas resolver.</p><ul>'+''.join('<li>'+link(hub_url(k),t)+'</li>' for k,(t,d) in TOPICS.items())+'</ul></section>'
 for file in ['articulos.html','calculadoras.html','simuladores.html']:insert(file,catalog)
 # Parent links are generated statically. Lateral links require multiple specific shared slug terms.
 stop={'como','que','para','con','por','cuanto','cuenta','calcular','calculo','diferencia','entre','pago','dias','mexico','2026','vs','html','sin','una','del','los','las','de','en','el','al','se','un','es','y','si','me','hacer','tengo','puedo','toca','ser','antes','despues'}
 def tokens(path):return set(path.rsplit('/',1)[-1].replace('.html','').split('-'))-stop
 for p in pages:
  file=p['served_file'];raw=changes.get(file,(ROOT/file).read_text(encoding='utf-8-sig'))
  if '<!-- ARCHITECTURE: contextual routes 2026-10-09 -->' in raw:
   changes[file]=raw
   if file!=p['file']:changes[p['file']]=(ROOT/p['file']).read_text(encoding='utf-8-sig')
   continue
  existing={x[0].split('#')[0] for x in Page(raw).links}
  ranked=[]
  for other in groups[p['cluster']]:
   shared=tokens(p['path'])&tokens(other['path'])
   if other['path']!=p['path'] and other['path'] not in existing and len(shared)>=2 and other['subtopic']==p['subtopic']:ranked.append((len(shared),other))
  ranked.sort(key=lambda x:(-x[0],x[1]['path']))
  nearby=[x[1] for x in ranked[:3]]
  block='<!-- ARCHITECTURE: contextual routes 2026-10-09 --><section class="content-box architecture-related" aria-label="Tema y lecturas relacionadas"><h2>Continúa según tu objetivo</h2><p>Para encontrar herramientas y explicaciones de este tema, consulta '+link(hub_url(p['cluster']),TOPICS[p['cluster']][0])+'.</p>'
  if nearby:block+='<p>Si necesitas profundizar en este caso:</p><ul>'+''.join('<li>'+link(x['path'],x['label'])+'</li>' for x in nearby)+'</ul>'
  block+='</section>'
  insert(file,block)
  # Also keep source article consistent when Vercel serves a fallback.
  if file!=p['file']:insert(p['file'],block)
 old=(ROOT/'sitemap.xml').read_text(encoding='utf-8-sig')
 new=''.join('<url><loc>'+BASE+hub_url(k)+'</loc><lastmod>2026-10-09</lastmod></url>\n' for k in TOPICS if '<loc>'+BASE+hub_url(k)+'</loc>' not in old)
 changes['sitemap.xml']=old.replace('</urlset>',new+'</urlset>')
 for file in additions:
  additions[file]=additions[file].replace('<body class="cm-ui">','<body class="cm-ui architecture-hub">').replace('</head>','<link rel="stylesheet" href="/assets/css/architecture-hubs.css"></head>')
 return changes,additions,pages
if __name__=='__main__':
 c,n,p=build()
 mode=sys.argv[1] if len(sys.argv)>1 else 'summary'
 if mode=='summary':print(json.dumps({'clusters':dict(__import__('collections').Counter(x['cluster'] for x in p)),'modified':list(c),'new':list(n)},ensure_ascii=False))
 elif mode=='patch':
  offset=int(sys.argv[2]);size=int(sys.argv[3]);items=list(c.items())+list(n.items());out='*** Begin Patch\n'
  for f,new in items[offset:offset+size]:
   if f in n:out+='*** Add File: '+f+'\n'+''.join('+'+line+'\n' for line in new.splitlines())
   else:
    old=(ROOT/f).read_text(encoding='utf-8-sig');a=old.splitlines();b=new.splitlines();out+='*** Update File: '+f+'\n'
    # Narrow each replacement to the actual changed line, not the entire document.
    import difflib
    for tag,i,j,k,l in difflib.SequenceMatcher(a=a,b=b,autojunk=False).get_opcodes():
     if tag=='equal':continue
     out+='@@\n'+''.join('-'+x+'\n' for x in a[i:j])+''.join('+'+x+'\n' for x in b[k:l])
  print(json.dumps(out+'*** End Patch',ensure_ascii=False))

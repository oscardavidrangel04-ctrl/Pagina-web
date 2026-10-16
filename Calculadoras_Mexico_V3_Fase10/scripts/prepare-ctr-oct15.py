"""Read-only patch generator. Emits a patch; never modifies the source files itself."""
import re,json,html,difflib
from pathlib import Path

# Editorial decisions from the supplied competitor samples and surviving keyword links.
# No search volumes are inferred from the empty Keyword Magic CSV exports.
DATA={
'salario-neto': dict(
 title='Calculadora de sueldo neto: bruto a neto en México',
 desc='Calcula tu sueldo neto con el ISR, IMSS y descuentos de tu recibo. Revisa el desglose y compáralo con tu depósito. Deducciones manuales, sin registro.',
 intro='Comprueba cuánto queda de tu sueldo bruto después de los descuentos y si coincide con tu depósito. Captura el ISR, IMSS y otras deducciones de tu recibo: esta calculadora no obtiene esas retenciones automáticamente.',
 heading='¿Tu depósito no coincide con el sueldo neto?',
 body='<p>Compara primero el mismo recibo y periodo. Un depósito puede reunir sueldo, un bono o un reembolso, mientras que dos transferencias pueden corresponder a una sola nómina. Esa diferencia no demuestra por sí sola un error.</p><ol><li>Captura las percepciones que vas a comprobar y los descuentos de ese recibo, sin mezclar una quincena con el mes completo.</li><li>Escribe el depósito en el campo opcional para ver la diferencia frente al neto calculado.</li><li>Si no coincide, revisa conceptos y pagos con nómina antes de atribuir la diferencia al ISR.</li></ol><p><strong>Ejemplo de comprobación:</strong> $18,000 brutos menos $2,100 de ISR, $450 de cuotas y $300 de otro descuento dejan $15,150. Son importes ilustrativos capturados, no retenciones calculadas para ese sueldo.</p>'),
'salario-bruto': dict(
 title='Sueldo neto a bruto: calculadora con tus deducciones',
 desc='Convierte sueldo neto a bruto sumando tus deducciones conocidas. Comprueba la fórmula y compara ofertas del mismo periodo. Gratis y sin registro.',
 intro='Reconstruye tu sueldo bruto sumando al neto las deducciones que ya conoces. Obtén el total y revisa el peso de los descuentos. No es una estimación automática de ISR ni una cotización de nómina.',
 heading='Cómo comparar una oferta neta con una bruta',
 body='<p>Antes de comparar dos ofertas, pide que ambas indiquen el periodo de pago y si el importe es bruto o neto. También separa el sueldo fijo de bonos condicionados, vales y otras prestaciones: no siempre se reciben juntos ni todos los meses.</p><p>Por ejemplo, $18,000 netos más $3,000 de deducciones conocidas reconstruyen $21,000 brutos del mismo periodo. No significa que cualquier oferta de $21,000 produzca ese neto: los descuentos pueden ser distintos.</p><p><strong>Si solo conoces el neto que quieres ganar, todavía falta un dato.</strong> No inventes las deducciones para completar el formulario. Solicita una simulación de nómina o revisa por separado la <a href="/calculadoras/isr.html">estimación del ISR</a>. Si conoces el bruto, utiliza la <a href="/calculadoras/salario-neto.html">conversión de bruto a neto con deducciones manuales</a>.</p>'),
'isr': dict(
 title='Calculadora ISR 2026: mensual, quincenal y semanal',
 desc='Estima el ISR de tu sueldo por mes, quincena o semana. Consulta cuota fija, excedente y tasa aplicada. No incluye IMSS ni subsidio al empleo.',
 intro='Calcula el ISR estimado de tu ingreso gravable mensual, quincenal o semanal y revisa cada paso: rango, cuota fija, excedente y tasa. El resultado no incluye subsidio al empleo, IMSS ni otros descuentos de nómina.',
 heading='Cómo leer el ISR sin confundirlo con todas tus deducciones',
 body='<p>Esta herramienta responde cuánto impuesto resulta de aplicar la tarifa al importe capturado. No responde por sí sola cuánto llegará a tu cuenta. La cifra que queda después del ISR aún puede cambiar por cuotas, otros descuentos, subsidios o ajustes.</p><ul><li><strong>Base:</strong> utiliza el ingreso gravable del periodo. Si tu recibo incluye percepciones exentas, no las sumes como si todas pagaran ISR.</li><li><strong>Tasa marginal:</strong> se aplica al excedente sobre el límite inferior, no a todo el sueldo.</li><li><strong>Tasa efectiva:</strong> compara el ISR calculado con el ingreso que capturaste.</li></ul><p>Una vez que tengas las deducciones de tu recibo, puedes <a href="/calculadoras/salario-neto.html">comprobar el sueldo neto y el depósito</a>. Para tablas y explicación por periodicidad, consulta la <a href="/articulos/isr-semanal-quincenal-mensual.html">guía de ISR semanal, quincenal y mensual</a>.</p>'),
'pago-quincenal': dict(
 title='Pago quincenal: calcula cuánto es tu sueldo por quincena',
 desc='Convierte tu sueldo mensual a pago quincenal y diario. Consulta ejemplos y la diferencia entre quincena y catorcena. Importe bruto, sin descontar ISR.',
 intro='¿Cuánto te corresponde por quincena? Introduce tu sueldo mensual bruto para obtener la mitad del mes y su referencia diaria. Es una conversión de salario: no descuenta ISR, IMSS ni determina la fecha de depósito.',
 heading='¿Por qué mi depósito quincenal es menor que la mitad del sueldo?',
 body='<p>Dividir el sueldo mensual entre dos da una referencia <strong>bruta</strong>. El depósito puede ser menor por retenciones y descuentos, o distinto por incidencias, bonos y ajustes. Compara el resultado con el salario del recibo antes de compararlo con la transferencia.</p><p>Con $18,000 mensuales, la referencia es $9,000 por quincena. Si el recibo registra $1,200 de deducciones, el neto de ese ejemplo sería $7,800. Los $1,200 son un supuesto, no una retención calculada por esta página.</p><p><strong>Quincena no significa cada dos semanas.</strong> Dos pagos por mes suman 24 al año; un calendario de pagos cada 14 días sigue otro ritmo. Confirma la periodicidad de tu contrato y usa los importes reales para <a href="/calculadoras/salario-neto.html">revisar tu neto</a>.</p>'),
'salario-diario': dict(
 title='Salario diario: calculadora de sueldo mensual o semanal',
 desc='Calcula cuánto ganas al día desde tu sueldo mensual, quincenal o semanal. Revisa el divisor y distingue salario diario, SDI y SBC. Sin registro.',
 intro='Convierte tu sueldo mensual, quincenal o semanal a una referencia diaria. Elige el periodo para usar el divisor correcto y ver la operación. El resultado no incorpora prestaciones ni equivale automáticamente al SDI o al SBC.',
 heading='Un mismo salario diario, tres formas de capturarlo',
 body='<p>Con una base comparable, $18,000 mensuales ÷ 30, $9,000 quincenales ÷ 15 y $4,200 semanales ÷ 7 dan la misma referencia: <strong>$600 diarios</strong>. Es una equivalencia aritmética, no una afirmación de que todas las nóminas se liquiden igual.</p><p>Un error frecuente es capturar $4,200 de una semana y dejar seleccionado “Mensual”: la calculadora lo dividiría entre 30 y mostraría $140. Revisa el periodo antes de usar el resultado para otra prestación.</p><p>Si necesitas una base que incluya prestaciones, continúa con la <a href="/calculadoras/salario-diario-integrado.html">calculadora de salario diario integrado</a>. Para saber cuánto vale una hora con tu jornada habitual, utiliza el <a href="/calculadoras/salario-hora.html">conversor de salario por hora</a>.</p>'),
'salario-hora': dict(
 title='Salario por hora: convierte tu sueldo y compara jornadas',
 desc='Convierte sueldo mensual, semanal o anual a pago por hora y viceversa. Ajusta tus horas por semana y compara importes. Gratis, sin registro.',
 intro='Descubre cuánto equivale tu sueldo por hora o qué sueldo mensual corresponde a una tarifa. Ajusta tus horas semanales y compara los periodos en un solo resultado. La conversión conserva la base bruta o neta del importe que captures.',
 heading='Compara ofertas con jornadas diferentes',
 body='<p>Dos ofertas con el mismo sueldo mensual no necesariamente pagan lo mismo por hora. Con la equivalencia de 52 semanas al año, $18,000 mensuales representan aproximadamente <strong>$103.85 por hora a 40 horas semanales</strong>, frente a <strong>$86.54 a 48 horas</strong>.</p><p>Para comparar, mantén la misma base en ambas ofertas: bruto con bruto o neto con neto. Después revisa prestaciones, descansos y condiciones por separado. Esta conversión no determina si una jornada es legal ni calcula recargos por horas extraordinarias.</p><p>Si conoces la tarifa, selecciona “Pago por hora” y conserva tus horas semanales: la herramienta hace la conversión inversa. Para un pago extraordinario, usa la <a href="/calculadoras/horas-extra.html">calculadora de horas extra</a>.</p>'),
'aguinaldo': dict(
 title='Calculadora de aguinaldo 2026: monto, ISR y proporcional',
 desc='¿Cuánto te toca de aguinaldo? Calcula por sueldo y días trabajados, revisa el desglose y estima ISR y neto en el módulo adicional. Gratis, sin registro.',
 intro='Calcula cuánto te toca de aguinaldo por tu sueldo y el tiempo trabajado en 2026. Obtén el monto bruto completo o proporcional; después puedes estimar ISR y neto en el módulo adicional. Sin registro.',
 heading='Qué comparar si ya recibiste tu aguinaldo',
 body='<p>Primero compara el aguinaldo bruto del recibo con el resultado principal. Después revisa por separado el ISR retenido y el depósito: un monto neto menor no significa, por sí solo, que falten días de aguinaldo.</p><p>Con $18,000 mensuales, 15 días de prestación y un año completo, la referencia bruta es $9,000. Si tu contrato reconoce 20 días, serían $12,000 bajo los mismos supuestos. La diferencia de $3,000 procede de la prestación, no de una tasa de impuesto.</p><p>Para un periodo parcial, usa fechas o días efectivamente considerados en el año. La antigüedad total en la empresa no debe confundirse con esa fracción anual. Consulta <a href="/articulos/aguinaldo-por-antiguedad.html">cómo influye la antigüedad en el aguinaldo</a> si llevas varios años trabajando.</p>'),
'aguinaldo-proporcional': dict(
 title='Aguinaldo proporcional: calculadora por días trabajados',
 desc='Calcula tu aguinaldo proporcional con salario diario y días trabajados. Consulta fórmula y ejemplo de 180 días. Resultado bruto, antes de ISR.',
 intro='¿No trabajaste el año completo? Captura tu salario diario, los días anuales de prestación y los días trabajados para calcular la parte proporcional. Esta herramienta usa una base de 365 días y muestra el monto bruto, sin ISR.',
 heading='180 días trabajados no siempre son medio año exacto',
 body='<p>Con $600 de salario diario y 15 días anuales de aguinaldo, la referencia completa es $9,000. Para 180 días: $9,000 × 180 ÷ 365 = <strong>$4,438.36 brutos</strong>. Dividir simplemente entre dos daría $4,500 y no representaría esa misma fracción.</p><p>Por eso conviene sustituir expresiones como “seis meses” por las fechas reales o los días correspondientes. Esta calculadora rápida solicita días; si necesitas contarlos por fecha, abre la <a href="/calculadoras/aguinaldo.html">calculadora de aguinaldo con fecha de inicio y fin</a>.</p><p>El proporcional se refiere al año que estás calculando, no a todos los años de antigüedad. Si el pago forma parte de una separación laboral, revisa también los demás conceptos del <a href="/calculadoras/finiquito.html">finiquito</a>.</p>'),
'finiquito': dict(
 title='Calculadora de finiquito 2026: cuánto te toca por renuncia',
 desc='Estima tu finiquito por renuncia: sueldo pendiente, aguinaldo, vacaciones y prima vacacional. Consulta cada concepto. Monto bruto, sin indemnización.',
 intro='Estima cuánto te toca de finiquito por los conceptos pendientes: sueldo, aguinaldo proporcional, vacaciones y prima vacacional. Revisa el desglose antes de comparar con tu recibo. No incluye ISR, indemnización ni prima de antigüedad.',
 heading='Qué datos necesitas para revisar tu finiquito por renuncia',
 body='<ul><li><strong>Último recibo:</strong> salario mensual y días de sueldo aún no pagados.</li><li><strong>Periodo del año:</strong> días considerados para el aguinaldo y días anuales reconocidos en tu prestación.</li><li><strong>Saldo de vacaciones:</strong> días pendientes, no todos los días que ya disfrutaste.</li><li><strong>Prima vacacional:</strong> porcentaje que corresponde a tu caso.</li></ul><p>Si algún concepto ya fue pagado, no lo cuentes otra vez. El formulario no resta anticipos automáticamente ni verifica los saldos de la empresa. Compara los conceptos uno por uno y pide una aclaración de cualquier diferencia.</p><p>Renunciar y ser despedido no son el mismo escenario. Para revisar indemnización, consulta la <a href="/calculadoras/liquidacion.html">simulación de liquidación laboral</a>; para identificar los conceptos pendientes, lee <a href="/articulos/que-incluye-finiquito.html">qué incluye el finiquito</a>.</p>'),
'liquidacion': dict(
 title='Calculadora de liquidación laboral: compara tu escenario',
 desc='Simula 90 días de salario, sueldo pendiente y 20 días por año cuando procedan. Revisa qué queda fuera. Referencia bruta, no una determinación legal.',
 intro='Simula una referencia de liquidación con 90 días de salario, sueldo pendiente y la opción de 20 días por año. Revisa primero qué conceptos proceden en tu caso: esta herramienta no determina derechos ni calcula toda la liquidación.',
 heading='Cómo comparar una propuesta sin sumar conceptos dos veces',
 body='<p>Pide que la propuesta separe indemnización, salarios pendientes, prestaciones, prima de antigüedad y retenciones. Un total sin desglose no permite saber qué se está pagando.</p><p>Esta simulación solo suma los conceptos indicados en el formulario. No incorpora aguinaldo, vacaciones, prima vacacional, prima de antigüedad ni ISR. Los 20 días por año son una opción de escenario, no un pago universal por cualquier separación.</p><p>Si comparas también el <a href="/calculadoras/finiquito.html">finiquito de prestaciones pendientes</a>, evita duplicar el sueldo pendiente en ambos totales. Confirma la base salarial aplicable y la procedencia de cada concepto con asesoría laboral antes de aceptar una cifra o firmar.</p>'),
'vacaciones': dict(
 title='Calculadora de vacaciones 2026: días por año y pago',
 desc='Consulta cuántos días de vacaciones te tocan por antigüedad. Calcula el salario del periodo y la prima vacacional por separado. México, sin registro.',
 intro='Consulta cuántos días de vacaciones te corresponden por años cumplidos y estima su pago con tu sueldo mensual. El resultado separa salario del periodo y prima vacacional; no todo el total es dinero adicional a tu nómina.',
 heading='Días de vacaciones y dinero adicional: dos resultados distintos',
 body='<p>Con un sueldo de $18,000 al mes, la referencia diaria es $600. Para 12 días, el salario del periodo es $7,200; una prima del 25% suma $1,800. El total de referencia sería $9,000 antes de retenciones, pero <strong>no son $9,000 extras sobre tu salario habitual</strong>: la prima es el componente adicional.</p><p>Captura años cumplidos, no el número del año que acabas de empezar. Para periodos incompletos por terminación de la relación laboral, revisa el saldo proporcional que corresponda en el <a href="/calculadoras/finiquito.html">cálculo de finiquito</a>.</p><p>La tabla mínima por antigüedad parte del artículo 76 de la <a href="https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf">Ley Federal del Trabajo</a>. Si tu contrato reconoce más días, esta referencia mínima no reemplaza esa prestación superior.</p>'),
'prima-vacacional': dict(
 title='Calculadora de prima vacacional: cuánto te toca al 25%',
 desc='Calcula tu prima vacacional con salario diario, días y porcentaje. Prueba 25% u otra prestación y distingue prima, pago de vacaciones e ISR.',
 intro='Calcula cuánto te toca de prima vacacional con tu salario diario, los días de vacaciones y el porcentaje de tu prestación. Puedes comparar el 25% con un porcentaje superior. El importe es bruto, antes de cualquier retención aplicable.',
 heading='¿El 25% se aplica al sueldo mensual completo?',
 body='<p>No necesariamente: la base de este cálculo es el salario correspondiente a los días de vacaciones capturados. Con $600 diarios y 14 días, la base es $8,400. Al 25%, la prima es <strong>$2,100</strong>; con una prestación del 40%, sería <strong>$3,360</strong>.</p><p>No sumes la prima al salario diario antes de volver a multiplicar: eso contaría el beneficio dos veces. Captura el salario ordinario, los días y el porcentaje en campos separados.</p><p>El artículo 80 de la <a href="https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf">Ley Federal del Trabajo</a> establece una prima mínima del 25%. Esta herramienta no calcula la retención fiscal: para esa diferencia consulta <a href="/articulos/isr-prima-vacacional.html">ISR sobre la prima vacacional</a>.</p>'),
}

def plain(s):return html.unescape(re.sub('<[^>]+>',' ',s)).strip()
def patch_file(path,before,after):
 if before==after:return ''
 diff=list(difflib.unified_diff(before.splitlines(),after.splitlines(),n=2,lineterm=''))
 diff=['@@' if line.startswith('@@') else line for line in diff]
 return '*** Update File: '+path+'\n'+'\n'.join(diff[2:])+'\n'

patch='*** Begin Patch\n';report=[]
for slug,d in DATA.items():
 path='calculadoras/'+slug+'.html';before=Path(path).read_text(encoding='utf-8');s=before
 if 'data-ctr-review="20261015"' in s:continue
 old_title=plain(re.search(r'<title>(.*?)</title>',s,re.S)[1])
 s=re.sub(r'<title>.*?</title>','<title>'+html.escape(d['title'])+'</title>',s,count=1,flags=re.S)
 def meta(m):
  tag=m[0]
  match=re.search(r'(?:name|property)="([^"]+)"',tag)
  if match and match[1] in ('description','og:description','twitter:description','og:title','twitter:title'):
   value=d['title'] if match[1].endswith(':title') else d['desc']
   tag=re.sub(r'content="[^"]*"','content="'+html.escape(value,quote=True)+'"',tag)
  return tag
 s=re.sub(r'<meta\b[^>]*>',meta,s)
 def header(m):
  h=re.sub(r'<p(?:\s[^>]*)?>.*?</p>','<p>'+d['intro']+'</p>',m[0],count=1,flags=re.S)
  return h.replace('>Ir a la calculadora<','>Calcular ahora<')
 s=re.sub(r'<header class="page-head[^>]*>.*?</header>',header,s,count=1,flags=re.S)
 # Replace keyword-stuffed intent boilerplate, not useful guides or existing anchors.
 block='<section class="content-box" data-ctr-review="20261015"><h2>'+d['heading']+'</h2>'+d['body']+'</section>'
 pattern=r'<section\b[^>]*class="[^"]*semantic-intent[^>]*>.*?</section>'
 if re.search(pattern,s,re.S):s=re.sub(pattern,lambda m:block,s,count=1,flags=re.S)
 else:
  # Enrich an existing guide rather than introducing more top-level headings.
  section=re.search(r'<section\b[^>]*class="[^"]*content-box[^>]*>.*?</section>',s,re.S)
  assert section,slug
  extra='<div data-ctr-review="20261015"><h3>'+d['heading']+'</h3>'+d['body']+'</div>'
  s=s[:section.end()-10]+extra+s[section.end()-10:]
 removed=[0]
 def trim_faq(m):
  q=re.search(r'<summary[^>]*>(.*?)</summary>',m[0],re.S)
  question=plain(q[1]) if q else ''
  generic=('Calculadora de ' in question or question in ['¿Puedo usar el resultado como cifra definitiva?','¿Por qué conviene revisar el desglose?','¿Se guardan mis datos en un servidor?'])
  if generic:removed[0]+=1;return ''
  return m[0]
 # Preserve specialized FAQ sets on the three already-refined calculator pages.
 if slug not in ('salario-neto','salario-hora','aguinaldo'):
  s=re.sub(r'<details\b[^>]*>.*?</details>',trim_faq,s,flags=re.S)
 s=re.sub(r'<p class="semantic-note">.*?</p>','',s,flags=re.S)
 # FAQ schema mirrors surviving visible questions. Preserve independent page graphs.
 questions=[]
 for detail in re.findall(r'<details\b[^>]*>.*?</details>',s,re.S):
  q=re.search(r'<summary[^>]*>(.*?)</summary>',detail,re.S)
  a=re.search(r'</summary>(.*?)</details>',detail,re.S)
  if q and a:questions.append({'@type':'Question','name':plain(q[1]),'acceptedAnswer':{'@type':'Answer','text':plain(a[1])}})
 def schema(m):
  val=json.loads(m[2])
  def visit(v):
   if isinstance(v,list):
    for item in v:visit(item)
   elif isinstance(v,dict):
    typ=v.get('@type')
    if typ in ('WebPage','WebApplication','SoftwareApplication'):
     v['name']=d['title'];v['description']=d['desc']
     if 'dateModified' in v:v['dateModified']='2026-10-15'
    if typ=='FAQPage' and removed[0]:v['mainEntity']=questions
    for k,x in v.items():
     if k!='mainEntity':visit(x)
  visit(val)
  return m[1]+json.dumps(val,ensure_ascii=False,separators=(',',':'))+m[3]
 s=re.sub(r'(<script\b[^>]*type="application/ld\+json"[^>]*>)(.*?)(</script>)',schema,s,flags=re.S)
 patch+=patch_file(path,before,s)
 report.append({'url':'/'+path,'before':old_title,'after':d['title'],'description':d['desc'],'removed_generic_faq':removed[0]})

for name in ('sitemap.xml','sitemap-seo-2026.xml'):
 before=Path(name).read_text(encoding='utf-8');s=before
 for slug in DATA:
  pattern=r'(<url>\s*<loc>https://calculadora-isr-mexico.vercel.app/calculadoras/'+re.escape(slug)+r'\.html</loc>.*?<lastmod>)[^<]*(</lastmod>)'
  s=re.sub(pattern,lambda m:m[1]+'2026-10-15'+m[2],s,flags=re.S)
 patch+=patch_file(name,before,s)
if report:
 path='outputs/CTR_2026-10-15_cambios.json'
 if not Path(path).exists():patch+='*** Add File: '+path+'\n'+'\n'.join('+'+x for x in json.dumps(report,ensure_ascii=False,indent=2).splitlines())+'\n'
print(patch+'*** End Patch')

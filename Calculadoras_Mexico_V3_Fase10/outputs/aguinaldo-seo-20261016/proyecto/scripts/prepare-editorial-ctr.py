"""Generate an apply_patch patch for the served article files. Read-only."""
import re,json,html,difflib
from pathlib import Path
DATA={
'salario-bruto-neto': (
'Sueldo bruto y neto: diferencias y ejemplo de nómina',
'¿Te ofrecen sueldo bruto o neto? Aprende la diferencia, revisa un ejemplo con descuentos y compara ofertas sin confundir salario con depósito.',
'El sueldo bruto es el importe antes de deducciones; el neto es lo que queda después. Para comparar una oferta o revisar tu nómina, necesitas el mismo periodo y los descuentos reales: no hay un porcentaje único que sirva para todos.',
'Cómo comparar una oferta de $20,000 brutos con $18,000 netos',
'<p>No puedes decidir cuál ofrece más dinero disponible solo con esas dos cifras. Primero pregunta si ambas son mensuales, qué prestaciones incluyen y si el neto es garantizado o una estimación.</p><p>Si en la primera oferta las deducciones del periodo fueran $2,700, quedarían $17,300 netos. Con descuentos de $1,600, quedarían $18,400. Son dos supuestos ilustrativos, no retenciones fiscales calculadas para ese sueldo: muestran por qué hace falta conocer las deducciones antes de comparar.</p><p>Separa también bonos sujetos a metas y prestaciones que no se depositan en efectivo. Con los importes de un recibo puedes <a href="/calculadoras/salario-neto.html">comprobar el sueldo neto con deducciones manuales</a>. Si solo buscas entender cada descuento, continúa con la <a href="/articulos/descuentos-nomina-isr-imss.html">guía de ISR, IMSS y otras deducciones</a>.</p>'),
'descuentos-nomina-isr-imss': (
'Descuentos de nómina: cómo revisar ISR, IMSS y tu depósito',
'Identifica ISR, IMSS y otros descuentos de tu nómina. Sigue una lista de revisión para comparar recibos y explicar diferencias en tu depósito.',
'Los descuentos de nómina no son todos impuestos. Distingue ISR, cuotas de seguridad social y otros conceptos antes de comparar tu sueldo bruto con el depósito. Esta guía te ayuda a revisar el recibo, no a asumir un porcentaje de descuento.',
'Qué pedir cuando aparece un descuento que no reconoces',
'<ol><li>Anota el nombre del concepto, su importe y el periodo del recibo. Guarda el CFDI y el comprobante de depósito.</li><li>Solicita a nómina la base de cálculo y el motivo: puede tratarse de una retención, un crédito, un anticipo o un ajuste, y cada caso requiere una explicación diferente.</li><li>Compara con el recibo anterior sin mezclar bonos, pagos extraordinarios ni periodos de distinta duración.</li><li>Si persiste la diferencia, pide una aclaración por escrito y conserva la respuesta.</li></ol><p>Que un descuento aparezca en el recibo no demuestra por sí solo que sea correcto o permitido. Tampoco una diferencia entre depósitos demuestra un error: revisa percepciones y deducciones por separado. Puedes usar la <a href="/calculadoras/salario-neto.html">calculadora de neto</a> como comprobación aritmética; no valida la procedencia jurídica del descuento.</p>'),
'convertir-salario-mensual-diario-hora': (
'Sueldo mensual a diario y por hora: fórmulas y ejemplos',
'Convierte sueldo mensual a diario, quincenal y por hora. Compara las fórmulas de jornada diaria y horas semanales para no mezclar resultados.',
'Para convertir sueldo mensual a diario se usa una referencia de 30 días; para la quincena, la mitad del mes. El valor por hora depende además del método y la jornada. Aquí verás cuándo dos resultados diferentes pueden ser correctos bajo supuestos distintos.',
'Por qué $15,000 al mes pueden dar $62.50 o $72.12 por hora',
'<p><strong>Referencia por jornada:</strong> $15,000 ÷ 30 = $500 diarios; al dividir entre 8 horas, el resultado es $62.50 por hora. Es la referencia diaria de la tabla de esta guía.</p><p><strong>Equivalencia anual por horas semanales:</strong> con 48 horas por semana, $15,000 × 12 ÷ (52 × 48) = $72.12 por hora, aproximadamente. Este es el método de la <a href="/calculadoras/salario-hora.html">calculadora de salario por hora</a>, que distribuye el sueldo anual entre las horas semanales declaradas.</p><p>No mezcles ambos divisores ni uses uno como prueba automática de un pago incorrecto. Para comparar ofertas, aplica el mismo método y la misma base salarial a las dos. Para horas extraordinarias o una reclamación laboral, revisa las reglas y la base que correspondan al caso.</p>'),
'isr-semanal-quincenal-mensual': (
'ISR 2026: qué tabla usar según tu periodo de nómina',
'Elige la tabla ISR 2026 semanal, quincenal o mensual. Aprende a identificar el ingreso gravable y evita dividir el impuesto mensual para estimar tu nómina.',
'La tabla ISR y el ingreso deben corresponder al mismo periodo: semana, quincena o mes. Revisa primero la base gravada del recibo; después identifica el rango, la cuota fija y la tasa. No conviertas el impuesto mensual dividiéndolo entre dos o cuatro.',
'Tres comprobaciones antes de comparar el ISR de dos recibos',
'<ol><li><strong>Mismo periodo:</strong> confirma las fechas de pago y la duración de cada recibo. No compares una semana con un mes completo.</li><li><strong>Misma base:</strong> separa las percepciones gravadas de las exentas. Un bono puede cambiar la base aunque el salario fijo no haya aumentado.</li><li><strong>Mismo alcance:</strong> distingue el impuesto de la tarifa de otros efectos de nómina, como subsidios y ajustes.</li></ol><p>La <a href="/calculadoras/isr.html">calculadora de ISR por periodo</a> muestra la aplicación de la tarifa y sus pasos. No incorpora subsidio al empleo, IMSS ni todos los ajustes del recibo. Por eso su resultado debe compararse con los conceptos equivalentes, no con la suma de todas tus deducciones.</p>'),
'como-calcular-aguinaldo': (
'Cómo calcular el aguinaldo: fórmula y ejemplo paso a paso',
'Aprende a calcular el aguinaldo completo y proporcional con salario diario, días de prestación y tiempo trabajado. Ejemplo explicado antes de ISR.',
'Para calcular el aguinaldo completo, multiplica tu salario diario por los días anuales de prestación. Si trabajaste solo parte del año, aplica la proporción del tiempo trabajado. El resultado es bruto: no equivale necesariamente al depósito después de ISR.',
'Ejemplo completo: del sueldo mensual al aguinaldo bruto',
'<p>Supón un sueldo fijo mensual de $16,800, 15 días de prestación y un año completo trabajado:</p><ol><li>Referencia diaria: $16,800 ÷ 30 = <strong>$560</strong>.</li><li>Aguinaldo completo: $560 × 15 = <strong>$8,400 brutos</strong>.</li><li>Si el contrato reconoce 20 días, cambia solo ese dato: $560 × 20 = <strong>$11,200 brutos</strong>.</li></ol><p>No restes un porcentaje de ISR inventado para convertir esas cifras en neto. Tampoco uses el salario mensual como si fuera diario. Para otro tiempo trabajado, consulta la <a href="/articulos/aguinaldo-proporcional.html">fórmula del aguinaldo proporcional</a>; para introducir tu sueldo y fechas, abre la <a href="/calculadoras/aguinaldo.html">calculadora de aguinaldo</a>.</p>'),
'aguinaldo-proporcional': (
'Cómo calcular el aguinaldo proporcional por días trabajados',
'Calcula la parte proporcional del aguinaldo paso a paso. Revisa por qué los meses aproximados no sustituyen las fechas y distingue importe bruto de neto.',
'El aguinaldo proporcional es la fracción generada cuando no trabajaste todo el año. Para una base de 365 días, multiplica salario diario × días anuales de aguinaldo × días trabajados ÷ 365. Usa el periodo del año, no toda tu antigüedad.',
'Tres meses aproximados frente a las fechas reales',
'<p>Con $500 diarios y 15 días anuales de prestación, 90 días computables dan $500 × 15 × 90 ÷ 365 = <strong>$1,849.32 brutos</strong>. Si las fechas del periodo suman 92 días computables, la referencia sería <strong>$1,890.41</strong>. La diferencia de $41.09 proviene de dos días más, no de cambiar el porcentaje del beneficio.</p><p>Por eso “trabajé tres meses” no basta para cerrar el cálculo. Confirma las fechas y qué días deben considerarse; una ausencia o incapacidad puede necesitar una revisión específica, no una resta automática.</p><p>Si ya conoces los días, usa el <a href="/calculadoras/aguinaldo-proporcional.html">cálculo proporcional rápido</a>. Si necesitas introducir fechas, utiliza la <a href="/calculadoras/aguinaldo.html">calculadora con inicio y fin del periodo</a>.</p>'),
'aguinaldo-por-antiguedad': (
'Aguinaldo por antigüedad: cuánto toca por 1, 2 o más años',
'¿El aguinaldo aumenta por antigüedad? Compara 1, 2 o más años, distingue días de prestación y meses trabajados y revisa qué cambia por contrato.',
'Tener dos o más años en la empresa no multiplica automáticamente el aguinaldo anual. La antigüedad, los días de prestación que reconoce tu contrato y el tiempo trabajado en el año son datos distintos. Separarlos evita calcular de más o de menos.',
'Misma antigüedad no significa el mismo aguinaldo',
'<p>Piensa en dos personas con dos años de antigüedad, salario diario de $550 y el año completo trabajado. Si una tiene 15 días de prestación y la otra 20 por contrato, sus referencias son <strong>$8,250 y $11,000 brutos</strong>. La diferencia se debe a la prestación pactada, no a los dos años por sí solos.</p><p>Ahora cambia solo el tiempo trabajado en el año: quien termine la relación antes de completar el periodo necesita revisar la proporción correspondiente. No debe multiplicar el aguinaldo de ese año por todos sus años en la empresa.</p><p>Busca en tu contrato cuántos días anuales te reconocen y luego captura ese dato en la <a href="/calculadoras/aguinaldo.html">calculadora de aguinaldo</a>. Si la duda es por meses, consulta <a href="/articulos/aguinaldo-por-meses.html">aguinaldo por tiempo trabajado</a>.</p>'),
'que-es-el-finiquito': (
'Qué es el finiquito: cuándo te toca y cómo revisarlo',
'Entiende qué es el finiquito en México, cuándo corresponde y cómo distinguirlo de una liquidación. Revisa conceptos, pagos previos y documentos.',
'El finiquito es el pago de salarios y prestaciones pendientes al terminar una relación laboral. No es una cantidad fija por año ni es sinónimo de indemnización por despido. Para saber cuánto corresponde hay que revisar conceptos, fechas y pagos previos.',
'La palabra finiquito no explica por sí sola el total',
'<p>En una conversación, “finiquito” puede referirse al pago final o al documento que presenta su desglose. Para revisar una propuesta, pide que se distingan ambos: qué cantidades incluye y qué declara el documento que te solicitan firmar.</p><p>Por ejemplo, un recibo puede listar sueldo pendiente, aguinaldo, vacaciones y prima, pero el total cambia si alguno de esos conceptos ya fue pagado. El nombre del documento no sustituye esa comprobación ni resuelve una diferencia entre las partes.</p><p>Esta guía explica el concepto. Para comprobar partidas, continúa con <a href="/articulos/que-incluye-finiquito.html">qué incluye un finiquito</a>; para estimar importes con datos conocidos, usa la <a href="/calculadoras/finiquito.html">calculadora de prestaciones pendientes</a>. Ante una controversia, solicita orientación laboral.</p>'),
'que-incluye-finiquito': (
'Qué incluye el finiquito: conceptos y pagos pendientes',
'Revisa sueldo pendiente, aguinaldo, vacaciones y prima en tu finiquito. Aprende a descontar pagos previos del desglose sin duplicar prestaciones.',
'El finiquito puede incluir sueldo pendiente, aguinaldo proporcional, vacaciones, prima vacacional y otras prestaciones generadas que no se hayan cubierto. Para revisar el total, identifica cuánto se generó, cuánto se pagó y qué saldo queda en cada concepto.',
'Generado, pagado y pendiente: una forma de ordenar el desglose',
'<p>No sumes solo las cantidades generadas: primero comprueba qué parte ya recibiste. Si el aguinaldo proporcional de un ejemplo es $3,600 y existe un anticipo comprobado de $1,000 del mismo concepto y periodo, el saldo ilustrativo sería $2,600.</p><p>La misma revisión debe hacerse con cada partida, sin usar un pago de sueldo como si fuera anticipo de vacaciones. Pide que los abonos estén identificados con fecha, importe y concepto. Si no reconoces un descuento, solicita su explicación antes de darlo por correcto.</p><p>La <a href="/calculadoras/finiquito.html">calculadora de finiquito</a> no resta anticipos automáticamente. Úsala para contrastar las partidas básicas y revisa los pagos previos por separado. Para entender por qué una indemnización es distinta, consulta <a href="/articulos/finiquito-vs-liquidacion.html">finiquito frente a liquidación</a>.</p>'),
'finiquito-vs-liquidacion': (
'Finiquito o liquidación: diferencias al renunciar o salir',
'Compara finiquito y liquidación en México. Identifica prestaciones pendientes, indemnización y conceptos que no deben sumarse automáticamente.',
'El finiquito cubre cantidades ya generadas y pendientes; una liquidación puede incluir indemnizaciones cuando procedan. No se elige uno u otro por el nombre del documento: importa la causa de salida y el desglose de los conceptos.',
'Cómo comparar dos propuestas con nombres distintos',
'<p>Si una propuesta dice “finiquito” y otra “liquidación”, ordénalas por concepto antes de comparar los totales:</p><ul><li>Salarios y prestaciones pendientes: identifica qué se generó y qué ya fue pagado.</li><li>Indemnizaciones: pide que se explique por qué se incluyen y con qué base se calcularon.</li><li>Prima de antigüedad y otros conceptos: revisa su procedencia por separado, sin añadirlos automáticamente.</li><li>Retenciones y descuentos: distingue total bruto de importe a recibir.</li></ul><p>Los 20 días por año no son una cantidad universal que deba agregarse a toda salida laboral. Una simulación numérica no sustituye la revisión de la causa de terminación. Puedes consultar por separado el <a href="/calculadoras/finiquito.html">finiquito estimado</a> y la <a href="/calculadoras/liquidacion.html">simulación de liquidación</a>, evitando sumar dos veces el sueldo pendiente.</p>'),
'finiquito-renuncia-voluntaria': (
'Finiquito por renuncia: qué te pagan y cómo revisarlo',
'Si renuncias, revisa sueldo y prestaciones pendientes. Consulta un ejemplo de finiquito, pagos previos y diferencias frente a la indemnización.',
'Renunciar no elimina el sueldo ni las prestaciones que ya generaste y siguen pendientes. El finiquito depende de tu salario, fecha de salida y saldos; no se obtiene multiplicando una cifra fija por cada año trabajado.',
'Qué preparar antes de revisar el pago por renuncia',
'<ol><li>La fecha de ingreso y la fecha efectiva de salida, no solo la fecha en que avisaste que renunciarías.</li><li>Los recibos recientes y comprobantes de pagos de sueldo o anticipos.</li><li>El saldo de vacaciones, los días disfrutados y la prima ya cubierta.</li><li>El contrato o documento que describa prestaciones superiores, si existen.</li></ol><p>Con esos datos, compara cada partida con la propuesta de la empresa. Si una cantidad no coincide, pide el cálculo y el periodo que utilizaron; una diferencia puede surgir de un saldo o fecha incorrectos, no solo de la fórmula.</p><p>Para revisar importes, utiliza la <a href="/calculadoras/finiquito.html">calculadora de finiquito</a>. Si el problema es que no se ha pagado, sigue la guía de <a href="/articulos/cuando-pagan-finiquito.html">cuándo pagan el finiquito</a>, sin confundir ese plazo con los requisitos para reclamar.</p>'),
'vacaciones-mexico': (
'Vacaciones en México: días por antigüedad, pago y prima',
'Revisa tus vacaciones por años cumplidos y distingue días de descanso, salario del periodo y prima vacacional. Guía laboral de México con ejemplo.',
'Las vacaciones combinan días de descanso pagado y una prima adicional. La referencia mínima general parte de 12 días laborables al cumplir el primer año; los días aumentan con la antigüedad. No confundas el valor del periodo con dinero extra sobre tu sueldo habitual.',
'Cómo revisar una solicitud y un recibo de vacaciones',
'<p>La solicitud se revisa en días; el recibo, en dinero. Antes de comparar, confirma tus años cumplidos, los días ya disfrutados, el saldo disponible y las condiciones de tu contrato.</p><p>Con $480 diarios y 14 días, el salario del periodo de vacaciones sería $6,720. Una prima del 25% agrega $1,680. La suma de referencia es $8,400 brutos, pero no representa $8,400 adicionales al salario ordinario: la prima es el componente extra de este ejemplo.</p><p>Para localizar los días por antigüedad, consulta la <a href="/articulos/dias-vacaciones-por-antiguedad-2026.html">tabla de vacaciones</a>; para revisar cómo se cuentan en tu calendario, lee <a href="/articulos/como-se-cuentan-dias-vacaciones.html">cómo contar los días de descanso</a>. La <a href="/calculadoras/vacaciones.html">calculadora de vacaciones</a> estima los importes, pero no conoce el saldo registrado por tu empresa.</p>'),
'como-calcular-prima-vacacional': (
'Cómo calcular la prima vacacional: fórmula del 25% y ejemplo',
'Calcula la prima vacacional paso a paso: salario diario, días y porcentaje. Comprueba un ejemplo al 25% y distingue la prima del sueldo de vacaciones.',
'La prima vacacional se calcula multiplicando salario diario × días de vacaciones × porcentaje de prima. El mínimo general es 25%; si tu contrato reconoce más, utiliza ese porcentaje. El resultado es la prima bruta, no todo el pago de vacaciones.',
'Ejemplo desde el sueldo mensual, sin contar dos veces la prima',
'<p>Supón $14,400 de sueldo mensual fijo, 12 días de vacaciones y una prima del 25%:</p><ol><li>Salario diario de referencia: $14,400 ÷ 30 = <strong>$480</strong>.</li><li>Salario de los días de vacaciones: $480 × 12 = <strong>$5,760</strong>.</li><li>Prima: $5,760 × 0.25 = <strong>$1,440 brutos</strong>.</li></ol><p>El sueldo de esos días y la prima no son el mismo concepto. No multipliques $14,400 por 25% salvo que esa cantidad sea realmente la base correspondiente al periodo vacacional que revisas.</p><p>Comprueba los datos en la <a href="/calculadoras/prima-vacacional.html">calculadora de prima vacacional</a>. Para interpretar lo recibido después de retenciones, consulta <a href="/articulos/isr-prima-vacacional.html">el tratamiento del ISR de la prima</a>, en lugar de restar un porcentaje fiscal arbitrario.</p>'),
}

cfg=json.loads(Path('vercel.json').read_text(encoding='utf-8-sig'));rw={r['source']:r['destination'] for r in cfg['rewrites']}
def text(s):return html.unescape(re.sub('<[^>]+>',' ',s)).strip()
def diff(path,before,after):
 if before==after:return ''
 lines=list(difflib.unified_diff(before.splitlines(),after.splitlines(),n=1,lineterm=''))[2:]
 return '*** Update File: '+path+'\n'+'\n'.join('@@' if l.startswith('@@') else l for l in lines)+'\n'
patch='*** Begin Patch\n';log=[]
for slug,(title,desc,intro,heading,body) in DATA.items():
 url='/articulos/'+slug+'.html';path=rw.get(url,url).lstrip('/');before=Path(path).read_text(encoding='utf8');s=before
 if 'data-editorial-ctr="20261015"' in s:continue
 old=text(re.search('<title>(.*?)</title>',s,re.S)[1]);s=re.sub('<title>.*?</title>','<title>'+html.escape(title)+'</title>',s,count=1,flags=re.S)
 def meta(m):
  tag=m[0];key=re.search(r'(?:name|property)="([^"]+)"',tag)
  if key and key[1] in ('description','og:description','twitter:description','og:title','twitter:title'):
   value=title if key[1].endswith(':title') else desc
   return re.sub('content="[^"]*"','content="'+html.escape(value,quote=True)+'"',tag)
  return tag
 s=re.sub(r'<meta\b[^>]*>',meta,s)
 s=re.sub(r'<header class="page-head[^>]*>.*?</header>',lambda m:re.sub(r'<p(?:\s[^>]*)?>.*?</p>','<p>'+intro+'</p>',m[0],count=1,flags=re.S),s,count=1,flags=re.S)
 article=re.search(r'<article\b[^>]*>',s);assert article,slug
 toc=re.search(r'<(nav|div)\b[^>]*class="[^"]*\btoc\b[^"]*"[^>]*>.*?</\1>',s[article.end():],re.S)
 block='<section class="content-box" id="caso-practico-revisado" data-editorial-ctr="20261015"><h2>'+heading+'</h2>'+body+'</section>'
 if toc:pos=article.end()+toc.end()
 else:
  firstp=re.search(r'<p\b[^>]*>.*?</p>',s[article.end():],re.S)
  pos=article.end()+(firstp.end() if firstp else 0)
 s=s[:pos]+block+s[pos:]
 # Keep the original publication date; update only an actual modification label.
 s=re.sub(r'Actualizado el \d{1,2} de [a-záéíóú]+ de \d{4}','Actualizado el 15 de octubre de 2026',s)
 if 'Actualizado el 15 de octubre de 2026' not in s:
  s=s.replace(block,block.replace('</section>','<p><small>Revisión de esta guía: 15 de octubre de 2026.</small></p></section>'),1)
 def schema(m):
  data=json.loads(m[2])
  def walk(v):
   if isinstance(v,list):
    for item in v:walk(item)
   elif isinstance(v,dict):
    if v.get('@type') in ('Article','BlogPosting','WebPage'):
     if 'headline' in v:v['headline']=title
     if 'name' in v:v['name']=title
     v['description']=desc;v['dateModified']='2026-10-15'
    for child in v.values():
     if isinstance(child,(dict,list)):walk(child)
  walk(data);return m[1]+json.dumps(data,ensure_ascii=False,separators=(',',':'))+m[3]
 s=re.sub(r'(<script\b[^>]*type="application/ld\+json"[^>]*>)(.*?)(</script>)',schema,s,flags=re.S)
 patch+=diff(path,before,s);log.append({'url':url,'file':path,'old_title':old,'title':title,'description':desc,'new_section':heading})
for name in ('sitemap.xml','sitemap-seo-2026.xml'):
 before=Path(name).read_text(encoding='utf8');s=before
 for slug in DATA:
  pattern=r'(<url>\s*<loc>https://calculadora-isr-mexico.vercel.app/articulos/'+re.escape(slug)+r'\.html</loc>.*?<lastmod>)[^<]*(</lastmod>)'
  s=re.sub(pattern,lambda m:m[1]+'2026-10-15'+m[2],s,flags=re.S)
 patch+=diff(name,before,s)
if log:
 patch+='*** Add File: outputs/CTR_ARTICULOS_2026-10-15.json\n'+'\n'.join('+'+line for line in json.dumps(log,ensure_ascii=False,indent=2).splitlines())+'\n'
print(patch+'*** End Patch')

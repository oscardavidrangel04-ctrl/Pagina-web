"""Generate reviewable patches for topic navigation; no direct file writes."""
import difflib, json, re, sys, unicodedata
from html import escape
from plan_architecture import build, TOPICS, TOPIC_OVERRIDES, ROOT, BASE, link

# Each route states a concrete purpose and points to an existing resource.
ROUTES = {
 'nomina': [
  ('Comprobar lo que recibes','Contrasta el bruto con los descuentos del mismo recibo.','/calculadoras/salario-neto.html','Calcular sueldo neto','/articulos/leer-recibo-nomina.html','Entender el recibo de nómina'),
  ('Convertir tu sueldo','Elige la frecuencia del pago antes de comparar cantidades.','/calculadoras/pago-quincenal.html','Calcular pago quincenal','/articulos/convertir-salario-mensual-diario-hora.html','Ver conversiones de sueldo'),
  ('Integrar prestaciones','Distingue el salario diario del integrado y del SBC.','/calculadoras/salario-diario-integrado.html','Calcular SDI','/articulos/que-es-salario-base-cotizacion.html','Entender el SBC')],
 'prestaciones': [
  ('Revisar tu aguinaldo','Consulta el tiempo trabajado y los días de prestación.','/calculadoras/aguinaldo.html','Calcular aguinaldo','/articulos/con-que-salario-se-calcula-aguinaldo.html','Elegir el salario de cálculo'),
  ('Terminar una relación laboral','Separa conceptos pendientes del motivo de terminación.','/calculadoras/finiquito.html','Estimar finiquito','/articulos/finiquito-vs-liquidacion.html','Distinguir finiquito y liquidación'),
  ('Consultar tus vacaciones','Revisa días de descanso y prima por separado.','/calculadoras/vacaciones.html','Consultar días de vacaciones','/articulos/como-calcular-prima-vacacional.html','Entender la prima vacacional'),
  ('Revisar utilidades','Empieza por el derecho a participar y los datos del reparto.','/calculadoras/ptu.html','Estimar PTU','/articulos/que-es-ptu.html','Entender el reparto de utilidades')],
 'impuestos': [
  ('Revisar ISR de nómina','Usa una tarifa que corresponda al periodo pagado.','/calculadoras/isr.html','Calcular ISR','/articulos/isr-semanal-quincenal-mensual.html','Elegir la tarifa por periodo'),
  ('Separar IVA de un precio','Distingue un precio antes de IVA de un total que ya lo incluye.','/calculadoras/iva-incluido.html','Desglosar IVA incluido','/calculadoras/iva.html','Agregar IVA a una base'),
  ('Preparar documentación fiscal','Ubica el trámite y los datos que necesitas revisar.','/articulos/como-sacar-constancia-situacion-fiscal.html','Consultar la constancia fiscal','/articulos/declaracion-anual-asalariados-2026.html','Preparar la declaración de asalariados')],
 'ahorro': [
  ('Alcanzar una meta','Relaciona la cantidad que necesitas con tu plazo.','/calculadoras/ahorro-meta.html','Calcular ahorro para una meta','/articulos/plan-para-ahorrar-dinero.html','Preparar un plan de ahorro'),
  ('Ahorrar cada quincena','Ajusta la aportación a la frecuencia de tus ingresos.','/articulos/cuanto-ahorrar-cada-quincena.html','Organizar el ahorro quincenal','/articulos/ahorro-automatico-quincenal.html','Programar aportaciones'),
  ('Comparar cuentas','Revisa condiciones y costos antes de elegir.','/calculadoras/comparador-cuentas-ahorro.html','Comparar cuentas de ahorro','/articulos/como-elegir-cuenta-ahorro.html','Qué revisar en una cuenta')],
 'presupuesto': [
  ('Empezar un presupuesto','Organiza ingresos y gastos antes de fijar metas.','/articulos/presupuesto-personal.html','Crear un presupuesto personal','/articulos/categorias-finanzas-personales.html','Elegir categorías de gastos'),
  ('Llevar un registro en Excel','Distingue la estructura de la hoja del seguimiento de movimientos.','/articulos/finanzas-personales-excel.html','Ver columnas y fórmulas','/articulos/como-organizar-finanzas-personales-excel.html','Organizar movimientos en Excel'),
  ('Preparar una reserva','Separa gastos habituales de imprevistos.','/calculadoras/fondo-emergencia.html','Estimar fondo de emergencia','/articulos/fondo-emergencia-ingresos-variables.html','Ajustarlo a ingresos variables')],
 'inversion': [
  ('Entender CETES','Relaciona plazo, disponibilidad y objetivo.','/calculadoras/cetes.html','Simular un escenario de CETES','/articulos/es-seguro-invertir-en-cetes.html','Revisar riesgos de CETES'),
  ('Comparar rendimientos','Distingue la tasa anunciada de lo que mide cada indicador.','/articulos/gat-nominal-vs-gat-real.html','Comparar GAT nominal y real','/calculadoras/tasa-efectiva.html','Convertir una tasa efectiva'),
  ('Proyectar aportaciones','Prueba supuestos sin tratarlos como ganancias garantizadas.','/calculadoras/interes-compuesto.html','Simular interés compuesto','/articulos/interes-compuesto.html','Ver fórmula y ejemplo')],
 'credito': [
  ('Financiar un auto','Compara el mismo precio, enganche y plazo.','/calculadoras/credito-automotriz.html','Calcular mensualidad del auto','/articulos/simulador-credito-automotriz.html','Interpretar una simulación'),
  ('Entender tu tarjeta','Distingue fechas, saldos y tipos de pago.','/articulos/fecha-corte-vs-fecha-pago.html','Revisar corte y vencimiento','/articulos/pago-minimo-vs-pago-no-generar-intereses.html','Comparar tipos de pago'),
  ('Adelantar pagos de un préstamo','Revisa cómo se aplica el abono antes de comparar escenarios.','/calculadoras/abono-capital-prestamo.html','Simular un abono a capital','/articulos/abono-capital-vs-adelantar-mensualidades.html','Distinguir abono y adelanto')],
 'transferencias': [
  ('Preparar un envío','Comprueba qué identificador necesita la operación.','/articulos/diferencia-clabe-numero-tarjeta-cuenta.html','Distinguir CLABE, tarjeta y cuenta','/articulos/como-hacer-transferencia-spei.html','Revisar los pasos de un SPEI'),
  ('Rastrear una transferencia','Ubica la clave antes de consultar el comprobante.','/articulos/clave-rastreo-spei-donde-encontrarla.html','Encontrar la clave de rastreo','/articulos/cep-spei-como-obtener.html','Obtener el CEP'),
  ('Revisar un dinero no recibido','Consulta la guía que corresponde al estado reportado.','/articulos/spei-liquidado-pero-no-recibido.html','SPEI liquidado sin depósito','/articulos/spei-devuelto-que-hacer.html','SPEI devuelto')],
 'seguros': [
  ('Entender lo que pagarías','Separa deducible, coaseguro y límites del contrato.','/calculadoras/deducible-coaseguro.html','Calcular deducible y coaseguro','/articulos/deducible-vs-coaseguro.html','Entender la diferencia'),
  ('Revisar gastos médicos','Consulta coberturas junto con condiciones y exclusiones.','/articulos/que-cubre-seguro-gastos-medicos-mayores.html','Revisar coberturas','/articulos/como-leer-poliza-gastos-medicos.html','Leer una póliza'),
  ('Preparar una comparación','Ubica el tipo de protección y verifica a quien te asesora.','/articulos/seguro-vida-temporal.html','Conocer el seguro de vida temporal','/articulos/verificar-agente-seguros-cnsf.html','Verificar un agente')],
 'retiro': [
  ('Ubicar tu AFORE','Distingue la consulta de cuenta del cambio de administradora.','/articulos/como-saber-en-que-afore-estoy.html','Consultar en qué AFORE estás','/articulos/como-cambiar-de-afore.html','Revisar un cambio de AFORE'),
  ('Entender tu régimen de pensión','Identifica el régimen antes de revisar requisitos.','/articulos/diferencia-ley-73-ley-97.html','Comparar Ley 73 y Ley 97','/articulos/semanas-cotizadas-pension-imss.html','Revisar semanas cotizadas'),
  ('Consultar una incapacidad','Distingue el trámite de cobro de una estimación de pago.','/calculadoras/incapacidad-imss.html','Estimar pago de incapacidad','/articulos/como-cobrar-incapacidad-imss.html','Consultar el trámite de cobro')],
 'negocios': [
  ('Fijar un precio','Separa costo, precio y margen para comparar alternativas.','/calculadoras/precio-venta.html','Estimar precio de venta','/calculadoras/margen-ganancia.html','Calcular margen de ganancia'),
  ('Cubrir costos','Relaciona ventas necesarias con costos y unidades.','/calculadoras/punto-equilibrio.html','Calcular punto de equilibrio','/calculadoras/costo-unidad.html','Calcular costo por unidad'),
  ('Comparar un resultado','Distingue retorno de inversión de ingresos o comisiones.','/calculadoras/roi.html','Calcular ROI','/calculadoras/comision.html','Calcular comisión')],
 'herramientas': [
  ('Dividir una cuenta','Elige porcentaje y forma de reparto.','/calculadoras/propina.html','Calcular propina por persona','/calculadoras/reparto-cuenta.html','Repartir una cuenta'),
  ('Resolver una proporción','Elige la operación que corresponde a tus datos.','/calculadoras/porcentaje.html','Calcular un porcentaje','/calculadoras/regla-tres.html','Resolver una regla de tres'),
  ('Comparar fechas','Distingue un intervalo de tiempo de la edad de una persona.','/calculadoras/diferencia-fechas.html','Calcular días entre fechas','/calculadoras/edad.html','Calcular edad exacta')],
}

def slug(text):
    text=unicodedata.normalize('NFKD',text).encode('ascii','ignore').decode().lower()
    return re.sub('[^a-z0-9]+','-',text).strip('-')

def emit(file,old,new):
    diff=list(difflib.unified_diff(old.splitlines(True),new.splitlines(True),n=2))
    if not diff:return ''
    return '*** Begin Patch\n*** Update File: '+file+'\n'+''.join('@@\n' if l.startswith('@@') else l.rstrip('\n')+'\n' for l in diff[2:])+'*** End Patch'

def prepare():
    _,hubs,pages=build()
    changes={}
    for file,s in hubs.items():
        key=file.split('/')[-1][:-5];title,desc=TOPICS[key]
        s=s.replace('<img class="logo-img" src="/assets/img/logo.svg" width="190" height="50" alt="Calculadoras México">','<img src="/assets/img/logo-mark.svg" width="40" height="40" alt=""><span>Calculadoras México</span>')
        headings=re.findall(r'<section class="content-box"><h2>(.*?)</h2>',s)
        for heading in headings:s=s.replace('<h2>'+heading+'</h2>','<h2 id="'+slug(heading)+'">'+heading+'</h2>')
        index='<nav class="topic-index" aria-label="Secciones del tema"><strong>Explora esta página</strong><ul>'+''.join('<li>'+link('#'+slug(h),h)+'</li>' for h in headings if h!='Continúa con un tema relacionado')+'</ul></nav>'
        cards='<section class="topic-start" aria-labelledby="elige-tu-objetivo"><h2 id="elige-tu-objetivo">¿Qué necesitas resolver?</h2><div class="topic-routes">'
        for name,intro,url,label,url2,label2 in ROUTES[key]:
            cards+='<article class="topic-route"><h3>'+escape(name)+'</h3><p>'+escape(intro)+'</p><ul><li>'+link(url,label)+'</li><li>'+link(url2,label2)+'</li></ul></article>'
        cards+='</div></section>'
        marker='<section class="content-box">'
        s=s.replace(marker,cards+index+marker,1)
        s=s.replace('<main class="page-wrap">','<main class="page-wrap" id="contenido">')
        s=s.replace('<body class="cm-ui architecture-hub">','<body class="cm-ui architecture-hub"><a class="skip" href="#contenido">Saltar al contenido</a>')
        schema={'@context':'https://schema.org','@graph':[
          {'@type':'CollectionPage','@id':BASE+'/'+file+'#page','name':title,'description':desc,'url':BASE+'/'+file,'inLanguage':'es-MX','breadcrumb':{'@id':BASE+'/'+file+'#breadcrumb'}},
          {'@type':'BreadcrumbList','@id':BASE+'/'+file+'#breadcrumb','itemListElement':[{'@type':'ListItem','position':1,'name':'Inicio','item':BASE+'/'},{'@type':'ListItem','position':2,'name':title,'item':BASE+'/'+file}]}]}
        s=re.sub(r'<script type="application/ld\+json">.*?</script>','<script type="application/ld+json">'+json.dumps(schema,ensure_ascii=False)+'</script>',s,flags=re.S)
        changes[file]=s
    # Only change the parent-topic link inside its dedicated block, not editorial content.
    for p in pages:
        stem=p['path'].split('/')[-1][:-5]
        if stem not in TOPIC_OVERRIDES:continue
        key,_=TOPIC_OVERRIDES[stem]
        for file in set([p['file'],p['served_file']]):
            old=(ROOT/file).read_text(encoding='utf-8-sig')
            def update(m):
                return re.sub(r'<a href="/temas/[^\"]+">[^<]+</a>',link('/temas/'+key+'.html',TOPICS[key][0]),m[0],count=1)
            new,n=re.subn(r'<section class="content-box architecture-related"[^>]*>.*?</section>',update,old,flags=re.S)
            assert n==1,(file,n)
            if old!=new:changes[file]=new
    for file in ['sitemap.xml','sitemap-seo-2026.xml']:
        old=(ROOT/file).read_text(encoding='utf-8-sig');new=old
        # Only topic hubs received substantive content changes.
        for hub in hubs:new=re.sub(r'(<loc>'+re.escape(BASE+'/'+hub)+r'</loc>\s*<lastmod>)[^<]+',lambda m:m[1]+'2026-10-13',new)
        if old!=new:changes[file]=new
    return changes

if __name__=='__main__':
    changes=prepare()
    if len(sys.argv)==1:print(json.dumps(list(changes),ensure_ascii=False))
    else:
        file=sys.argv[1]
        print(emit(file,(ROOT/file).read_text(encoding='utf-8-sig'),changes[file]))

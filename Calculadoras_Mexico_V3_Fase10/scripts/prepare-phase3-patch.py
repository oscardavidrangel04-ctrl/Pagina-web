"""Prepare scoped SEO edits as an apply_patch document; never writes site files."""
import difflib, html, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE = 'https://calculadora-isr-mexico.vercel.app'
DATE = '2026-10-12'
PAGES = [
 ('calculadoras/salario-neto.html', None, 'Calcula tu sueldo neto con salario bruto, ISR, IMSS y otros descuentos de tu recibo. Revisa el desglose mensual, quincenal o semanal y compáralo con tu depósito.'),
 ('fallback-aguinaldo-por-antiguedad.html', 'Aguinaldo por antigüedad: ¿aumenta por años trabajados?', 'El aguinaldo no aumenta automáticamente por antigüedad. Consulta la tabla por años, ejemplos con 15 o 30 días y cómo revisar una prestación superior.'),
 ('articulos/isr-semanal-quincenal-mensual.html', 'ISR semanal, quincenal y mensual 2026: qué tabla usar', 'Identifica la tarifa ISR 2026 de tu nómina: semanal, quincenal o mensual. Revisa la fórmula, un ejemplo y por qué no debes dividir el ISR mensual.'),
 ('fallback-cuando-pagan-finiquito.html', '¿Cuándo pagan el finiquito? Plazo por renuncia en México', 'Conoce cuándo deben pagarte el finiquito por renuncia en México, qué pedir si se retrasa y la diferencia entre fecha de pago y plazo para reclamar.'),
 ('fallback-con-que-salario-se-calcula-aguinaldo.html', '¿El aguinaldo se calcula con sueldo bruto o neto?', 'Para salario fijo, el aguinaldo se calcula con la cuota diaria antes de descuentos, no con el depósito neto. Mira cómo convertir tu sueldo y revisar cambios.'),
 ('calculadoras/propina.html', 'Calculadora de propina: porcentaje y pago por persona', 'Calcula propina de 10%, 15%, 20% o cualquier porcentaje. Obtén el total y el pago por persona, compara una cantidad fija y revisa cargos ya incluidos.'),
 ('articulos/simulador-credito-automotriz.html', 'Simulador de crédito automotriz: guía y ejemplo de pagos', 'Compara mensualidades de un auto con precio, enganche, tasa y plazo. Consulta un ejemplo a 36 y 48 meses y abre la calculadora para probar tus datos.'),
 ('fallback-cuanto-se-deja-propina-mexico.html', '¿Cuánto se deja de propina en México? Ejemplos de 10% y 15%', 'La propina es voluntaria en México. Compara cuánto representan 10%, 15% y 20% en tu cuenta y revisa qué hacer si ya aparece un cargo por servicio.'),
 ('fallback-finiquito-renuncia-voluntaria.html', None, 'Si renuncias, revisa salario pendiente, aguinaldo, vacaciones y prima vacacional. Consulta un ejemplo de finiquito y qué no se incluye automáticamente.'),
 ('calculadoras/salario-diario-integrado.html', 'Calculadora de salario diario integrado (SDI) y factor', 'Calcula el SDI con salario diario, aguinaldo, vacaciones y prima vacacional. Consulta el factor de integración y un ejemplo con salario diario de $500.'),
]

def replace_once(s, old, new):
    assert s.count(old)==1, (old[:100], s.count(old))
    return s.replace(old,new,1)

def remove_section(s, heading):
    pattern = r'<section\b[^>]*>\s*<h2[^>]*>'+re.escape(heading)+r'</h2>.*?</section>'
    s,n=re.subn(pattern,'',s,flags=re.S)
    assert n==1,(heading,n)
    return s

def modify(file,s):
    if file.endswith('salario-neto.html'):
        old='Convierte un sueldo bruto a neto con las deducciones que conozcas. Captura ISR, IMSS u otras cuotas y deducciones adicionales para estimar cuánto ingreso conservarías después de esos descuentos.'
        s=replace_once(s,old,'Tu sueldo neto es el salario bruto menos ISR, IMSS y otros descuentos del mismo periodo. Introduce los importes de tu recibo para comprobar el total. Esta herramienta no calcula automáticamente las retenciones fiscales.')
        marker='<h2>Sueldo neto mensual, quincenal y semanal</h2>'
        s=replace_once(s,marker,marker+'\n<p><strong>Antes de empezar:</strong> si tienes un recibo, usa sus importes reales. Si solo conoces el bruto de una oferta, <a href="/calculadoras/isr.html">estima primero el ISR</a> y solicita las demás deducciones al empleador. No existe un porcentaje único de descuento que convierta todos los sueldos brutos a netos.</p>')
    elif file.endswith('aguinaldo-por-antiguedad.html'):
        s=replace_once(s,'Aclara si el aguinaldo aumenta con los años trabajados y revisa ejemplos para 1, 2, 3, 4, 5, 6 o más años.','El aguinaldo no sube automáticamente por cumplir más años en la empresa. En el régimen general de la LFT, el mínimo anual es de 15 días de salario; una prestación superior depende de tu contrato o condiciones de trabajo.')
        marker='<h2 id="calcular">'
        block='<h2 id="ejemplo-antiguedad">Ejemplo: 4 años de antigüedad no son 4 aguinaldos</h2><p>Con salario diario de $500, año completo y una prestación de 15 días, el aguinaldo del año es <strong>$7,500 brutos</strong>, aunque lleves 4 años en la empresa. Si tu contrato reconoce 30 días, serían $15,000. Los años anteriores no se vuelven a sumar al pago anual actual.</p><p>Si el importe aumentó, revisa si cambió tu salario o los días de prestación. Las <a href="/calculadoras/vacaciones.html">vacaciones por antigüedad</a> siguen una regla distinta: su tabla no debe usarse como tabla de aguinaldo. Base legal: <a href="https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf">LFT, artículos 76 y 87</a>.</p>\n'
        s=replace_once(s,marker,block+marker)
        s=replace_once(s,'<li><a href="#calcular">Calculadora</a></li>','<li><a href="#ejemplo-antiguedad">Ejemplo con 4 años</a></li><li><a href="#calcular">Calculadora</a></li>')
    elif file.endswith('isr-semanal-quincenal-mensual.html'):
        for h in ['Tu sueldo neto en 3 pasos','Ejemplo breve: ISR mensual y sueldo neto','Resumen: tarifa ISR según la periodicidad de pago']:
            s=remove_section(s,h)
        s=replace_once(s,'<h2 id="comparar">','<p>Una vez revisado el impuesto, lleva la retención a la <a href="/calculadoras/salario-neto.html">calculadora de sueldo neto</a> y resta también las demás deducciones del mismo recibo.</p>\n<h2 id="comparar">')
    elif file.endswith('cuando-pagan-finiquito.html'):
        s=replace_once(s,'La búsqueda suele plantearse como “¿a los cuántos días?”, pero no conviene inventar un plazo universal. La obligación de cubrir lo adeudado surge al terminar la relación laboral.','Al separarte del empleo deben cubrirte las prestaciones pendientes. No asumas que la empresa tiene automáticamente 15 o 30 días para pagar: pide el desglose y una fecha escrita, y busca orientación si el pago se retrasa.')
        marker='<h2 id="documentos">'
        s=replace_once(s,marker,'<h2 id="pago-reclamacion">Fecha de pago y plazo para reclamar no son lo mismo</h2><p>El plazo general para reclamar prestaciones no autoriza a la empresa a retener tu finiquito durante ese tiempo. No esperes a que se agote para pedir orientación. Si también discutes un despido, pueden intervenir plazos distintos y más cortos.</p><p>Para una renuncia, consulta la <a href="https://www.profedet.gob.mx/micrositio/index.php/renuncia-voluntaria">orientación oficial de PROFEDET</a>. Ten a mano la fecha de salida, los recibos y la respuesta de la empresa. La autoridad debe revisar qué acción corresponde a tu caso.</p>\n'+marker)
    elif file.endswith('con-que-salario-se-calcula-aguinaldo.html'):
        s=replace_once(s,'La base del aguinaldo no debe confundirse con el sueldo neto que recibes después de deducciones. Primero necesitas identificar el salario diario que corresponde a tu forma de pago.','Para un salario fijo, usa la cuota diaria ordinaria antes de descuentos, no el depósito neto ni el salario diario integrado. Después aplica los días de aguinaldo que correspondan y, si procede, la proporción del año trabajado.')
        s=replace_once(s,'Convierte primero tu salario al equivalente diario usando la base que corresponda a tu nómina y contrato. No uses el depósito neto después de ISR, créditos u otras deducciones como si fuera el salario base.','Para salario fijo mensual, divide el importe ordinario entre 30; si es quincenal, entre 15. Por ejemplo, $15,000 mensuales equivalen a $500 diarios: con 15 días de aguinaldo y un año completo, son $7,500 antes de impuestos. No uses el depósito neto después de ISR, créditos u otras deducciones como base. Puedes comprobar la conversión en la <a href="/calculadoras/salario-diario.html">calculadora de salario diario</a>.')
        s=replace_once(s,'<h2>Aguinaldo: ¿se calcula con sueldo bruto o neto?</h2>\n<p>Si buscas <strong>aguinaldo sueldo bruto o neto</strong> o <strong>aguinaldo se calcula sobre sueldo bruto o neto</strong>, la clave es no partir del depósito neto después de deducciones. Primero identifica el salario diario que corresponda a tu forma de pago.</p>','<h2>Situaciones que cambian la base salarial</h2>')
        s=replace_once(s,'Si tu salario cambió durante el año, no conviene asumir automáticamente que un solo monto representa todo el periodo. Revisa qué salario debe utilizarse según tu situación y conserva comprobantes de los cambios.','Para salario fijo, PROFEDET indica usar la cuota diaria vigente al momento del pago del aguinaldo. No promedies automáticamente el sueldo anterior y el nuevo. Si tienes salario variable o comisiones, confirma la regla aplicable a tu actividad. Consulta la <a href="https://www.gob.mx/profedet/articulos/la-profedet-es-tu-aliada-en-el-pago-del-aguinaldo-conoce-todo-sobre-este-tema-y-haz-valer-tu-derecho">explicación oficial sobre salario fijo y variable</a>.')
    elif file.endswith('calculadoras/propina.html'):
        s=remove_section(s,'Porcentaje, total y reparto de la cuenta')
        s=remove_section(s,'Antes de elegir el porcentaje')
        s=replace_once(s,'Calcula una gratificación del 10%, 15%, 20% o del porcentaje que prefieras. También puedes dividir la cuenta entre varias personas y ver cuánto paga cada una.','Introduce la cuenta, el porcentaje que elijas y el número de personas. Obtén la propina, el total y cuánto paga cada una. En México la propina es voluntaria; puedes elegir otro porcentaje o no dejarla.')
    elif file.endswith('simulador-credito-automotriz.html'):
        s=replace_once(s,'Reúne los datos clave antes de cotizar un auto a crédito en México.','Compara el pago mensual y el costo acumulado con el mismo precio, enganche y tasa. Esta guía explica la simulación; la herramienta enlazada permite introducir tus propios datos.')
        s=replace_once(s,'<h2>Datos que necesitas para simular</h2>','<p><a class="button primary" href="/calculadoras/credito-automotriz.html">Abrir calculadora de crédito automotriz</a></p><nav class="toc" aria-label="En esta guía"><strong>En esta guía</strong><ul><li><a href="#datos-credito">Datos necesarios</a></li><li><a href="#formula-credito">Fórmula de mensualidad</a></li><li><a href="#comparar-plazos">Comparar 36 y 48 meses</a></li></ul></nav><h2 id="datos-credito">Datos que necesitas para simular</h2>')
        s=replace_once(s,'<h2>Cómo se calcula una mensualidad</h2>','<h2 id="formula-credito">Cómo se calcula una mensualidad</h2>')
        s=replace_once(s,'<h2>Ejemplo: compara dos plazos con el mismo enganche</h2>','<h2 id="comparar-plazos">Ejemplo: compara dos plazos con el mismo enganche</h2>')
        # Correct amortization examples using unrounded payment, not rounded dollars times months.
        s=s.replace('$7,050','$7,050.00').replace('$8,677','$8,676.57').replace('$312,372','$312,356.70').replace('$26,028','$26,043.30')
        s=s.replace('$338,400','$338,400.00').replace('$398,400','$398,400.00')
        s=replace_once(s,'las cifras están redondeadas.','los totales se calculan antes de redondear la mensualidad y se muestran a centavos.')
        schema={'@context':'https://schema.org','@type':'Article','headline':'Simulador de crédito automotriz: calcula la mensualidad y compara ofertas','author':{'@type':'Organization','name':'Calculadoras México'},'mainEntityOfPage':BASE+'/articulos/simulador-credito-automotriz.html','dateModified':DATE,'inLanguage':'es-MX'}
        s=s.replace('</head>','<script type="application/ld+json">'+json.dumps(schema,ensure_ascii=False)+'</script></head>',1)
    elif file.endswith('cuanto-se-deja-propina-mexico.html'):
        s=replace_once(s,'Si buscas cuánto se da de propina, cuánto se debe dejar o qué porcentaje usar en un restaurante, aquí puedes comparar cantidades y abrir la calculadora para obtener el monto exacto.','Tú decides cuánto dejar: en México no existe una propina mínima obligatoria. En una cuenta de $800, el 10% son $80 y el 15% son $120. Compara las cantidades y elige libremente según tu experiencia.')
        old='<aside class="source-note"><strong>Fuentes oficiales:</strong> Profeco, comunicados de 10 de mayo de 2026 y 15 de febrero de 2026 sobre el carácter voluntario de la propina y los derechos de consumidores en restaurantes y bares.</aside>'
        s=replace_once(s,old,'<aside class="source-note"><strong>Fuente oficial:</strong> <a href="https://www.gob.mx/profeco/prensa/la-propina-es-obligatoria-profeco-te-responde?idiom=es-MX">Profeco: la propina es voluntaria</a>. Si te exigen una cantidad o aparece sin tu consentimiento, solicita la aclaración del ticket y consulta los canales de atención de Profeco.</aside>')
    elif file.endswith('finiquito-renuncia-voluntaria.html'):
        old='Supón que una persona renuncia y todavía tiene cinco días de salario pendientes. Además, trabajó parte del año y no ha recibido el aguinaldo correspondiente a ese periodo. El finiquito debería separar esas partidas, revisar vacaciones/prima pendientes y sumar cualquier otra prestación devengada aplicable.'
        s=replace_once(s,old,'Ejemplo con salario diario de $500, cinco días pendientes de pago y 180 días computables para aguinaldo en un año de 365 días. Supón 15 días de aguinaldo anual y ningún anticipo: el salario pendiente es $2,500 y el aguinaldo proporcional es $500 × 15 × 180 ÷ 365 = $3,698.63. El subtotal de esas dos partidas es <strong>$6,198.63 brutos</strong>. No es el finiquito completo: faltan vacaciones y prima pendientes, otras prestaciones aplicables y las deducciones que correspondan.')
    elif file.endswith('salario-diario-integrado.html'):
        s=remove_section(s,'Qué puedes calcular sobre salario diario integrado')
        s=remove_section(s,'Conceptos que conviene distinguir')
        s=replace_once(s,'Calcula una referencia de salario diario integrado (SDI) 2026 a partir de tu salario diario y prestaciones básicas como aguinaldo, vacaciones y prima vacacional. La herramienta muestra el factor utilizado y el resultado estimado para ayudarte a entender cómo las prestaciones modifican la referencia diaria.','Introduce salario diario, días de aguinaldo, vacaciones y porcentaje de prima vacacional. Obtén el factor de integración y el SDI estimado. Con $500 diarios, 15 días de aguinaldo, 12 de vacaciones y prima de 25%, el resultado es $524.66.')
        s=replace_once(s,'(días de vacaciones × prima vacacional) ÷ 365','(días de vacaciones × prima vacacional en decimal) ÷ 365')
    # Remove duplicate mega-menus from this lot, preserving contextual links and topic hubs.
    if file.startswith('fallback-') and ('aguinaldo' in file or 'finiquito' in file):
        s=re.sub(r'<section class="content-box internal-hub-v5638"[^>]*>.*?</section>','',s,flags=re.S)
        s=re.sub(r'<!-- V5641_AGUINALDO_REAL_INLINKS_START -->.*?<!-- V5641_AGUINALDO_REAL_INLINKS_END -->','',s,flags=re.S)
    s=s.replace('Cluster de finiquito','Guías de finiquito').replace('Cluster de propina','Guías de propina').replace('las guías del mismo cluster','las guías relacionadas')
    return s

def emit(file,old,new):
    diff=list(difflib.unified_diff(old.splitlines(True),new.splitlines(True),n=2))
    if not diff: return
    print('*** Begin Patch\n*** Update File: '+file)
    for line in diff[2:]:
        print('@@' if line.startswith('@@') else line.rstrip('\n'))
    print('*** End Patch')

def output_patch(file):
    old=(ROOT/file).read_text(encoding='utf-8-sig')
    if file.startswith('sitemap'):
        canonicals=[]
        for f,_,_ in PAGES:
            body=(ROOT/f).read_text(encoding='utf-8-sig')
            for tag in re.findall(r'<link\b[^>]*>',body):
                if 'rel="canonical"' in tag: canonicals.append(re.search(r'href="([^"]+)"',tag).group(1))
        new=old
        for url in canonicals:
            new=re.sub(r'(<loc>'+re.escape(url)+r'</loc>\s*<lastmod>)[^<]+',lambda m:m[1]+DATE,new)
        emit(file,old,new)
        return
    title,desc=next((t,d) for f,t,d in PAGES if f==file)
    new=modify(file,old)
    if title:
        old_title=html.unescape(re.search(r'<title>(.*?)</title>',new,re.S).group(1))
        new=new.replace(old_title,title)
    def meta(m):
        tag=m.group(0)
        if re.search(r'(?:name|property)="(?:description|og:description|twitter:description)"',tag):
            tag=re.sub(r'content="[^"]*"',lambda _: 'content="'+html.escape(desc,quote=True)+'"',tag)
        return tag
    new=re.sub(r'<meta\b[^>]*>',meta,new)
    def schema(m):
        data=json.loads(m.group(1))
        def visit(x):
            if isinstance(x,dict):
                if x.get('@type') in ['Article','WebPage','WebApplication']:
                    x['description']=desc
                    if x.get('@type')!='WebApplication': x['dateModified']=DATE
                for v in x.values(): visit(v)
            elif isinstance(x,list):
                for v in x: visit(v)
        visit(data)
        return '<script type="application/ld+json">'+json.dumps(data,ensure_ascii=False,separators=(',',':'))+'</script>'
    new=re.sub(r'<script type="application/ld\+json">(.*?)</script>',schema,new,flags=re.S)
    new=re.sub(r'((?:Actualizado el|Contenido revisado el) )\d+ de \w+ de 2026',r'\g<1>12 de octubre de 2026',new)
    emit(file,old,new)

if __name__=='__main__': output_patch(sys.argv[1])

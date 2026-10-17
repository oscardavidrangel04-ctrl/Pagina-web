"""Produce a reviewable patch; never modifies source files itself."""
from pathlib import Path
import re, json, html, difflib, zipfile, csv, io

DATA = {
'calculadoras/pago-quincenal.html': ('Calcula tu pago quincenal desde el sueldo mensual. Consulta ejemplos, diferencias con catorcena y cómo revisar ISR y sueldo neto. Gratis y sin registro.', 'Pago quincenal y catorcenal:', '''<h3>¿Cuándo es quincena y cuántas quincenas tiene un año?</h3><p>Un esquema de dos pagos mensuales tiene 24 quincenas al año. El día 15 y el cierre de mes son referencias habituales, pero la fecha de depósito depende del calendario de tu empresa. Confírmala en tu recibo o con nómina, especialmente si coincide con un día no laborable.</p><p>Para convertir quincenas a meses bajo ese esquema, divide entre dos: 24 quincenas son 12 meses; 48 son 24 meses; 144 son 72 meses, equivalentes a 6 años. Esta conversión no describe un calendario de pagos cada 14 días.</p><h3>Cómo revisar el cálculo de una nómina quincenal</h3><p>Parte de la referencia bruta, añade las percepciones del periodo y separa las deducciones del recibo. Para saber cómo calcular tu ISR quincenal, identifica primero la base gravada y consulta la <a href="/articulos/isr-semanal-quincenal-mensual.html">guía de tarifas por periodo</a>. Después puedes <a href="/calculadoras/salario-neto.html">comprobar el depósito neto</a> con los descuentos conocidos.</p>'''),
'calculadoras/salario-diario.html': ('Calcula cuánto ganas al día desde tu sueldo mensual, quincenal o semanal. Consulta divisores, ejemplos y cómo convertir salario diario a mensual.', 'id="conversion-diaria-resumen"', '''<h3>Cómo calcular salario mensual con salario diario</h3><p>Para invertir la referencia de 30 días, multiplica la cuota diaria por 30. Con $600 diarios, la equivalencia es $18,000 mensuales, $9,000 por quincena de referencia y $4,200 por semana. Esas equivalencias parten de la misma cuota; no incorporan horas extra, bonos ni deducciones.</p><h3>¿Cómo sé cuánto gano por día si solo conozco mi depósito?</h3><p>Dividir un depósito neto entre los días de referencia da una cantidad después de descuentos. Para calcular salario bruto diario, toma el sueldo bruto del mismo periodo. Por ejemplo, $18,000 brutos mensuales y un depósito de $16,200 dan $600 brutos y $540 netos diarios de referencia: responden a preguntas distintas.</p><p>Si buscas retenciones semanales, utiliza la <a href="/calculadoras/isr.html">calculadora de ISR seleccionando el periodo semanal</a>. El cálculo de salario diario por sí solo no determina ese impuesto.</p>'''),
'calculadoras/salario-neto.html': ('Convierte salario bruto a neto con las deducciones de tu recibo. Compara el resultado con tu depósito y revisa ejemplos. ISR e IMSS de captura manual.', 'class="content-box search-cases"', '''<h3>¿Cuánto son $14,000, $18,000 o $25,000 brutos a netos?</h3><p>El sueldo bruto por sí solo no permite saber el depósito. Captura ese importe arriba y añade el ISR, las cuotas y las demás deducciones del mismo recibo. Si aún no conoces la retención, puedes <a href="/calculadoras/isr.html">estimar el ISR por periodo</a> antes de completar el formulario.</p><p>Ejemplo con deducciones conocidas: $18,000 brutos − $1,800 de ISR − $400 de cuotas − $300 de otras deducciones = <strong>$15,500 netos</strong>. Los descuentos de este ejemplo son hipotéticos, no una tarifa fiscal para $18,000. Cambiar el bruto sin actualizar los descuentos no produce una estimación fiscal válida.</p><h3>Cómo calcular ingreso neto o recuperar el bruto</h3><p>Para revisar el salario después de impuestos en México, resta también las demás deducciones aplicables al recibo: ISR y descuento total no son sinónimos. Si conoces el neto y los descuentos, usa la <a href="/calculadoras/salario-bruto.html">calculadora de sueldo neto a bruto con deducciones conocidas</a>. Para comparar ofertas, consulta la <a href="/articulos/salario-bruto-neto.html">diferencia entre salario bruto y neto</a>.</p>'''),
'calculadoras/bono.html': ('Calcula un bono por porcentaje y el total con tu sueldo. Incluye ejemplo de bono de productividad y cálculo inverso del porcentaje. Importes brutos.', 'id="comparar-bono"', '''<h3>Cálculo de bono de productividad: ejemplo con metas</h3><p>Primero revisa qué base y qué regla reconoce tu plan de incentivos. Si establece un bono del 8% sobre $18,000 al cumplir la meta completa, el bono bruto es <strong>$1,440</strong> y la suma con esa base es $19,440.</p><p>Si el plan además paga proporcionalmente al cumplimiento y alcanzaste el 75% de la meta, el porcentaje efectivo sería 8% × 75% = 6%: captura $18,000 y 6 para obtener $1,080. Solo aplica esa proporción si está prevista en el plan; algunos bonos tienen umbrales o cantidades fijas.</p><p>La calculadora admite bonos laborales definidos como porcentaje. El precio o rendimiento de un bono financiero y el bono de pensión del ISSSTE requieren métodos distintos. Para revisar la integración de un incentivo laboral, consulta <a href="/articulos/bonos-salario-base-cotizacion.html">bonos y salario base de cotización</a>.</p>'''),
}

def diff(path, before, after):
    lines=list(difflib.unified_diff(before.splitlines(),after.splitlines(),n=2,lineterm=''))[2:]
    return '*** Update File: '+path+'\n'+'\n'.join('@@' if l.startswith('@@') else l for l in lines)+'\n'

patch='*** Begin Patch\n'
for path,(desc,marker,body) in DATA.items():
    before=Path(path).read_text(encoding='utf8');s=before
    assert 'data-keyword-refinement' not in s
    target=next(m for m in re.finditer(r'<section\b.*?</section>',s,re.S) if marker in m[0])
    section=target[0].replace('</section>','<div data-keyword-refinement="20261015">'+body+'</div></section>')
    s=s[:target.start()]+section+s[target.end():]
    def meta(m):
        tag=m[0]
        if re.search(r'(?:name|property)="(?:description|og:description|twitter:description)"',tag):
            return re.sub(r'content="[^"]*"','content="'+html.escape(desc,quote=True)+'"',tag)
        return tag
    s=re.sub(r'<meta\b[^>]*>',meta,s)
    def schema(m):
        data=json.loads(m[2])
        def walk(v):
            if isinstance(v,list):
                for x in v:walk(x)
            elif isinstance(v,dict):
                if v.get('@type') in ('WebPage','SoftwareApplication','WebApplication') and 'description' in v:v['description']=desc
                for x in v.values():
                    if isinstance(x,(dict,list)):walk(x)
        walk(data)
        return m[1]+json.dumps(data,ensure_ascii=False,separators=(',',':'))+m[3]
    s=re.sub(r'(<script\b[^>]*type="application/ld\+json"[^>]*>)(.*?)(</script>)',schema,s,flags=re.S)
    patch+=diff(path,before,s)

path='articulos/isr-semanal-quincenal-mensual.html'
before=Path(path).read_text(encoding='utf8')
block='''<section class="content-box" id="localizar-tabla-isr" data-keyword-refinement="20261015"><h2>Dónde consultar la tabla ISR semanal y quincenal de 2026</h2><p>En el <a href="https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo-8-RMF-2026_DOF-28122025.pdf" target="_blank" rel="noopener">Anexo 8 de la RMF 2026 del SAT</a>, busca el apartado B, «Tarifas aplicables a retenciones»: el inciso II corresponde a pagos de 7 días, el IV a pagos de 15 días y el V a pagos provisionales mensuales. Comprueba el encabezado antes de copiar límites y cuotas.</p><h3>Cómo calcular mi ISR quincenal con el recibo</h3><ol><li>Identifica las percepciones gravadas de la quincena, separadas de las exentas.</li><li>Ubica el rango de esa base en la tarifa de 15 días del ejercicio correspondiente.</li><li>Resta el límite inferior, aplica la tasa al excedente y suma la cuota fija.</li><li>Revisa el subsidio y los ajustes aplicables antes de comparar con la retención del recibo.</li></ol><p>Para calcular ISR semanal, sigue el mismo procedimiento con la base de la semana y su tarifa de 7 días. Puedes comprobar el procedimiento en la <a href="/calculadoras/isr.html">calculadora de ISR por periodo</a>.</p><h3>¿Un mes con cinco semanas cambia la tarifa semanal?</h3><p>La presencia de cinco fechas de pago en el calendario no convierte cada pago semanal en un quinto del salario mensual. Revisa cada recibo con su periodo y base gravada, y distingue la retención de cada pago de los ajustes que correspondan en la nómina.</p></section>'''
assert 'id="localizar-tabla-isr"' not in before
s=before.replace('</article>',block+'</article>',1)
patch+=diff(path,before,s)
print(patch+'*** End Patch')

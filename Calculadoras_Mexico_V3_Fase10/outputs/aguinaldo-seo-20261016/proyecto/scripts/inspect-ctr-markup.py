from pathlib import Path
import sys,json,re,html
slugs='salario-neto salario-bruto isr pago-quincenal salario-diario salario-hora aguinaldo aguinaldo-proporcional finiquito liquidacion vacaciones prima-vacacional'.split()
def clean(s):return html.unescape(re.sub('<[^>]+>',' ',s)).strip()
for slug in (sys.argv[1:] or slugs):
 s=Path('calculadoras',slug+'.html').read_text(encoding='utf-8')
 print('\nPAGE',slug,'TITLE',clean(re.search('<title>(.*?)</title>',s,re.S)[1]))
 print('HEADINGS',[clean(h) for h in re.findall(r'<h[12][^>]*>(.*?)</h[12]>',s,re.S)])
 form=re.search(r'<section[^>]*id="calculadora".*?</section>',s,re.S)
 print('FORM',clean(form[0])[:1400] if form else '')
 print('FIELDS',re.findall(r'<(?:input|select|option)\b[^>]*>',s)[:25])
 if slug in ('aguinaldo','isr','liquidacion'):print('SCRIPT',re.findall(r'<script[^>]*src="([^"]+)',s))

'use strict';
const {programs}=require('./affiliate-cards.cjs');
const nativeId='409e3950cb7b10082bb628969be6611a',bannerKey='94dbe87812d642e0600cc58986b093c2';
const nativeScript=`<script async="async" data-cfasync="false" src="https://bauval.org/21/${nativeId}"></script>`;
const bannerDocument=`<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Publicidad Adsterra</title><style>html,body{margin:0;padding:0;width:300px;min-height:250px}</style></head><body><script>atOptions = {'key':'${bannerKey}','format':'iframe','height':250,'width':300,'params':{}};</script><script src="https://bauval.org/22/${bannerKey}"></script></body></html>`;
const attr=s=>s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function block(type,content){return `<!-- monetization-v2:${type}:start --><aside class="cm-commercial cm-commercial--${type}" aria-label="Publicidad">${content}</aside><!-- monetization-v2:${type}:end -->`;}
function affiliate(key,legacy){const p=programs[key];return `<section class="cm-commercial__affiliate" data-affiliate="${key}" data-placement="global-after-content" data-variant="global-v2" aria-labelledby="affiliate-title-${key}"><a class="affiliate-card__banner" data-affiliate-link="banner" href="${p.href}" target="_blank" rel="sponsored nofollow noopener" aria-label="Publicidad: visitar ${p.name}"><img src="${p.image}" width="300" height="250" loading="lazy" decoding="async" alt="Publicidad de ${p.name}"></a><div><p class="cm-commercial__label">Publicidad · ${p.name}</p><h2 id="affiliate-title-${key}">${p.title}</h2><p>${p.description}</p><a class="cm-commercial__cta" data-affiliate-link="button" href="${p.href}" target="_blank" rel="sponsored nofollow noopener">${p.button}<span class="cm-commercial__sr"> (abre otra pestaña)</span></a><p class="cm-commercial__note">${p.note}</p><p class="cm-commercial__note">Enlace de afiliado: podemos recibir una comisión por una acción válida.</p>${legacy&&key==='aliexpress'?`<p class="cm-commercial__note"><a href="${attr(legacy)}" target="_blank" rel="sponsored nofollow noopener" data-affiliate-link="legacy">Otro enlace afiliado de AliExpress</a></p>`:''}</div></section>`;}
// A lightweight range scanner preserves original markup and executable scripts.
function ranges(html){const re=/<!--[\s\S]*?-->|<script\b[^>]*>[\s\S]*?<\/script\s*>|<style\b[^>]*>[\s\S]*?<\/style\s*>|<\/?([a-z][\w:-]*)\b[^>]*>/gi,stack=[],out=[];let m;while((m=re.exec(html))){if(!m[1])continue;const tag=m[1].toLowerCase();if(/^<\//.test(m[0])){const i=stack.map(x=>x.tag).lastIndexOf(tag);if(i<0)continue;const item=stack[i];stack.length=i;item.close=m.index;item.end=re.lastIndex;out.push(item);}else if(!/^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/.test(tag)&&!m[0].endsWith('/>')){stack.push({tag,start:m.index,openEnd:re.lastIndex,attrs:m[0],parent:stack[stack.length-1]});}}return out;}
function transform(input,file){if(!/<body\b/i.test(input))return {html:input,exception:'machine-verification'};
 // Generated pages are never an input to the build, but processing them again
 // must not discard a preserved legacy tracking link or move the slots.
 if(['native','partners','banner'].every(type=>input.includes(`<!-- monetization-v2:${type}:start -->`)))return {html:input};
 let s=input.replace(/<!-- monetization-v2:([a-z]+):start -->[\s\S]*?<!-- monetization-v2:\1:end -->/g,'');
 s=s.replace(/<!-- affiliate-card:start -->[\s\S]*?<!-- affiliate-card:end -->/g,'').replace(/<!-- adsterra-unit:start -->[\s\S]*?<!-- adsterra-unit:end -->/g,'');
 let legacy='';
 const old=ranges(s).filter(x=>/\baffiliate-block\b/.test(x.attrs));
 for(const x of old.sort((a,b)=>b.start-a.start)){const segment=s.slice(x.start,x.end);const link=segment.match(/href="(https:\/\/rzekl\.com\/[^\"]+)"/);if(link){legacy=link[1];s=s.slice(0,x.start)+s.slice(x.end);}}
 s=s.replace(/<link\b[^>]*href="\/assets\/css\/(?:affiliate-cards|affiliate-block|adsterra-unit|monetization-v2)\.css[^\"]*"[^>]*>/g,'').replace(/<script\b[^>]*src="\/assets\/js\/affiliate-events\.js[^\"]*"[^>]*><\/script>/g,'');
 s=s.replace('</head>','<link rel="stylesheet" href="/assets/css/monetization-v2.css?v=2"></head>');
 const rs=ranges(s),main=rs.find(x=>x.tag==='main');if(!main)throw Error(file+': missing main');
 const within=x=>x.start>main.start&&x.end<main.end;
 const has=(x,cls)=>new RegExp('class=["\x27][^"\x27]*\\b'+cls+'\\b').test(x.attrs);
 const wrap=rs.find(x=>within(x)&&has(x,'page-wrap'));
 const anchor=file==='index.html'?rs.find(x=>within(x)&&has(x,'ziro-home-popular')):rs.find(x=>within(x)&&has(x,'calc-layout'));
 const article=rs.find(x=>within(x)&&x.tag==='article'&&(has(x,'article')||has(x,'content-box')));
 const articleBreaks=article?rs.filter(x=>x.parent?.start===article.start&&/^(p|section|ul|ol|table|div)$/.test(x.tag)&&x.end<article.close-400):[];
 const midpoint=article?(article.openEnd+article.close)/2:0;
 const articleBreak=articleBreaks.sort((a,b)=>Math.abs(a.end-midpoint)-Math.abs(b.end-midpoint))[0];
 const nativeAt=anchor?anchor.end:articleBreak?articleBreak.end:article?article.close:wrap?wrap.end:main.close;
 // Keep complete form/result groups together. On long pages use a subsequent
 // editorial section boundary, leaving more content between partners and MREC.
 const partnersTarget=nativeAt+(main.close-nativeAt)*.62;
 const partnerBreaks=rs.filter(x=>within(x)&&x.end>nativeAt+600&&x.end<main.close-600&&
   (x.parent?.start===main.start||x.parent?.start===wrap?.start)&&/^(section|article)$/.test(x.tag));
 const partnerBreak=partnerBreaks.sort((a,b)=>Math.abs(a.end-partnersTarget)-Math.abs(b.end-partnersTarget))[0];
 const partnersAt=partnerBreak?partnerBreak.end:wrap?Math.max(wrap.end,nativeAt):main.close;
 const native=block('native',`<p class="cm-commercial__label">Publicidad · Adsterra</p>${nativeScript}<div class="cm-commercial__native" id="container-${nativeId}"></div>`);
 const partners=block('partners',`<div class="cm-commercial__partners">${affiliate('aliexpress',legacy)}${affiliate('solcredito')}</div>`);
 const banner=block('banner',`<p class="cm-commercial__label">Publicidad · Adsterra</p><div class="cm-commercial__frame"><iframe title="Publicidad Adsterra 300 por 250" width="300" height="250" loading="lazy" srcdoc="${attr(bannerDocument)}"></iframe></div>`);
 // The fixed 300px iframe needs the full page width on narrow article layouts.
 const insertions=[{at:nativeAt,order:0,text:native},{at:partnersAt,order:1,text:partners},{at:main.end,order:2,text:banner}].sort((a,b)=>b.at-a.at||b.order-a.order);
 for(const x of insertions)s=s.slice(0,x.at)+'\n'+x.text+'\n'+s.slice(x.at);
 s=s.replace('</body>','<script defer src="/assets/js/affiliate-events.js?v=1"></script></body>');
 return {html:s,legacy:!!legacy,adSense:(s.match(/adsbygoogle\.js/g)||[]).length};}
module.exports={transform,ranges,nativeId,bannerKey,nativeScript,bannerDocument};

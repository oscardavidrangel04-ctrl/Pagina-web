'use strict';

const measurementId = 'G-KV44465NKW';
const start = '<!-- google-analytics-4:start -->';
const end = '<!-- google-analytics-4:end -->';
const snippet = `${start}
<script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });
  (function configureAnalytics() {
    // Shared calculator links may contain salary, amounts and dates.
    const current = new URL(window.location.href);
    const clean = new URL(current.origin + current.pathname);
    const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 'utm_term', 'utm_content', 'utm_source_platform'];
    for (const key of campaignKeys) {
      const value = current.searchParams.get(key);
      if (value && value.length <= 150 && !value.includes('@')) clean.searchParams.set(key, value);
    }

    let referrer = '';
    if (document.referrer) {
      const previous = new URL(document.referrer);
      if (previous.protocol === 'https:' || previous.protocol === 'http:') {
        referrer = previous.origin + (previous.origin === current.origin ? previous.pathname : '/');
      }
    }
    gtag('config', '${measurementId}', {
      page_location: clean.href,
      page_referrer: referrer,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
  })();
</script>
${end}
`;

function installGoogleAnalytics(html, filename) {
  // Search Console verifies this literal resource instead of rendering a page.
  if (/^google[a-f0-9]+\.html$/i.test(filename) && /^google-site-verification:/i.test(html.trim())) return html;

  const head = /<head\b[^>]*>[\s\S]*?<\/head\s*>/i.exec(html);
  if (!head) throw new Error('Public HTML is missing a head: ' + filename);
  const existing = html.replace(snippet, '');
  // Stop the build if another Analytics or GTM installation would be combined with ours.
  if (/google-analytics-4:(?:start|end)|googletagmanager\.com\/(?:gtag\/js|gtm\.js|ns\.html)|google-analytics\.com\/(?:analytics|ga)\.js|\bgtag\s*\(/i.test(existing)) {
    throw new Error('Conflicting Google tracking tag in ' + filename);
  }
  if (existing !== html) {
    if (!head[0].includes(snippet)) throw new Error('GA4 must be inside head: ' + filename);
    return html;
  }
  const closingHead = head.index + head[0].lastIndexOf('</');
  return html.slice(0, closingHead) + snippet + html.slice(closingHead);
}

module.exports = {installGoogleAnalytics};

/* Optional first-party adapter. No cookies, identifiers, form values or network SDK. */
(() => {
  'use strict';
  if (window.__cmAffiliateEvents) return;
  window.__cmAffiliateEvents = true;
  const cards = [...document.querySelectorAll('[data-affiliate]')];
  const consent = () => window.CM_AFFILIATE_ANALYTICS_CONSENT === true &&
    navigator.doNotTrack !== '1' && navigator.globalPrivacyControl !== true;
  const emit = (name, card, linkType) => {
    if (!consent()) return false;
    const detail = {
      name, program: card.dataset.affiliate, placement: card.dataset.placement,
      variant: card.dataset.variant, path: location.pathname,
      ...(linkType ? {link_type: linkType} : {})
    };
    // A consent manager/first-party analytics adapter can consume this event.
    // This module deliberately does not guess consent or queue events before it.
    window.dispatchEvent(new CustomEvent('cm:affiliate', {detail}));
    return true;
  };
  const clicked = new WeakSet(), seen = new WeakSet();
  function click(event) {
    if (event.type === 'auxclick' && event.button !== 1) return;
    const link = event.target.closest?.('[data-affiliate-link]');
    const card = link?.closest('[data-affiliate]');
    if (!card) return;
    emit('affiliate_click', card, link.dataset.affiliateLink);
    if (seen.has(card) && !clicked.has(card) && emit('affiliate_viewed_card_clicked', card)) clicked.add(card);
  }
  document.addEventListener('click', click);
  document.addEventListener('auxclick', click);
  if (!('IntersectionObserver' in window)) return;
  const visible = new Set(), timers = new Map();
  const cancel = card => {clearTimeout(timers.get(card));timers.delete(card);};
  function schedule(card) {
    cancel(card);
    if (seen.has(card) || !visible.has(card) || document.hidden || !consent()) return;
    timers.set(card, setTimeout(() => {
      timers.delete(card);
      if (!document.hidden && visible.has(card) && emit('affiliate_card_view', card)) seen.add(card);
    }, 1000));
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      // Use the 300x250 banner area so tall mobile cards can qualify.
      const card = entry.target.closest('[data-affiliate]');
      if (entry.intersectionRatio >= .5) {visible.add(card);schedule(card);}
      else {visible.delete(card);cancel(card);}
    });
  }, {threshold: [0, .5]});
  cards.forEach(card => observer.observe(card.querySelector('.affiliate-card__banner')));
  document.addEventListener('visibilitychange', () => cards.forEach(schedule));
  window.addEventListener('cm:analytics-consent-change', () => cards.forEach(schedule));
  window.addEventListener('pagehide', () => cards.forEach(cancel));
})();

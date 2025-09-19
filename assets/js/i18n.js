(function(){
  const SUPPORTED = ["en","es","fr","de"];
  const params = new URLSearchParams(location.search);
  const urlLang = params.get("lang");
  const docLang = (document.documentElement.getAttribute('lang')||'').slice(0,2);
  const routeSeg = location.pathname.split('/').filter(Boolean)[0];
  const routeLang = SUPPORTED.includes(routeSeg) ? routeSeg : null;
  let lang = routeLang
    || (urlLang && SUPPORTED.includes(urlLang) ? urlLang : null)
    || (localStorage.getItem("lang") || null)
    || (SUPPORTED.includes(docLang)?docLang:null)
    || (navigator.language||"en").slice(0,2);
  if(!SUPPORTED.includes(lang)) lang = "en";

  // Restore scroll position if saved (after language change)
  try{
    const saved = sessionStorage.getItem('ish-scroll');
    if(saved){
      const y = parseInt(saved, 10);
      if(!isNaN(y)) requestAnimationFrame(()=>scrollTo(0, y));
      sessionStorage.removeItem('ish-scroll');
    }
  }catch(_){/* ignore */}

  // Persist selection. On route pages, hard-lock to the route language and normalize URL
  if(routeLang){
    try{ document.documentElement.setAttribute('lang', routeLang); }catch(_){ }
    localStorage.setItem("lang", routeLang);
    // Remove ?lang param to avoid stale overrides
    const cur = new URLSearchParams(location.search);
    if(cur.has('lang')){
      cur.delete('lang');
      const qs = cur.toString();
      history.replaceState({}, "", `${location.pathname}${qs?`?${qs}`:""}${location.hash||""}`);
    }
  } else {
    try{ document.documentElement.setAttribute('lang', lang); }catch(_){ }
  localStorage.setItem("lang", lang);
    if(urlLang !== lang){ params.set("lang", lang); history.replaceState({}, "", `${location.pathname}?${params.toString()}${location.hash||""}`); }
  }

  function applyTranslations(targetLang){
    fetch(`/i18n/${targetLang}.json`, {cache:"no-cache"})
    .then(r=>r.json())
    .then(dict=>{
      document.querySelectorAll("[data-i18n]").forEach(el=>{
        const key = el.getAttribute("data-i18n");
        const val = dict[key];
          if(typeof val === "string") el.innerHTML = val;
        });
      });
  }
  // On route pages, force that language regardless of geo/browser
  applyTranslations(lang);
  if(routeLang){
    // Re-apply after full load to override any late updates from other scripts
    window.addEventListener('load', ()=>applyTranslations(routeLang));
  }

  // Switcher (header dropdown)
  document.addEventListener("click", e=>{
    const btn = e.target.closest("[data-lang]");
    if(!btn) return;
    const next = btn.getAttribute("data-lang");
    if(!SUPPORTED.includes(next)) return;
    // reflect on <html lang="..">
    try{ document.documentElement.setAttribute('lang', next); }catch(_){}
    const p = new URLSearchParams(location.search);
    p.set("lang", next);
    localStorage.setItem("lang", next);
    localStorage.setItem('ish-lang-manual','1');
    // Update URL only; do not navigate away; keep hash/position
    history.replaceState({}, "", `${location.pathname}?${p.toString()}${location.hash||""}`);
    // Signal other scripts to update embeds without navigation
    document.dispatchEvent(new CustomEvent('ish:lang-changed', { detail: { lang: next } }));
  });

  // Footer language links: prevent navigation; update URL only and notify
  document.addEventListener("click", e=>{
    const link = e.target.closest('a.lang-link[href*="?lang="]');
    if(!link) return;
    e.preventDefault();
    const url = new URL(link.href, location.origin);
    const next = url.searchParams.get('lang');
    if(!SUPPORTED.includes(next)) return;
    try{ document.documentElement.setAttribute('lang', next); }catch(_){}
    const p = new URLSearchParams(location.search);
    p.set('lang', next);
    localStorage.setItem('lang', next);
    localStorage.setItem('ish-lang-manual','1');
    history.replaceState({}, "", `${location.pathname}?${p.toString()}${location.hash||""}`);
    document.dispatchEvent(new CustomEvent('ish:lang-changed', { detail: { lang: next } }));
  });

  // Re-apply translations when someone else changes the language (geo or UI)
  document.addEventListener('ish:lang-changed', (e)=>{
    if(routeLang) return; // On route pages, do not override fixed language
    const next = (e.detail && e.detail.lang) || 'en';
    applyTranslations(next);
  });

  // Route-based language links: allow navigation but store preference
  document.addEventListener('click', e=>{
    const routeLink = e.target.closest('a.lang-link[href^="/"]');
    if(!routeLink) return;
    try{
      const seg = new URL(routeLink.href, location.origin).pathname.split('/').filter(Boolean)[0];
      if(SUPPORTED.includes(seg)) { localStorage.setItem('lang', seg); localStorage.setItem('ish-lang-manual','1'); }
    }catch(_){ }
  });
})();
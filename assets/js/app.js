// Off-canvas menu
addEventListener('click', e=>{
  const btn = e.target.closest('[data-menu-toggle]');
  const close = e.target.closest('[data-menu-close]');
  const oc = document.querySelector('.offcanvas');
  if(btn && oc){ oc.classList.add('active'); }
  if(close || (oc && e.target.classList.contains('scrim'))){ oc.classList.remove('active'); }
});

// Services accordion (exclusive + auto-scroll)
addEventListener('click', e=>{
  const q = e.target.closest('.svc-q'); if(!q) return;
  const item = q.closest('.svc-item'); const list = item.parentElement;
  [...list.querySelectorAll('.svc-item')].forEach(i=>{ if(i!==item) i.classList.remove('active'); });
  item.classList.toggle('active');
  if(item.classList.contains('active')){
    const headerH = document.querySelector('.ish-header')?.offsetHeight || 0;
    const y = item.getBoundingClientRect().top + scrollY - Math.max(80, headerH+20);
    scrollTo({ top:y, behavior:'smooth' });
  }
});

// FAQ accordion (exclusive + auto-scroll)
addEventListener('click', e=>{
  const q = e.target.closest('.faq-q'); if(!q) return;
  const item = q.closest('.faq-item'); const list = item.parentElement;
  [...list.querySelectorAll('.faq-item')].forEach(i=>{ if(i!==item) i.classList.remove('active'); });
  item.classList.toggle('active');
  if(item.classList.contains('active')){
    const headerH = document.querySelector('.ish-header')?.offsetHeight || 0;
    const y = item.getBoundingClientRect().top + scrollY - Math.max(80, headerH+20);
    scrollTo({ top:y, behavior:'smooth' });
  }
});

// Preserve ?lang in internal hash links (defensive)
(function(){
  const p = new URLSearchParams(location.search);
  const lang = p.get('lang');
  if(!lang) return;
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', ()=>{
      const params = new URLSearchParams(location.search);
      if(!params.get('lang')){ params.set('lang', lang); history.replaceState({}, "", `${location.pathname}?${params.toString()}${location.hash}`); }
    });
  });
})();

// Configure booking calendars (toggle 3 static iframes)
(function(){
  const SUP = ['en','es','fr'];
  const route = location.pathname.split('/').filter(Boolean)[0];
  const routeLang = SUP.includes(route) ? route : null;
  const params = new URLSearchParams(location.search);
  let lang = routeLang || params.get('lang') || localStorage.getItem('lang') || (navigator.language||'en').slice(0,2);
  if(!SUP.includes(lang)) lang = 'en';
  const elEn = document.getElementById('cal-en');
  const elEs = document.getElementById('cal-es');
  const elFr = document.getElementById('cal-fr');
  if(elEn || elEs || elFr){
    if(elEn) elEn.style.display = (lang==='en' ? 'block' : 'none');
    if(elEs) elEs.style.display = (lang==='es' ? 'block' : 'none');
    if(elFr) elFr.style.display = (lang==='fr' ? 'block' : 'none');
  }
})();

// Configure contact form per language
(function(){
  const params = new URLSearchParams(location.search);
  let lang = params.get('lang') || localStorage.getItem('lang') || (navigator.language||'en').slice(0,2);
  if(!['en','es','fr'].includes(lang)) lang = 'en';
  const form = document.querySelector('#contact iframe');
  if(!form) return;
  // Map language to specific form URLs (replace with your real IDs when available)
  const FORM_MAP = {
    en: 'https://api.leadconnectorhq.com/widget/form/t2oy5Eb6MXJHngHF98VY',
    es: 'https://api.leadconnectorhq.com/widget/form/h3mVMQOqKqHWL7IXnps2',
    fr: 'https://api.leadconnectorhq.com/widget/form/0mtsBAHbZ9Mgotzu43Nj'
  };
  const HEIGHT_MAP = { en: 611, es: 651, fr: 795 };
  const nextSrc = FORM_MAP[lang] || FORM_MAP.en;
  if(form.src !== nextSrc){ form.src = nextSrc; }
  const nextHeight = HEIGHT_MAP[lang] || HEIGHT_MAP.en;
  if(nextHeight){ form.style.height = `${nextHeight}px`; form.setAttribute('data-height', String(nextHeight)); }
})();

// React to language changes without navigation
document.addEventListener('ish:lang-changed', (e)=>{
  const lang = (e.detail && e.detail.lang) || 'en';
  // Calendar: toggle visible iframe only
  (function(){
    const elEn = document.getElementById('cal-en');
    const elEs = document.getElementById('cal-es');
    const elFr = document.getElementById('cal-fr');
    if(elEn || elEs || elFr){
      if(elEn) elEn.style.display = (lang==='en' ? 'block' : 'none');
      if(elEs) elEs.style.display = (lang==='es' ? 'block' : 'none');
      if(elFr) elFr.style.display = (lang==='fr' ? 'block' : 'none');
    }
  })();
  // Contact form
  const form = document.querySelector('#contact iframe');
  if(form){
    const FORM_MAP = {
      en: 'https://api.leadconnectorhq.com/widget/form/t2oy5Eb6MXJHngHF98VY',
      es: 'https://api.leadconnectorhq.com/widget/form/h3mVMQOqKqHWL7IXnps2',
      fr: 'https://api.leadconnectorhq.com/widget/form/0mtsBAHbZ9Mgotzu43Nj'
    };
    const HEIGHT_MAP = { en: 611, es: 651, fr: 795 };
    const nextSrc = FORM_MAP[lang] || FORM_MAP.en;
    if(form.src !== nextSrc){ form.src = nextSrc; }
    const nextHeight = HEIGHT_MAP[lang] || HEIGHT_MAP.en;
    if(nextHeight){ form.style.height = `${nextHeight}px`; form.setAttribute('data-height', String(nextHeight)); }
  }
});

// Language dropdown menu
addEventListener('click', e => {
  const langToggle = e.target.closest('[data-lang-toggle]');
  const langMenu = document.querySelector('[data-lang-menu]');
  const langOption = e.target.closest('[data-lang]');
  
  if (langToggle) {
    langMenu.classList.toggle('active');
  } else if (langOption) {
    // Close menu after selection
    langMenu.classList.remove('active');
  } else if (!e.target.closest('.lang-dropdown')) {
    // Close menu when clicking outside
    langMenu.classList.remove('active');
  }
});
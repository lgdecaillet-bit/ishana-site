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
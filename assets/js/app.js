// Smooth scroll navigation function
function smoothScrollTo(targetId) {
  const targetElement = document.getElementById(targetId);
  if(targetElement) {
    const headerHeight = document.querySelector('.nav')?.offsetHeight || 0;
    const y = targetElement.getBoundingClientRect().top + scrollY - (headerHeight + 20);
    scrollTo({ top: y, behavior: 'smooth' });
    return true;
  }
  return false;
}

// Off-canvas menu
addEventListener('click', e=>{
  const btn = e.target.closest('[data-menu-toggle]');
  const close = e.target.closest('[data-menu-close]');
  const oc = document.querySelector('.offcanvas');
  if(btn && oc){
    oc.classList.add('active');
    oc.setAttribute('aria-hidden', 'false');
    try{ document.body.style.overflow='hidden'; }catch(_){ }
  }
  if(close || (oc && e.target.classList.contains('scrim'))){
    oc.classList.remove('active');
    oc.setAttribute('aria-hidden', 'true');
    try{ document.body.style.overflow=''; }catch(_){ }
  }
});

// Ripple feedback on selecting an off-canvas item + smooth scroll navigation
addEventListener('click', e=>{
  const link = e.target.closest('.offcanvas .panel a');
  if(!link) return;
  
  // Handle navigation for hash links
  const href = link.getAttribute('href');
  if(href && href.startsWith('#')) {
    const targetId = href.substring(1);
    
    if(smoothScrollTo(targetId)) {
      // Close the off-canvas menu
      const oc = document.querySelector('.offcanvas');
      if(oc) {
        oc.classList.remove('active');
        oc.setAttribute('aria-hidden', 'true');
        try{ document.body.style.overflow=''; }catch(_){ }
      }
    }
  }
  
  // Coordinates for ripple
  const r = link.getBoundingClientRect();
  const rx = ((e.clientX||0) - r.left);
  const ry = ((e.clientY||0) - r.top);
  link.style.setProperty('--rx', rx+'px');
  link.style.setProperty('--ry', ry+'px');
  link.classList.remove('ripple');
  // Force reflow to restart animation
  void link.offsetWidth;
  link.classList.add('ripple');
});

// Ripple on desktop header menu items + smooth scroll navigation
addEventListener('click', e=>{
  const link = e.target.closest('.menu a');
  if(!link) return;
  
  // Handle navigation for hash links
  const href = link.getAttribute('href');
  if(href && href.startsWith('#')) {
    const targetId = href.substring(1);
    smoothScrollTo(targetId);
  }
  
  const r = link.getBoundingClientRect();
  const rx = ((e.clientX||0) - r.left);
  const ry = ((e.clientY||0) - r.top);
  link.style.setProperty('--rx', rx+'px');
  link.style.setProperty('--ry', ry+'px');
  link.classList.remove('ripple');
  void link.offsetWidth;
  link.classList.add('ripple');
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

// Footer navigation links
addEventListener('click', e => {
  const link = e.target.closest('.footer-links a, .footer a[href^="#"]');
  if(!link) return;
  
  const href = link.getAttribute('href');
  if(href && href.startsWith('#')) {
    e.preventDefault();
    const targetId = href.substring(1);
    smoothScrollTo(targetId);
  }
});

// Active section indicator for navigation
(function() {
  const sections = ['home', 'difference', 'services', 'team', 'booking', 'faq', 'contact'];
  const navLinks = document.querySelectorAll('.offcanvas .panel a[href^="#"], .menu a[href^="#"]');
  
  function updateActiveSection() {
    const scrollPos = window.scrollY + 100; // Offset for header height
    
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(sections[i]);
      if (section && section.offsetTop <= scrollPos) {
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to current section link
        const activeLink = document.querySelector(`a[href="#${sections[i]}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
        break;
      }
    }
  }
  
  // Update on scroll
  let ticking = false;
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateActiveSection);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', () => {
    ticking = false;
    requestTick();
  });
  
  // Initial update
  updateActiveSection();
})();

// Iframe theme adaptation
(function() {
  function adaptIframesToTheme() {
    const iframes = document.querySelectorAll('#booking iframe, #contact iframe');
    const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
    
    iframes.forEach(iframe => {
      // Add wrapper if not exists
      if (!iframe.parentElement.classList.contains('iframe-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'iframe-wrapper';
        iframe.parentNode.insertBefore(wrapper, iframe);
        wrapper.appendChild(iframe);
      }
      
      // Apply theme-specific styling
      const wrapper = iframe.parentElement;
      if (isLightTheme) {
        wrapper.style.background = 'var(--ink)';
        wrapper.style.border = '1px solid rgba(0,0,0,0.1)';
        iframe.style.filter = 'invert(1) hue-rotate(180deg) contrast(1.1)';
      } else {
        wrapper.style.background = 'var(--obsidian)';
        wrapper.style.border = 'none';
        iframe.style.filter = 'none';
      }
    });
  }
  
  // Apply on theme change
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      setTimeout(adaptIframesToTheme, 100); // Small delay to ensure theme is applied
    });
  }
  
  // Apply on page load
  document.addEventListener('DOMContentLoaded', adaptIframesToTheme);
  
  // Apply when iframes load
  const iframes = document.querySelectorAll('#booking iframe, #contact iframe');
  iframes.forEach(iframe => {
    iframe.addEventListener('load', adaptIframesToTheme);
  });
})();
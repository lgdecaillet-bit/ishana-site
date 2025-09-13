(function(){
  const el = document.getElementById('heroShell');
  if(!el) return;
  try{
    if(window.matchMedia && window.matchMedia('(pointer: coarse)').matches){
      // Skip tilt effect on touch devices to improve mobile UX/perf
      return;
    }
  }catch(_){ }
  let rafId = null;
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
  function onMove(e){
    const r = el.getBoundingClientRect();
    const mx = (e.clientX - r.left) / r.width - 0.5;
    const my = (e.clientY - r.top) / r.height - 0.5;
    targetX = mx * 6; targetY = my * 6;
    if(!rafId){ rafId = requestAnimationFrame(apply); }
  }
  function apply(){
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    el.style.transform = `perspective(800px) rotateX(${ -currentY }deg) rotateY(${ currentX }deg)`;
    rafId = null;
  }
  el.addEventListener('mousemove', onMove);
  el.addEventListener('mouseleave', ()=>{ targetX = targetY = 0; if(!rafId){ rafId = requestAnimationFrame(apply); } });
})();

(function(){
  const items = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window) || !items.length){
    items.forEach(i=>i.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  items.forEach(el=>io.observe(el));
})();

(function(){
  const btn = document.getElementById('themeToggle');
  if(!btn) return;
  const root = document.documentElement;
  const stored = localStorage.getItem('ish-theme');
  if(stored) root.setAttribute('data-theme', stored);
  btn.addEventListener('click', ()=>{
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('ish-theme', next);
  });
})();



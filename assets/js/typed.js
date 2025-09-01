(function(){
  const el = document.querySelector("[data-typed]"); if(!el) return;
  const phrases = (el.dataset.phrases||"").split("|").map(s=>s.trim()).filter(Boolean);
  const typeSpeed  = +(el.dataset.typeSpeed  || 45);
  const eraseSpeed = +(el.dataset.eraseSpeed || 28);
  const hold       = +(el.dataset.hold       || 1500);
  let i=0,pos=0,dir=1;
  (function tick(){
    const p = phrases[i]||"";
    el.textContent = p.slice(0,pos);
    if(dir===1 && pos<p.length){ pos++; return setTimeout(tick,typeSpeed); }
    if(dir===1 && pos===p.length){ dir=0; return setTimeout(tick,hold); }
    if(dir===0 && pos>0){ pos--; return setTimeout(tick,eraseSpeed); }
    if(dir===0 && pos===0){ i=(i+1)%phrases.length; dir=1; setTimeout(tick,360); }
  })();
})();
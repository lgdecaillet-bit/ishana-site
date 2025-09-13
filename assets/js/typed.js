(function(){
  let activeGeneration = 0;

  function startTyped(overridePhrases){
    const el = document.querySelector('[data-typed]');
    if(!el) return;
    const phrasesSource = typeof overridePhrases === 'string' ? overridePhrases : (el.dataset.phrases||'');
    const phrases = phrasesSource.split('|').map(s=>s.trim()).filter(Boolean);
    const typeSpeed  = +(el.dataset.typeSpeed  || 60);
    const eraseSpeed = +(el.dataset.eraseSpeed || 38);
    const hold       = +(el.dataset.hold       || 1800);
    const myGen = ++activeGeneration;
    let i=0,pos=0,dir=1;
    (function tick(){
      if(myGen !== activeGeneration) return; // a newer run started; stop this one
      const p = phrases[i]||'';
      el.textContent = p.slice(0,pos);
      if(dir===1 && pos<p.length){ pos++; return setTimeout(tick,typeSpeed); }
      if(dir===1 && pos===p.length){ dir=0; return setTimeout(tick,hold); }
      if(dir===0 && pos>0){ pos--; return setTimeout(tick,eraseSpeed); }
      if(dir===0 && pos===0){ i=(i+1)%phrases.length; dir=1; setTimeout(tick,420); }
    })();
  }

  // Expose to global so other scripts can restart after phrases update
  try{ window.startTyped = startTyped; }catch(_){ }

  // Auto-start once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startTyped);
  } else {
    startTyped();
  }

  // Also restart when language changes
  document.addEventListener('ish:lang-changed', ()=>{ startTyped(); });
})();
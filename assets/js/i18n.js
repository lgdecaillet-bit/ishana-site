(function(){
  const SUPPORTED = ["en","es","fr"];
  const params = new URLSearchParams(location.search);
  const urlLang = params.get("lang");
  let lang = (urlLang && SUPPORTED.includes(urlLang)) ? urlLang :
             (localStorage.getItem("lang") || (navigator.language||"en").slice(0,2));
  if(!SUPPORTED.includes(lang)) lang = "en";

  // Keep URL consistent and persist
  if(urlLang !== lang){ params.set("lang", lang); history.replaceState({}, "", `${location.pathname}?${params.toString()}`); }
  localStorage.setItem("lang", lang);

  // Load dictionary and replace
  fetch(`/i18n/${lang}.json`, {cache:"no-cache"})
    .then(r=>r.json())
    .then(dict=>{
      document.querySelectorAll("[data-i18n]").forEach(el=>{
        const key = el.getAttribute("data-i18n");
        const val = dict[key];
        if(typeof val === "string") el.innerHTML = val; // allow <strong> in answers
      });
    });

  // Switcher
  document.addEventListener("click", e=>{
    const btn = e.target.closest("[data-lang]");
    if(!btn) return;
    const next = btn.getAttribute("data-lang");
    if(!SUPPORTED.includes(next)) return;
    const p = new URLSearchParams(location.search);
    p.set("lang", next);
    localStorage.setItem("lang", next);
    location.search = `?${p.toString()}`; // reload same page
  });
})();
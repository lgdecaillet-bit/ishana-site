// Geolocation-based language detection
(function() {
  'use strict';

  // Expanded language mapping - Spanish, French, and English with more countries
  const COUNTRY_LANGUAGE_MAP = {
    // Spanish-speaking countries (22 countries)
    'ES': 'es', // Spain
    'MX': 'es', // Mexico
    'AR': 'es', // Argentina
    'CO': 'es', // Colombia
    'PE': 'es', // Peru
    'VE': 'es', // Venezuela
    'CL': 'es', // Chile
    'EC': 'es', // Ecuador
    'GT': 'es', // Guatemala
    'CU': 'es', // Cuba
    'BO': 'es', // Bolivia
    'DO': 'es', // Dominican Republic
    'HN': 'es', // Honduras
    'PY': 'es', // Paraguay
    'SV': 'es', // El Salvador
    'NI': 'es', // Nicaragua
    'CR': 'es', // Costa Rica
    'PA': 'es', // Panama
    'UY': 'es', // Uruguay
    'GQ': 'es', // Equatorial Guinea
    'PH': 'es', // Philippines (Spanish influence)
    'GQ': 'es', // Equatorial Guinea
    'EH': 'es', // Western Sahara (Spanish influence)
    
    // French-speaking countries (50+ countries)
    'FR': 'fr', // France
    'CA': 'fr', // Canada (French regions: Quebec, New Brunswick, etc.)
    'BE': 'fr', // Belgium (Wallonia region)
    'CH': 'fr', // Switzerland default to French; regions handled below
    'LU': 'fr', // Luxembourg
    'MC': 'fr', // Monaco
    'AD': 'fr', // Andorra (French influence)
    'IT': 'fr', // Italy (Valle d'Aosta region)
    
    // French-speaking African countries
    'SN': 'fr', // Senegal
    'CI': 'fr', // Ivory Coast
    'ML': 'fr', // Mali
    'BF': 'fr', // Burkina Faso
    'NE': 'fr', // Niger
    'TD': 'fr', // Chad
    'MG': 'fr', // Madagascar
    'DJ': 'fr', // Djibouti
    'KM': 'fr', // Comoros
    'MU': 'fr', // Mauritius
    'SC': 'fr', // Seychelles
    'VU': 'fr', // Vanuatu
    'NC': 'fr', // New Caledonia
    'PF': 'fr', // French Polynesia
    'WF': 'fr', // Wallis and Futuna
    'HT': 'fr', // Haiti
    'RW': 'fr', // Rwanda
    'BI': 'fr', // Burundi
    'CF': 'fr', // Central African Republic
    'CG': 'fr', // Republic of Congo
    'CD': 'fr', // Democratic Republic of Congo
    'GA': 'fr', // Gabon
    'CM': 'fr', // Cameroon
    'TG': 'fr', // Togo
    'BJ': 'fr', // Benin
    'GN': 'fr', // Guinea
    'GW': 'fr', // Guinea-Bissau
    'MR': 'fr', // Mauritania
    'DZ': 'fr', // Algeria
    'TN': 'fr', // Tunisia
    'MA': 'fr', // Morocco
    'LB': 'fr', // Lebanon
    'SY': 'fr', // Syria
    'VN': 'fr', // Vietnam
    'LA': 'fr', // Laos
    'KH': 'fr', // Cambodia
    'IN': 'fr', // India (Puducherry region)
    
    // English-speaking countries (100+ countries)
    'US': 'en', // United States
    'GB': 'en', // United Kingdom
    'AU': 'en', // Australia
    'NZ': 'en', // New Zealand
    'IE': 'en', // Ireland
    'ZA': 'en', // South Africa
    'IN': 'en', // India (English regions)
    'SG': 'en', // Singapore
    'HK': 'en', // Hong Kong
    'PH': 'en', // Philippines (English regions)
    'CA': 'en', // Canada (English regions: Ontario, British Columbia, etc.)
    'BE': 'en', // Belgium (Flemish regions)
    // 'CH': 'en', // Removed: handled by region logic, default is 'fr'
    'LU': 'en', // Luxembourg (German regions)
    'AT': 'en', // Austria
    'DE': 'en', // Germany
    'IT': 'en', // Italy (most regions)
    'NL': 'en', // Netherlands
    'SE': 'en', // Sweden
    'NO': 'en', // Norway
    'DK': 'en', // Denmark
    'FI': 'en', // Finland
    'IS': 'en', // Iceland
    'PL': 'en', // Poland
    'CZ': 'en', // Czech Republic
    'SK': 'en', // Slovakia
    'HU': 'en', // Hungary
    'RO': 'en', // Romania
    'BG': 'en', // Bulgaria
    'HR': 'en', // Croatia
    'SI': 'en', // Slovenia
    'RS': 'en', // Serbia
    'BA': 'en', // Bosnia and Herzegovina
    'ME': 'en', // Montenegro
    'MK': 'en', // North Macedonia
    'AL': 'en', // Albania
    'EE': 'en', // Estonia
    'LV': 'en', // Latvia
    'LT': 'en', // Lithuania
    'RU': 'en', // Russia
    'BY': 'en', // Belarus
    'UA': 'en', // Ukraine
    'KZ': 'en', // Kazakhstan
    'UZ': 'en', // Uzbekistan
    'KG': 'en', // Kyrgyzstan
    'TJ': 'en', // Tajikistan
    'TM': 'en', // Turkmenistan
    'GE': 'en', // Georgia
    'AM': 'en', // Armenia
    'AZ': 'en', // Azerbaijan
    'MD': 'en', // Moldova
    'CN': 'en', // China
    'TW': 'en', // Taiwan
    'JP': 'en', // Japan
    'KR': 'en', // South Korea
    'TH': 'en', // Thailand
    'ID': 'en', // Indonesia
    'MY': 'en', // Malaysia
    'PK': 'en', // Pakistan
    'BD': 'en', // Bangladesh
    'LK': 'en', // Sri Lanka
    'NP': 'en', // Nepal
    'MM': 'en', // Myanmar
    'MN': 'en', // Mongolia
    'TR': 'en', // Turkey
    'IR': 'en', // Iran
    'IQ': 'en', // Iraq
    'SA': 'en', // Saudi Arabia
    'JO': 'en', // Jordan
    'IL': 'en', // Israel
    'AE': 'en', // UAE
    'QA': 'en', // Qatar
    'KW': 'en', // Kuwait
    'BH': 'en', // Bahrain
    'OM': 'en', // Oman
    'YE': 'en', // Yemen
    'NG': 'en', // Nigeria
    'KE': 'en', // Kenya
    'TZ': 'en', // Tanzania
    'UG': 'en', // Uganda
    'GH': 'en', // Ghana
    'ET': 'en', // Ethiopia
    'SO': 'en', // Somalia
    'SD': 'en', // Sudan
    'LY': 'en', // Libya
    
    // Additional English-speaking countries
    'JM': 'en', // Jamaica
    'BB': 'en', // Barbados
    'TT': 'en', // Trinidad and Tobago
    'GY': 'en', // Guyana
    'BZ': 'en', // Belize
    'FJ': 'en', // Fiji
    'PG': 'en', // Papua New Guinea
    'SB': 'en', // Solomon Islands
    'TO': 'en', // Tonga
    'WS': 'en', // Samoa
    'KI': 'en', // Kiribati
    'TV': 'en', // Tuvalu
    'NR': 'en', // Nauru
    'PW': 'en', // Palau
    'MH': 'en', // Marshall Islands
    'FM': 'en', // Micronesia
    'CK': 'en', // Cook Islands
    'NU': 'en', // Niue
    'TK': 'en', // Tokelau
    'AI': 'en', // Anguilla
    'VG': 'en', // British Virgin Islands
    'VI': 'en', // U.S. Virgin Islands
    'PR': 'en', // Puerto Rico
    'GU': 'en', // Guam
    'MP': 'en', // Northern Mariana Islands
    'AS': 'en', // American Samoa
    'FK': 'en', // Falkland Islands
    'GI': 'en', // Gibraltar
    'BM': 'en', // Bermuda
    'TC': 'en', // Turks and Caicos
    'KY': 'en', // Cayman Islands
    'MS': 'en', // Montserrat
    'SH': 'en', // Saint Helena
    'PN': 'en', // Pitcairn Islands
    'IO': 'en', // British Indian Ocean Territory
    'CX': 'en', // Christmas Island
    'CC': 'en', // Cocos Islands
    'NF': 'en', // Norfolk Island
    'HM': 'en', // Heard and McDonald Islands
    'AQ': 'en', // Antarctica (research stations)
  };

  // Function to detect language from country and region
  async function getLanguageFromCountry(countryCode, region = null) {
    // Check if we have a specific language mapping for this country
    if (COUNTRY_LANGUAGE_MAP[countryCode]) {
      return COUNTRY_LANGUAGE_MAP[countryCode];
    }
    
    // Special handling for multilingual countries
    if (countryCode === 'CH' && region) {
      // Switzerland: check specific regions
      const frenchRegions = ['GE', 'VD', 'NE', 'JU', 'FR', 'VS'];
      const germanRegions = ['ZH', 'BE', 'LU', 'UR', 'SZ', 'OW', 'NW', 'GL', 'AI', 'SG', 'AR', 'TG', 'SH', 'GR', 'AG', 'SO', 'BL', 'BS'];
      const italianRegions = ['TI'];
      
      if (frenchRegions.includes(region)) return 'fr';
      if (germanRegions.includes(region)) return 'en';
      if (italianRegions.includes(region)) return 'en';
      return 'fr'; // Default to French in CH
    }
    
    if (countryCode === 'CA' && region) {
      // Canada: check provinces
      const frenchProvinces = ['QC', 'NB'];
      if (frenchProvinces.includes(region)) return 'fr';
      return 'en'; // Other provinces default to English
    }
    
    if (countryCode === 'BE' && region) {
      // Belgium: check regions
      const frenchRegions = ['WAL', 'BRU']; // Wallonia and Brussels
      if (frenchRegions.includes(region)) return 'fr';
      return 'en'; // Flemish regions default to English
    }
    
    if (countryCode === 'US' && region) {
      // United States: check states with French influence
      const frenchStates = ['LA', 'ME']; // Louisiana and Maine
      if (frenchStates.includes(region)) return 'fr';
      return 'en'; // Other states default to English
    }
    
    if (countryCode === 'IT' && region) {
      // Italy: check Valle d'Aosta
      if (region === 'AO') return 'fr';
      return 'en'; // Other regions default to English
    }
    
    if (countryCode === 'IN' && region) {
      // India: check Puducherry (French influence)
      if (region === 'PY') return 'fr';
      return 'en'; // Other regions default to English
    }
    
    // Default to English for all other countries
    return 'en';
  }

  // Function to update intro phrases based on language
  function updateIntroPhrases(lang) {
    console.log('Updating intro phrases for language:', lang);
    
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
      // Load language file and update intro phrases
      fetch(`/i18n/${lang}.json`, { cache: 'no-cache' })
        .then(response => response.json())
        .then(data => {
          console.log('Language data loaded:', data);
          
          // Support both flat key "intro.phrases" and nested object { intro: { phrases } }
          let phrases = data && (data["intro.phrases"] || (data.intro && data.intro.phrases));
          if (Array.isArray(phrases)) { phrases = phrases.join('|'); }
          if (typeof phrases !== 'string') { phrases = ''; }

            const typedElement = document.querySelector('[data-typed]');
          if (!typedElement) {
            console.log('Typed element not found');
            return;
          }

          if (!phrases) {
            console.warn('No intro phrases found in language data for', lang);
            return;
          }

          console.log('Updating typed element with phrases:', phrases);
          // Update the data-phrases attribute
          typedElement.setAttribute('data-phrases', phrases);
          // Immediately reflect the first phrase so user sees correct language instantly
          try{
            const first = (phrases.split('|')[0]||'').trim();
            if(first) typedElement.textContent = first;
          }catch(_){ }
          // Restart our lightweight typed effect with retries until it's available
          (function tryStart(retries){
            try{
              if(typeof window.startTyped === 'function'){ window.startTyped(phrases); return; }
            }catch(_){ }
            if(retries>0) setTimeout(()=>tryStart(retries-1), 120);
          })(20);
        })
        .catch(error => {
          console.error('Error loading intro phrases:', error);
        });
    }
  }

  // Function to show intro content in detected language
  function showIntroInLanguage(lang) {
    console.log('=== SHOWING INTRO IN LANGUAGE:', lang, '===');
    
    // Show intro content
    const introContent = document.getElementById('introContent');
    if (introContent) {
      console.log('Showing intro content...');
      introContent.style.display = 'block';
      // Trigger fade in animation
      setTimeout(() => {
        introContent.classList.add('visible');
      }, 50);
    } else {
      console.log('Intro content not found!');
    }

    // Update intro phrases and start typing animation
    updateIntroPhrases(lang);
    // Ensure typed effect starts even if phrases already present
    try{ if(typeof window.startTyped === 'function'){ window.startTyped(); } }catch(_){ }
    
    // Update skip and CTA links
    const skipLink = document.getElementById('skipLink');
    const ctaLink = document.getElementById('ctaLink');
    
    if (skipLink) {
      skipLink.href = `/${lang}/home.html`;
    }
    if (ctaLink) {
      ctaLink.href = `/${lang}/home.html`;
    }
  }

  // Function to set language and update UI
  function setLanguage(lang) {
    // Persist and reflect immediately
    try { document.documentElement.setAttribute('lang', lang); } catch(_) {}
    localStorage.setItem('lang', lang);
      const params = new URLSearchParams(window.location.search);
      params.set('lang', lang);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}${location.hash||''}`);
    // Notify everyone (calendars/forms/i18n/typed)
    document.dispatchEvent(new CustomEvent('ish:lang-changed', { detail: { lang } }));
    // If on intro/index, update its content live
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
      showIntroInLanguage(lang);
    }
  }

  // Function to detect IP and country
  async function detectLocationAndSetLanguage() {
    console.log('=== DETECTING LOCATION STARTED ===');
    // Do not override explicit route-language pages like /en/home.html, /es/home.html, /fr/home.html
    try{
      const seg = window.location.pathname.split('/').filter(Boolean)[0];
      const onIntro = window.location.pathname.includes('index.html') || window.location.pathname === '/';
      const onHome = window.location.pathname.includes('home.html');
      const manual = localStorage.getItem('ish-lang-manual') === '1';
      // If user manually chose a language, skip geo only on content pages; always run on intro
      if (manual && !onIntro) { console.log('Manual language selected; skipping geo on content pages'); return; }
      if (['en','es','fr'].includes(seg) && onHome) {
        console.log('Route-based language detected (', seg, ') — skipping geo override on home');
        // Normalize storage to route language immediately
        try { document.documentElement.setAttribute('lang', seg); } catch(_) {}
        localStorage.setItem('lang', seg);
        return;
      }
    }catch(_){/* ignore */}
    
    let fallbackTimer = null;
    // Fast-show fallback if geo is slow (2s)
    try {
      if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        fallbackTimer = setTimeout(()=>{
          try{
            const storedLang = localStorage.getItem('lang');
            const browserLang = (navigator.language||'en').slice(0,2);
            const lang = (storedLang&&['en','es','fr'].includes(storedLang)) ? storedLang : (browserLang.startsWith('es')?'es':browserLang.startsWith('fr')?'fr':'en');
            showIntroInLanguage(lang);
          }catch(_){ showIntroInLanguage('en'); }
        }, 2000);
      }
    }catch(_){ }
    
    try {
      // Check if we already have a stored language preference
      const storedLang = localStorage.getItem('lang');
      const onIntro = window.location.pathname.includes('index.html') || window.location.pathname === '/';
      if (storedLang && ['en', 'es', 'fr'].includes(storedLang)) {
        console.log('Stored language preference found:', storedLang);
        if (!onIntro) {
          // On content pages, honor stored preference and skip geo
        showIntroInLanguage(storedLang);
        return;
        } else {
          // On the neutral intro page, show immediately in stored language,
          // but continue with geodetection and override once detected
          showIntroInLanguage(storedLang);
        }
      }

      console.log('Detecting location...');
      
      // Use ipapi.co for geolocation (free tier: 1000 requests/day)
      const response = await fetch('https://ipapi.co/json/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }

      const data = await response.json();
      console.log('Location data:', data);

      // Extract country code, region, and IP
      const countryCode = data.country_code;
      const region = data.region_code || data.region;
      const ipAddress = data.ip;
      
      // Log IP for tracking (as requested)
      console.log('User IP Address:', ipAddress);
      console.log('User Country:', countryCode);
      console.log('User Region:', region);

      // Determine language based on country and region
      const detectedLang = await getLanguageFromCountry(countryCode, region);
      console.log('Detected language:', detectedLang);

      // Apply on current page
      if (window.location.pathname.includes('home.html')) {
        // Do not override route pages even if geo differs
        const seg = window.location.pathname.split('/').filter(Boolean)[0];
        if(['en','es','fr'].includes(seg)) {
          console.log('On route page; not overriding with detected language');
          return;
        }
        setLanguage(detectedLang); // dispatch change (no reload)
      } else {
        // On intro: reflect detected language and update content
        setLanguage(detectedLang);
      }

      try{ if(fallbackTimer){ clearTimeout(fallbackTimer); } }catch(_){ }
    } catch (error) {
      console.error('Error detecting location:', error);
      
      // Fallback: try alternative service
      try {
        console.log('Trying alternative geolocation service...');
        const altResponse = await fetch('https://ipinfo.io/json', {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (altResponse.ok) {
          const altData = await altResponse.json();
          console.log('Alternative location data:', altData);
          
          const countryCode = altData.country;
          const region = altData.region;
          const ipAddress = altData.ip;
          
          console.log('User IP Address (alt):', ipAddress);
          console.log('User Country (alt):', countryCode);
          console.log('User Region (alt):', region);
          
          const detectedLang = await getLanguageFromCountry(countryCode, region);
          console.log('Detected language (alt):', detectedLang);
          if (window.location.pathname.includes('home.html')) {
            setLanguage(detectedLang);
          } else {
            setLanguage(detectedLang);
          }
        } else {
          throw new Error('Alternative service also failed');
        }
      } catch (altError) {
        console.error('Alternative service failed:', altError);
        
        // Final fallback: use browser language or default to English
        const browserLang = navigator.language || navigator.userLanguage;
        const fallbackLang = browserLang.startsWith('es') ? 'es' : 
                            browserLang.startsWith('fr') ? 'fr' : 'en';
        
        console.log('Using browser language fallback:', fallbackLang);
        setLanguage(fallbackLang);
      }
      try{ if(fallbackTimer){ clearTimeout(fallbackTimer); } }catch(_){ }
    }
  }

  // Run detection when DOM is loaded
  console.log('Setting up language detection...');
  console.log('Document ready state:', document.readyState);
  if (document.readyState === 'loading') {
    console.log('DOM still loading, adding event listener...');
    document.addEventListener('DOMContentLoaded', detectLocationAndSetLanguage);
  } else {
    console.log('DOM already loaded, running detection immediately...');
    detectLocationAndSetLanguage();
  }

  // Export function for manual use if needed
  window.geoDetect = {
    detectLocationAndSetLanguage,
    setLanguage,
    getLanguageFromCountry,
    updateIntroPhrases
  };

  console.log('Geo-detect script loaded successfully');
  console.log('Current page:', window.location.pathname);
  console.log('Intro content element:', document.getElementById('introContent'));

  // When language changes via header/footer on the intro page, reload phrases immediately
  document.addEventListener('ish:lang-changed', (e)=>{
    try{
      const next = (e.detail && e.detail.lang) || 'en';
      if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        showIntroInLanguage(next);
      }
    }catch(_){ }
  });

})();

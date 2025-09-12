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
    'CH': 'fr', // Switzerland (French regions: Geneva, Vaud, Neuchâtel, etc.)
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
    'CH': 'en', // Switzerland (German/Italian regions)
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
      if (germanRegions.includes(region)) return 'en'; // German regions default to English
      if (italianRegions.includes(region)) return 'en'; // Italian regions default to English
      return 'en'; // Default to English
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
      fetch(`/i18n/${lang}.json`)
        .then(response => response.json())
        .then(data => {
          console.log('Language data loaded:', data);
          
          if (data.intro && data.intro.phrases) {
            const typedElement = document.querySelector('[data-typed]');
            if (typedElement) {
              console.log('Updating typed element with phrases:', data.intro.phrases);
              
              // Update the data-phrases attribute
              typedElement.setAttribute('data-phrases', data.intro.phrases);
              
              // Wait for Typed.js to be available
              const initTyped = () => {
                if (window.Typed) {
                  console.log('Typed.js available, creating new instance');
                  
                  // Restart typing animation with new phrases
                  if (window.typedInstance) {
                    window.typedInstance.destroy();
                  }
                  
                  // Create new typed instance with translated phrases
                  window.typedInstance = new Typed(typedElement, {
                    strings: data.intro.phrases.split('|'),
                    typeSpeed: 45,
                    backSpeed: 28,
                    backDelay: 1500,
                    loop: true
                  });
                } else {
                  console.log('Typed.js not available yet, waiting...');
                  // Wait a bit more for Typed.js to load
                  setTimeout(initTyped, 100);
                }
              };
              
              initTyped();
            } else {
              console.log('Typed element not found');
            }
          } else {
            console.log('No intro phrases found in language data');
          }
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
    
    // Update skip and CTA links
    const skipLink = document.getElementById('skipLink');
    const ctaLink = document.getElementById('ctaLink');
    
    if (skipLink) {
      skipLink.href = `/home.html?lang=${lang}`;
    }
    if (ctaLink) {
      ctaLink.href = `/home.html?lang=${lang}`;
    }
  }

  // Function to set language and update UI
  function setLanguage(lang) {
    // Store in localStorage
    localStorage.setItem('lang', lang);
    
    // Update URL if on home.html
    if (window.location.pathname.includes('home.html')) {
      const params = new URLSearchParams(window.location.search);
      params.set('lang', lang);
      window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
      
      // Reload page to apply new language
      window.location.reload();
    }
    
    // Update intro page if on index.html
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
      const params = new URLSearchParams(window.location.search);
      params.set('lang', lang);
      // Don't redirect, just update the URL and content
      window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
      
      // Show intro content in detected language
      showIntroInLanguage(lang);
    }
  }

  // Function to detect IP and country
  async function detectLocationAndSetLanguage() {
    console.log('=== DETECTING LOCATION STARTED ===');
    
    try {
      // Check if we already have a stored language preference
      const storedLang = localStorage.getItem('lang');
      if (storedLang && ['en', 'es', 'fr'].includes(storedLang)) {
        console.log('Using stored language preference:', storedLang);
        showIntroInLanguage(storedLang);
        return;
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

      // Show intro in detected language
      showIntroInLanguage(detectedLang);

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
          
          showIntroInLanguage(detectedLang);
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
        showIntroInLanguage(fallbackLang);
      }
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

})();

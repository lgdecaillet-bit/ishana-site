// IP Address Logger for Analytics
(function() {
  'use strict';

  // Function to log IP address and location data
  async function logIPAddress() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        
        // Log IP and location data
        const logData = {
          timestamp: new Date().toISOString(),
          ip: data.ip,
          country: data.country_code,
          country_name: data.country_name,
          region: data.region,
          city: data.city,
          timezone: data.timezone,
          user_agent: navigator.userAgent,
          referrer: document.referrer || 'direct',
          page: window.location.pathname
        };

        // Log to console (you can replace this with your analytics service)
        console.log('IP Log Data:', logData);
        
        // You can send this data to your analytics service here
        // Example: sendToAnalytics(logData);
        
        // Store in localStorage for reference
        localStorage.setItem('lastIPLog', JSON.stringify(logData));
        
        return logData;
      }
    } catch (error) {
      console.error('Error logging IP address:', error);
    }
  }

  // Log IP when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', logIPAddress);
  } else {
    logIPAddress();
  }

  // Export function for manual use
  window.ipLogger = {
    logIPAddress,
    getLastLog: () => {
      const stored = localStorage.getItem('lastIPLog');
      return stored ? JSON.parse(stored) : null;
    }
  };

})();






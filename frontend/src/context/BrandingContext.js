import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const BrandingContext = createContext(null);

export const BrandingProvider = ({ children }) => {
  const [branding, setBranding] = useState(() => {
    const saved = localStorage.getItem('app_branding');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached branding', e);
        localStorage.removeItem('app_branding');
      }
    }
    return {
      logoLight: null,
      logoDark: null,
      faviconUrl: null,
      primaryColor: '#d45535',
      secondaryColor: '#221d3a',
      accentColor: '#6bfd4e',
    };
  });
  const [isBrandingLoading, setIsBrandingLoading] = useState(true);

  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const fetchBranding = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/cms/branding`);
      if (!res.ok) return;
      const data = await res.json();

      // Fix relative upload paths returned by backend
      const fixUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('/uploads/')) return `${API_URL}${url}`;
        return url;
      };

      const logoUrl = fixUrl(data.logo_url);
      const logoDarkUrl = fixUrl(data.logo_dark_url);

      const newBranding = {
        logoLight: logoUrl || logoDarkUrl || null,
        logoDark: logoDarkUrl || logoUrl || null,
        faviconUrl: fixUrl(data.favicon_url),
        primaryColor: data.primary_color || '#D4AF37',
        secondaryColor: data.secondary_color || '#1E293B',
        accentColor: data.accent_color || '#FCD34D',
      };

      setBranding(newBranding);
      localStorage.setItem('app_branding', JSON.stringify(newBranding));

      if (data.favicon_url) {
        applyFavicon(fixUrl(data.favicon_url));
      }
    } catch (err) {
      console.error('BrandingContext: failed to fetch branding', err);
    } finally {
      setIsBrandingLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchBranding();

    // Listen for branding updates triggered by AdminBranding after save
    const handler = () => fetchBranding();
    window.addEventListener('branding-updated', handler);
    return () => window.removeEventListener('branding-updated', handler);
  }, [fetchBranding]);

  return (
    <BrandingContext.Provider value={{ ...branding, isBrandingLoading, refetchBranding: fetchBranding }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => {
  const ctx = useContext(BrandingContext);
  if (!ctx) throw new Error('useBranding must be used within BrandingProvider');
  return ctx;
};

// Helper: update the <link rel="icon"> in <head>
function applyFavicon(url) {
  // Update all types of icon links
  const links = document.querySelectorAll("link[rel*='icon']");
  links.forEach(link => {
    link.href = url;
    if (url.endsWith('.svg')) link.type = 'image/svg+xml';
    else if (url.endsWith('.png')) link.type = 'image/png';
  });

  if (links.length === 0) {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = url;
    document.head.appendChild(link);
  }
}

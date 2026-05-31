import { useEffect } from 'react';

// Registra /sw.js una volta al mount. Disabilitato in dev (il dev server non
// ne ha bisogno e un precache stale confonderebbe l'HMR).
export const ServiceWorkerRegister = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;
    if (import.meta.env.DEV) return;

    const onLoad = () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('SW registration failed:', err);
      });
    };

    if (document.readyState === 'complete') {
      onLoad();
      return;
    }
    window.addEventListener('load', onLoad, { once: true });
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return null;
};

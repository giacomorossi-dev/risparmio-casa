import { useCallback, useEffect, useState } from 'react';

// Utility "pinnate" dall'utente. Per ora persistite in localStorage; quando ci
// sposteremo sul database basterà sostituire lettura/scrittura qui dentro (questo
// hook è l'unico punto di integrazione con lo storage).
const STORAGE_KEY = 'utilita:pinned';

export function usePinned() {
  const [pinned, setPinned] = useState<string[]>([]);

  // Lettura post-mount: SSR parte vuoto, poi si idrata dal localStorage.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed))
          setPinned(parsed.filter((x): x is string => typeof x === 'string'));
      }
    } catch {
      /* storage non disponibile — ignora */
    }
  }, []);

  const toggle = useCallback((slug: string) => {
    setPinned((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* storage non disponibile — ignora */
      }
      return next;
    });
  }, []);

  const isPinned = useCallback((slug: string) => pinned.includes(slug), [pinned]);

  return { pinned, isPinned, toggle };
}

'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'proowrx-theme';

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

export default function ThemeProvider({ children }) {
  const pathname = usePathname();
  const dashboardRoute = pathname?.startsWith('/dashboard');
  const [theme, setThemeState] = useState('system');
  const [resolvedTheme, setResolvedTheme] = useState('light');

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem(STORAGE_KEY) || 'system';

    function applyTheme(nextTheme) {
      const preferred = nextTheme === 'system' ? getSystemTheme() : nextTheme;
      const resolved = dashboardRoute ? preferred : 'light';
      document.documentElement.classList.toggle('dark', resolved === 'dark');
      setResolvedTheme(resolved);
    }

    // Intentional: hydrate the persisted client-only preference after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(savedTheme);
    applyTheme(savedTheme);

    const handleSystemChange = () => {
      if ((localStorage.getItem(STORAGE_KEY) || 'system') === 'system') applyTheme('system');
    };

    media.addEventListener('change', handleSystemChange);
    return () => media.removeEventListener('change', handleSystemChange);
  }, [dashboardRoute]);

  const setTheme = useCallback((nextTheme) => {
    localStorage.setItem(STORAGE_KEY, nextTheme);
    setThemeState(nextTheme);
    const preferred = nextTheme === 'system' ? getSystemTheme() : nextTheme;
    const resolved = dashboardRoute ? preferred : 'light';
    document.documentElement.classList.toggle('dark', resolved === 'dark');
    setResolvedTheme(resolved);
  }, [dashboardRoute]);

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

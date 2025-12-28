import { useEffect } from 'react';

export const useTheme = () => {
  useEffect(() => {
    // Always set dark mode as default
    document.documentElement.classList.add('dark');
    // Remove any saved light theme preference
    localStorage.removeItem('theme');
  }, []);

  // Return theme as 'dark' for any components that might still reference it
  return { theme: 'dark' as const };
};
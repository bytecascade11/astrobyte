// src/components/Comments.tsx
import React, { useEffect, useState } from 'react';
import Giscus from '@giscus/react';

type Theme = 'light' | 'dark';

interface Props {
  lightTheme?: string;
  darkTheme?: string;
}

const Comments: React.FC<Props> = ({ lightTheme = 'light', darkTheme = 'dark' }) => {
  const [theme, setTheme] = useState<Theme>('light');

  // Load theme from localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  // Watch for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setTheme(mediaQuery.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Watch for theme toggle button
  useEffect(() => {
    const themeBtn = document.querySelector('#theme-btn');
    if (!themeBtn) return;

    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <Giscus
      repo="bytecascade11/astrobyte"
      repoId="R_kgDOQobjBQ"
      category="General"
      categoryId="DIC_kwDOQobjBc4C0Dd5"
      mapping="pathname"
      strict="1"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme={theme === 'dark' ? darkTheme : lightTheme}
      lang="en"
      loading="lazy"
    />
  );
};

export default Comments;

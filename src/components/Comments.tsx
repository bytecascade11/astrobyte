import { useEffect, useState } from 'react';
import Giscus from '@giscus/react';

type Theme = 'light' | 'dark';

interface Props {
  lightTheme?: string;
  darkTheme?: string;
}

export default function Comments({ lightTheme = 'light', darkTheme = 'dark' }: Props) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      setTheme(mediaQuery.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const themeBtn = document.querySelector('#theme-btn');
    if (themeBtn) {
      const observer = new MutationObserver(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setTheme(isDark ? 'dark' : 'light');
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      return () => observer.disconnect();
    }
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
    }

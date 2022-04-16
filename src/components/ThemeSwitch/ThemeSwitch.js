import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from '@heroicons/react/outline';

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  return (
    <button
      role='switch'
      aria-label='Toggle Dark Mode'
      type='button'
      className='btn btn-square btn-ghost'
      onClick={() =>
        setTheme(
          theme === 'dark' || resolvedTheme === 'dark' ? 'light' : 'dark'
        )
      }
    >
      {mounted && (theme === 'dark' || resolvedTheme === 'dark') ? (
        <MoonIcon className='inline-block w-6 h-6 stroke-current' />
      ) : (
        <SunIcon className='inline-block w-6 h-6 stroke-current' />
      )}
    </button>
  );
};

export default ThemeSwitch;

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
      className='btn btn-square btn-ghost btn-sm'
      onClick={() =>
        setTheme(
          theme === 'dark' || resolvedTheme === 'dark' ? 'light' : 'dark'
        )
      }
    >
      {mounted && (theme === 'dark' || resolvedTheme === 'dark') ? (
        <MoonIcon className='inline-block w-4 h-4 stroke-current md:w-6 md:h-6' />
      ) : (
        <SunIcon className='inline-block w-4 h-4 stroke-current md:w-6 md:h-6' />
      )}
    </button>
  );
};

export default ThemeSwitch;

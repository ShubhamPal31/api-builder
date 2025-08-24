import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../context/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full border border-gray-300 dark:border-gray-600
                 bg-gray-100 dark:bg-gray-800 
                 hover:bg-gray-200 dark:hover:bg-gray-700
                 transition-all duration-300 ease-in-out
                 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        <MoonIcon className="h-5 w-5 text-gray-800 transition-transform duration-300" />
      ) : (
        <SunIcon className="h-5 w-5 text-yellow-400 transition-transform duration-300" />
      )}
    </button>
  );
}

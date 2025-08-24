import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function AppShell({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4 
                         border-b border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-gray-800 shadow-md"
      >
        {/* Left: Logo */}
        <h1
          onClick={() => navigate('/dashboard')}
          className="text-xl font-bold text-gray-800 dark:text-gray-100 cursor-pointer hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
        >
          API Builder
        </h1>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm rounded-md border border-red-500 
                       text-red-500 hover:bg-red-500 hover:text-white 
                       transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

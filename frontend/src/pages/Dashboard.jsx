import { useEffect, useState } from 'react';
import axios from 'axios';
import CreateMockApi from '../components/CreateMockApi';
import MockApiList from '../components/MockApiList';
import AdminDashboard from '../components/AdminDashboard';
import { useTheme } from '../context/useTheme';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [refresh, setRefresh] = useState(false);
  const [user, setUser] = useState(null);
  const { theme, toggleTheme } = useTheme();

  const handleRefresh = () => setRefresh(!refresh);

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };

    fetchUser();
  }, []);

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-300">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Welcome, {user.name} 👋
          </h2>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition"
              title="Toggle theme"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5 text-yellow-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-800" />
              )}
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-md border border-red-500 text-red-500
                        hover:bg-red-500 hover:text-white transition text-sm sm:text-base"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Create API */}
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Create New Mock API
          </h3>
          <CreateMockApi onApiCreated={handleRefresh} />
        </section>

        {/* API List */}
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Your Mock APIs
          </h3>
          <MockApiList key={refresh} />
        </section>

        {/* Admin Section */}
        {user.role === 'admin' && (
          <section className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl p-4 sm:p-6 shadow-inner">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              🔒 Admin Panel
            </h3>
            <AdminDashboard />
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

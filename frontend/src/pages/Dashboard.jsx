import { useEffect, useState } from 'react';
import axios from 'axios';
import CreateMockApi from '../components/CreateMockApi';
import MockApiList from '../components/MockApiList';
import AdminDashboard from '../components/AdminDashboard';
import { useTheme } from '../context/useTheme';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

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
        const res = await axios.get('http://localhost:5000/api/auth/profile', {
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
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-600 dark:text-gray-300">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
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
                        hover:bg-red-500 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Create API */}
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Create New Mock API
          </h3>
          <CreateMockApi onApiCreated={handleRefresh} />
        </section>

        {/* API List */}
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Your Mock APIs
          </h3>
          <MockApiList key={refresh} />
        </section>

        {/* Admin Section */}
        {user.role === 'admin' && (
          <section className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl p-6 shadow-inner">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
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

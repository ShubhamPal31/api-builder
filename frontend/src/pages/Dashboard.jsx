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
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Welcome, {user.name} 👋
        </h2>

        <div className="flex items-center space-x-3">
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
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Create API */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 mb-6 transition-colors">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
          Create New Mock API
        </h3>
        <CreateMockApi onApiCreated={handleRefresh} />
      </div>

      {/* API List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 mb-6 transition-colors">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
          Your Mock APIs
        </h3>
        <MockApiList key={refresh} />
      </div>

      {/* Admin Section */}
      {user.role === 'admin' && (
        <div className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-6 mt-8 shadow-inner transition-colors">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            🔒 Admin Panel
          </h3>
          <AdminDashboard />
        </div>
      )}
    </div>
  );
};

export default Dashboard;

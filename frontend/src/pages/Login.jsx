import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);

      setMessage('✅ Login successful!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
        {/* Title */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          Login to Your Account
        </h2>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 text-center text-sm sm:text-base font-medium ${
              message.includes('✅')
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-500 dark:text-red-400'
            }`}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm sm:text-base text-gray-700 dark:text-gray-200 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 
                         placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm sm:text-base text-gray-700 dark:text-gray-200 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 
                         placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 sm:py-3 rounded-lg 
                       hover:bg-blue-700 dark:hover:bg-blue-500 
                       transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
          >
            Login
          </button>
        </form>

        {/* Register link */}
        <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-6">
          Don’t have an account?{' '}
          <Link
            to="/register"
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

import { useEffect, useState } from 'react';
import axios from 'axios';
import CreateMockApi from '../components/CreateMockApi';
import MockApiList from '../components/MockApiList';
import AdminDashboard from '../components/AdminDashboard';
const Dashboard = () => {
  const [refresh, setRefresh] = useState(false);
  const [user, setUser] = useState(null);

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

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2>Welcome {user.name}</h2>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          style={{
            background: 'red',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>

      <CreateMockApi onApiCreated={handleRefresh} />
      <MockApiList key={refresh} />

      {/* Admin Section */}
      {user.role === 'admin' && (
        <div
          style={{
            border: '1px solid #ccc',
            padding: '1rem',
            marginTop: '2rem',
          }}
        >
          <h3>🔒 Admin Panel</h3>
          <AdminDashboard />
        </div>
      )}
    </div>
  );
};

export default Dashboard;

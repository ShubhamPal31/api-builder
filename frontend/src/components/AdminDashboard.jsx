import { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const promoteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/admin/promote/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('User promoted to admin!');
      fetchUsers(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Promotion failed');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h4>All Registered Users</h4>
      <ul>
        {users.map((u) => (
          <li key={u._id} style={{ marginBottom: '8px' }}>
            <strong>{u.name}</strong> ({u.email}) - Role: {u.role}
            {u.role !== 'admin' && (
              <button
                style={{ marginLeft: '10px' }}
                onClick={() => promoteUser(u._id)}
              >
                Promote to Admin
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;

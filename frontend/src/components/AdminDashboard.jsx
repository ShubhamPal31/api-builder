import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mockApis, setMockApis] = useState([]);

  const token = localStorage.getItem('token');

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  }, [token]);

  const promoteUser = async (userId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/promote/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('User promoted to admin!');
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Promotion failed');
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('User deleted');
      fetchUsers();
      if (selectedUser === userId) {
        setMockApis([]);
        setSelectedUser(null);
      }
    } catch (err) {
      console.error(err);
      alert('User deletion failed');
    }
  };

  const fetchMockApis = async (userId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/users/${userId}/mocks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedUser(userId);
      setMockApis(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch mock APIs');
    }
  };

  const deleteMockApi = async (userId, mockId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/users/${userId}/mocks/${mockId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMockApis((prev) => prev.filter((mock) => mock._id !== mockId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete mock API');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Dashboard</h2>
      <h4>All Registered Users</h4>
      <ul>
        {users.map((u) => (
          <li key={u._id} style={{ marginBottom: '10px' }}>
            <strong>{u.name}</strong> ({u.email}) - Role: {u.role}
            {u.role !== 'admin' && (
              <button
                style={{ marginLeft: '10px' }}
                onClick={() => promoteUser(u._id)}
              >
                Promote to Admin
              </button>
            )}
            <button
              style={{ marginLeft: '10px' }}
              onClick={() => fetchMockApis(u._id)}
            >
              View Mock APIs
            </button>
            <button
              style={{
                marginLeft: '10px',
                backgroundColor: 'red',
                color: 'white',
              }}
              onClick={() => deleteUser(u._id)}
            >
              Delete User
            </button>
          </li>
        ))}
      </ul>

      {selectedUser && (
        <div style={{ marginTop: '2rem' }}>
          <h4>Mock APIs of Selected User</h4>
          {mockApis.length === 0 ? (
            <p>No mock APIs found for this user.</p>
          ) : (
            <ul>
              {mockApis.map((mock) => (
                <li
                  key={mock._id}
                  style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    marginBottom: '10px',
                  }}
                >
                  <strong>{mock.method}</strong> {mock.endpoint}
                  <div>
                    <code>http://localhost:5000/api/mock/serve/{mock._id}</code>
                    <button
                      style={{ marginLeft: '10px' }}
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `http://localhost:5000/api/mock/serve/${mock._id}`
                        )
                      }
                    >
                      Copy Link
                    </button>
                  </div>
                  <div style={{ marginTop: '5px' }}>
                    <strong>Response:</strong>
                    <pre>{JSON.stringify(mock.response, null, 2)}</pre>
                  </div>
                  <button
                    style={{
                      marginTop: '5px',
                      color: 'white',
                      backgroundColor: 'red',
                    }}
                    onClick={() => deleteMockApi(selectedUser, mock._id)}
                  >
                    Delete Mock API
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

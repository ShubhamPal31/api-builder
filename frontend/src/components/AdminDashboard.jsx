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

  const promoteUser = async (id) => {
    await axios.put(
      `http://localhost:5000/api/admin/promote/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchUsers();
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
    if (selectedUser === id) {
      setMockApis([]);
      setSelectedUser(null);
    }
  };

  const fetchMockApis = async (id) => {
    const res = await axios.get(
      `http://localhost:5000/api/admin/users/${id}/mocks`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setSelectedUser(id);
    setMockApis(res.data);
  };

  const deleteMockApi = async (userId, mockId) => {
    await axios.delete(
      `http://localhost:5000/api/admin/users/${userId}/mocks/${mockId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setMockApis((prev) => prev.filter((m) => m._id !== mockId));
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
        👑 Admin Dashboard
      </h2>

      {/* Users list */}
      <div className="space-y-3">
        {users.map((u) => (
          <div
            key={u._id}
            className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-100">
                {u.name}
              </p>
              <p className="text-sm text-gray-500">{u.email}</p>
              <span
                className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${
                  u.role === 'admin'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {u.role}
              </span>
            </div>
            <div className="flex gap-2">
              {u.role !== 'admin' && (
                <button
                  onClick={() => promoteUser(u._id)}
                  className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                >
                  Promote
                </button>
              )}
              <button
                onClick={() => fetchMockApis(u._id)}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
              >
                View APIs
              </button>
              <button
                onClick={() => deleteUser(u._id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mock APIs for selected user */}
      {selectedUser && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-600">
          <h3 className="text-lg font-semibold mb-3">User’s Mock APIs</h3>
          {mockApis.length === 0 ? (
            <p className="text-gray-500">No mock APIs found.</p>
          ) : (
            <div className="space-y-3">
              {mockApis.map((m) => (
                <div
                  key={m._id}
                  className="border border-gray-200 dark:border-gray-600 rounded p-3 flex justify-between items-start"
                >
                  <div>
                    <span className="inline-block text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-medium">
                      {m.method}
                    </span>
                    <p className="font-mono text-sm mt-1">{m.endpoint}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      <code>http://localhost:5000/api/mock/serve/{m._id}</code>
                    </p>
                  </div>
                  <button
                    onClick={() => deleteMockApi(selectedUser, m._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

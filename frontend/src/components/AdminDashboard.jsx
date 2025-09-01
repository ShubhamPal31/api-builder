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

  const fetchMockApis = async (user) => {
    const res = await axios.get(
      `http://localhost:5000/api/admin/users/${user._id}/mocks`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setSelectedUser(user);
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
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">
        👑 Admin Dashboard
      </h2>

      {/* Users list */}
      <div className="space-y-3">
        {users.map((u) => (
          <div
            key={u._id}
            className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
          >
            <div className="flex-1">
              <p className="font-semibold text-gray-800 dark:text-gray-100 break-words">
                {u.name}
              </p>
              <p className="text-sm text-gray-500 break-all">{u.email}</p>
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
            <div className="flex flex-wrap gap-2">
              {u.role !== 'admin' && (
                <button
                  onClick={() => promoteUser(u._id)}
                  className="px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 w-full sm:w-auto"
                >
                  Promote
                </button>
              )}
              <button
                onClick={() => fetchMockApis(u)}
                className="px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 w-full sm:w-auto"
              >
                View APIs
              </button>
              <button
                onClick={() => deleteUser(u._id)}
                className="px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 w-full sm:w-auto"
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
          <h3 className="text-md sm:text-lg font-semibold mb-3">
            {`User ${selectedUser.name}'s Mock APIs`}
          </h3>
          {mockApis.length === 0 ? (
            <p className="text-gray-500 text-sm">No mock APIs found.</p>
          ) : (
            <div className="space-y-3">
              {mockApis.map((m) => (
                <div
                  key={m._id}
                  className="border border-gray-200 dark:border-gray-600 rounded p-3 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3"
                >
                  <div className="flex-1">
                    <span className="inline-block text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-medium">
                      {m.method}
                    </span>
                    <p className="font-mono text-sm mt-1 break-words">
                      {m.endpoint}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 break-all">
                      <code>{`http://localhost:5000/api/mock${m.endpoint}/${m._id}`}</code>
                    </p>
                  </div>
                  <button
                    onClick={() => deleteMockApi(selectedUser, m._id)}
                    className="px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 w-full sm:w-auto"
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

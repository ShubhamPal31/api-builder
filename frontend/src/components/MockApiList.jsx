import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PencilSquareIcon,
  TrashIcon,
  ClipboardIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

const MockApiList = () => {
  const [mocks, setMocks] = useState([]);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    method: '',
    endpoint: '',
    response: '',
  });
  const [copiedId, setCopiedId] = useState(null);

  const fetchMocks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/mock/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMocks(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch mocks');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/mock/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMocks();
    } catch {
      alert('Failed to delete');
    }
  };

  const handleEditClick = (mock) => {
    setEditId(mock._id);
    setEditData({
      method: mock.method,
      endpoint: mock.endpoint,
      response: JSON.stringify(mock.response, null, 2),
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/mock/${editId}`,
        {
          ...editData,
          response: JSON.parse(editData.response),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditId(null);
      fetchMocks();
    } catch {
      alert('Update failed. Ensure response is valid JSON.');
    }
  };

  const handleCopy = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  useEffect(() => {
    fetchMocks();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 transition-colors">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Your Mock APIs
      </h3>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <div className="space-y-4">
        {mocks.map((mock) =>
          editId === mock._id ? (
            <form
              key={mock._id}
              onSubmit={handleUpdate}
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-3"
            >
              <select
                name="method"
                value={editData.method}
                onChange={(e) =>
                  setEditData({ ...editData, method: e.target.value })
                }
                className="px-3 py-2 rounded-lg border dark:bg-gray-800 dark:text-gray-100"
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>
              <input
                type="text"
                name="endpoint"
                value={editData.endpoint}
                onChange={(e) =>
                  setEditData({ ...editData, endpoint: e.target.value })
                }
                required
                className="w-full px-3 py-2 rounded-lg border dark:bg-gray-800 dark:text-gray-100"
              />
              <textarea
                name="response"
                rows={6}
                value={editData.response}
                onChange={(e) =>
                  setEditData({ ...editData, response: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border font-mono dark:bg-gray-800 dark:text-gray-100"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditId(null)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div
              key={mock._id}
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 flex justify-between items-start"
            >
              <div>
                <span className="inline-block text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-700 font-medium">
                  {mock.method}
                </span>
                <p className="font-mono text-sm mt-1">{mock.endpoint}</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <code className="truncate">
                    http://localhost:5000/api/mock/serve/{mock._id}
                  </code>
                  <button
                    onClick={() =>
                      handleCopy(
                        mock._id,
                        `http://localhost:5000/api/mock/serve/${mock._id}`
                      )
                    }
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    {copiedId === mock._id ? (
                      <CheckIcon className="w-4 h-4 text-green-500" />
                    ) : (
                      <ClipboardIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(mock)}
                  className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(mock._id)}
                  className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-700"
                >
                  <TrashIcon className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MockApiList;

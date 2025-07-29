import { useEffect, useState } from 'react';
import axios from 'axios';

const MockApiList = () => {
  const [mocks, setMocks] = useState([]);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null); // ID of the mock being edited
  const [editData, setEditData] = useState({
    method: '',
    endpoint: '',
    response: '',
  });

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
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleEditClick = (mock) => {
    setEditId(mock._id);
    setEditData({
      method: mock.method,
      endpoint: mock.endpoint,
      response: mock.response,
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/mock/${editId}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditId(null); // exit edit mode
      fetchMocks();
    } catch (err) {
      alert('Update failed');
    }
  };

  useEffect(() => {
    fetchMocks();
  }, []);

  return (
    <div>
      <h3>Your Mock APIs</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {mocks.map((mock) => (
          <li key={mock._id}>
            {editId === mock._id ? (
              <form onSubmit={handleUpdate}>
                <select
                  name="method"
                  value={editData.method}
                  onChange={handleEditChange}
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
                  onChange={handleEditChange}
                  required
                />
                <textarea
                  name="response"
                  value={editData.response}
                  onChange={handleEditChange}
                  required
                />
                <button type="submit">Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </form>
            ) : (
              <>
                <strong>{mock.method}</strong> {mock.endpoint}
                <button
                  onClick={() => handleEditClick(mock)}
                  style={{ marginLeft: '10px' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(mock._id)}
                  style={{ marginLeft: '5px' }}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MockApiList;

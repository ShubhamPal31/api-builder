import { useEffect, useState } from 'react';
import axios from 'axios';

const MockApiList = () => {
  const [mocks, setMocks] = useState([]);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
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
      console.log(err);
      alert('Failed to delete');
    }
  };

  const handleEditClick = (mock) => {
    setEditId(mock._id);
    setEditData({
      method: mock.method,
      endpoint: mock.endpoint,
      response: JSON.stringify(mock.response, null, 2), // Pretty JSON
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/mock/${editId}`,
        {
          ...editData,
          response: JSON.parse(editData.response), // Convert string back to object
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditId(null);
      fetchMocks();
    } catch (err) {
      console.log(err);
      alert('Update failed. Ensure response is valid JSON.');
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
          <li key={mock._id} style={{ marginBottom: '20px' }}>
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
                  rows={6}
                  cols={50}
                />
                <br />
                <button type="submit">Save</button>
                <button onClick={() => setEditId(null)} type="button">
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <strong>{mock.method}</strong> {mock.endpoint}
                <div style={{ marginTop: '4px', marginBottom: '4px' }}>
                  <code>http://localhost:5000/api/mock/serve/{mock._id}</code>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `http://localhost:5000/api/mock/serve/${mock._id}`
                      )
                    }
                    style={{ marginLeft: '10px' }}
                  >
                    Copy Link
                  </button>
                </div>
                <button
                  onClick={() => handleEditClick(mock)}
                  style={{ marginRight: '5px' }}
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(mock._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MockApiList;

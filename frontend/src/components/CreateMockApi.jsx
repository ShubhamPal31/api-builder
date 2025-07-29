import { useState } from 'react';
import axios from 'axios';

const CreateMockApi = ({ onApiCreated }) => {
  const [method, setMethod] = useState('GET');
  const [endpoint, setEndpoint] = useState('');
  const [response, setResponse] = useState('');
  const [message, setMessage] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/mock/create',
        { method, endpoint, response },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage('Mock API created!');
      onApiCreated(); // Refresh the list
      setMethod('GET');
      setEndpoint('');
      setResponse('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error creating mock API');
    }
  };

  return (
    <div>
      <h3>Create Mock API</h3>
      <form onSubmit={handleCreate}>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>
        <br />
        <br />
        <input
          type="text"
          placeholder="/your-endpoint"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          required
        />
        <br />
        <br />
        <textarea
          placeholder="Response JSON"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          required
        />
        <br />
        <br />
        <button type="submit">Create</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default CreateMockApi;

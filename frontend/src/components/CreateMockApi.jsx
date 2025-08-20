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

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(response); // Validate JSON
      } catch {
        setMessage('❌ Invalid JSON format in response');
        return;
      }

      await axios.post(
        'http://localhost:5000/api/mock/create',
        { method, endpoint, response: parsedResponse },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage('✅ Mock API created!');
      onApiCreated(); // Refresh list
      setMethod('GET');
      setEndpoint('');
      setResponse('');
    } catch (err) {
      setMessage(err.response?.data?.message || '⚠️ Error creating mock API');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-6 w-full max-w-lg mx-auto">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Create Mock API
      </h3>

      <form onSubmit={handleCreate} className="space-y-4">
        {/* Method Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            HTTP Method
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none 
             bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        {/* Endpoint Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Endpoint
          </label>
          <input
            type="text"
            placeholder="/your-endpoint"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none 
              bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        {/* Response JSON */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Response (JSON)
          </label>
          <textarea
            placeholder='{"message": "success"}'
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            required
            rows="5"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono
              bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Create API
        </button>
      </form>

      {/* Message */}
      {message && (
        <p
          className={`mt-4 text-sm font-medium ${
            message.includes('✅')
              ? 'text-green-600'
              : message.includes('❌')
              ? 'text-red-600'
              : 'text-yellow-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default CreateMockApi;

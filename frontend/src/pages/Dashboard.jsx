import CreateMockApi from '../components/CreateMockApi';
import MockApiList from '../components/MockApiList';
import { useState } from 'react';

const Dashboard = () => {
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => setRefresh(!refresh);

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2>Welcome to Dashboard</h2>
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
    </div>
  );
};

export default Dashboard;

import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

// helper function to check auth token
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    // decode token payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now(); // check expiry
  } catch (err) {
    console.log(err);
    return false;
  }
};

function App() {
  return (
    <Routes>
      {/* root route */}
      <Route
        path="/"
        element={
          isAuthenticated() ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* catch-all for wrong routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;

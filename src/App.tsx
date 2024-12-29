import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { validateAccessToken, refreshAccessToken } from './Utils/authUtils';
import AddProducts from './Pages/AddProducts';
import Login from './Pages/Login';
import Signup from './Pages/Signup';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkTokenValidity = async () => {
      const isValid = await validateAccessToken();
      
      if (isValid===200) {
        setLoading(false); 
        console.log(isValid)
        console.log("helo")
        return;
      }

      // If the token is invalid, try refreshing it
      const newAccessToken = await refreshAccessToken();
      
      if (newAccessToken) {
        setLoading(false); // If refresh is successful, continue loading the page
      } else {
        // If refresh failed, redirect to login page
        navigate('/login');
      }
    };

    checkTokenValidity();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // Display loading while checking or refreshing token
  }

  return children; // Return protected content if valid or refreshed
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AddProducts />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import AddProducts from "./Pages/AddProducts";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";

// Function to get access token from localStorage
const getTokenFromLocalStorage = () => {
  return localStorage.getItem('access_token');
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const token = getTokenFromLocalStorage();

  useEffect(() => {
    if (!token ) {
      navigate("/login"); // Redirect to login if no token or user
    }
  }, [token, navigate]);

  return children; // Return protected content if user is logged in
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

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddProducts from './Pages/AddProducts';
import Login from './Pages/Login';
import Signup from './Pages/Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AddProducts />} />
      </Routes>
    </Router>
  );
}

export default App;

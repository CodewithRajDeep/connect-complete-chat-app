import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { useAuthContext } from './context/AuthContext.jsx';
import Home from './pages/home/Home.jsx';
import Login from './pages/Login/Login.jsx';
import SignUp from './pages/signup/SignUp.jsx';
import axios from 'axios';

const API_URL = 'https://connect-chat-app-api.vercel.app/api/auth';

function App() {
  const { authUser, setAuthUser } = useAuthContext(); 

  
  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      console.log('Login Response:', response.data);
      
      setAuthUser(response.data);
    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message);
    }
  };

  
  const handleSignup = async (fullName, username, password, confirmPassword, gender) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        fullName,
        username,
        password,
        confirmPassword,
        gender,
      });
      console.log('Signup Response:', response.data);
      
      setAuthUser(response.data);
    } catch (error) {
      console.error('Signup Error:', error.response?.data || error.message);
    }
  };

  return (
    <div className='p-4 h-screen flex items-center justify-center'>
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        <Route path="/signup" element={authUser ? <Navigate to="/" /> : <SignUp onSignup={handleSignup} />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;

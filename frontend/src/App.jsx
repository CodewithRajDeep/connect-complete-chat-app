import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { useAuthContext } from './context/AuthContext.jsx';
import Home from './pages/home/Home.jsx';
import Login from './pages/Login/Login.jsx';
import SignUp from './pages/signup/SignUp.jsx';
import axios from 'axios';
import { useState } from 'react';

const API_URL = 'https://connect-chat-app-api.vercel.app/api/auth';

function App() {
  const { authUser, setAuthUser } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (username, password) => {
    setLoading(true);
    setErrorMessage('');
    
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      console.log('Login Response:', response.data);
      setAuthUser(response.data);
    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.error || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (fullName, username, password, confirmPassword, gender) => {
    setLoading(true);
    setErrorMessage('');
    
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
      setErrorMessage(error.response?.data?.error || 'An error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-4 h-screen flex items-center justify-center'>
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login onLogin={handleLogin} loading={loading} errorMessage={errorMessage} />} />
        <Route path="/signup" element={authUser ? <Navigate to="/" /> : <SignUp onSignup={handleSignup} loading={loading} errorMessage={errorMessage} />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;

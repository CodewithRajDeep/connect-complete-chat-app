
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/home/Home.jsx';
import Login from './pages/Login/Login.jsx';
import SignUp from './pages/signup/SignUp.jsx';

function App() {
  return (
    <div className='p-4 h-screen flex items-center justify-center'>
      <Routes>
        <Route path="/" element={ <Home/>}/>
        <Route path="/login" element={ <Login/>}/>
        <Route path="/signup" element={ <SignUp/>}/>
      </Routes>
    </div>
  )
}

export default App;

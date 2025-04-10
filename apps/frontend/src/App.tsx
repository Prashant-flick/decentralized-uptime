import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import { useEffect } from 'react';
import { useAuth } from './context/useAuth';
import axios from 'axios';
import { conf } from './conf/config';

function App() {
  const { islogin, login } = useAuth();

  const main = async() => {
    if (!islogin) {
      try {
        const res = await axios.post(`${conf.BackendUrl}/refresh`, {}, {
          withCredentials: true
        })
        login(res.data.accessToken, res.data.userId);
      } catch (error) {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    main();
  }, [])

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/signup" element={<Auth />} />
    </Routes>
  );
}

export default App;
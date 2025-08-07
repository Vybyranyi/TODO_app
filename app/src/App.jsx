import './App.css'
import React from 'react';
import { useSelector } from 'react-redux';
import LoginPage from './pages/LoginPage/LoginPage';
import Overview from './pages/Overview/Overview';
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const isAuth = useSelector((state) => state.auth.isAuth);

  if (isAuth) {
    return (
      <Routes>
        <Route path='/overview' element={<Overview />} />
        <Route path='*' element={<Navigate to="/overview" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='*' element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App
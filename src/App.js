import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const appShellClassName = useMemo(
    () =>
      theme === 'dark'
        ? 'min-h-screen bg-slate-950 text-slate-100 transition-colors duration-300'
        : 'min-h-screen bg-slate-100 text-slate-900 transition-colors duration-300',
    [theme]
  );

  return (
    <BrowserRouter>
      <div className={appShellClassName}>
        <Navbar theme={theme} setTheme={setTheme} />
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/' element={<Dashboard theme={theme} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

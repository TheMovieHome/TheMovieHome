import React, { useState } from 'react';
import MovieCatalog from './components/mainview/Catalog.jsx';
import Login from './components/Auth/Login.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (userData) => {
    console.log('Login realizado com sucesso:', userData);
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    console.log('Logout realizado');
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      {isLoggedIn && user ? (
        <MovieCatalog user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;



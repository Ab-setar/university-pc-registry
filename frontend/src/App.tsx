
import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Search from './components/Search';
import AllRegistrations from './components/AllRegistrations';

function App() {
  const [page, setPage] = useState<string>('register');
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');

  const handleLogin = (userRole: string, userName: string) => {
    setRole(userRole);
    setUsername(userName);
    if (userRole === 'guard') {
      setPage('search');
    } else {
      setPage('register');
    }
  };

  const handleLogout = () => {
    setRole(null);
    setUsername('');
  };

  if (!role) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🎓 University PC Registry</h1>
        <p style={styles.subtitle}>Campus Laptop Management System</p>
        <div style={styles.userInfo}>
          <span>👤 {username} ({role})</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Navigation */}
      <div style={styles.nav}>
        {role === 'admin' && (
          <button
            style={page === 'register' ? styles.activeBtn : styles.btn}
            onClick={() => setPage('register')}
          >
            📝 Register Laptop
          </button>
        )}
        <button
          style={page === 'search' ? styles.activeBtn : styles.btn}
          onClick={() => setPage('search')}
        >
          🔍 Guard Check
        </button>
        {role === 'admin' && (
          <button
            style={page === 'all' ? styles.activeBtn : styles.btn}
            onClick={() => setPage('all')}
          >
            📋 All Records
          </button>
        )}
      </div>

      {/* Pages */}
      <div style={styles.content}>
        {page === 'register' && role === 'admin' && <Register />}
        {page === 'search' && <Search />}
        {page === 'all' && role === 'admin' && <AllRegistrations />}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: '#f0f2f5' },
  header: { background: '#1a237e', color: 'white', padding: '20px', textAlign: 'center', position: 'relative' },
  title: { margin: 0, fontSize: '28px' },
  subtitle: { margin: '5px 0 0', opacity: 0.8 },
  userInfo: { position: 'absolute', top: '20px', right: '20px', display: 'flex', alignItems: 'center', gap: '10px' },
  logoutBtn: { padding: '8px 16px', background: 'white', color: '#1a237e', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  nav: { display: 'flex', justifyContent: 'center', gap: '10px', padding: '20px', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  btn: { padding: '10px 20px', border: '2px solid #1a237e', borderRadius: '8px', background: 'white', color: '#1a237e', cursor: 'pointer', fontSize: '16px' },
  activeBtn: { padding: '10px 20px', border: '2px solid #1a237e', borderRadius: '8px', background: '#1a237e', color: 'white', cursor: 'pointer', fontSize: '16px' },
  content: { maxWidth: '800px', margin: '30px auto', padding: '0 20px' },
};

export default App;
import React, { useState } from 'react';
import Register from './components/Register';
import Search from './components/Search';
import AllRegistrations from './components/AllRegistrations';

function App() {
  const [page, setPage] = useState<string>('register');

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🎓 University PC Registry</h1>
        <p style={styles.subtitle}>Campus Laptop Management System</p>
      </div>

      {/* Navigation */}
      <div style={styles.nav}>
        <button
          style={page === 'register' ? styles.activeBtn : styles.btn}
          onClick={() => setPage('register')}
        >
          📝 Register Laptop
        </button>
        <button
          style={page === 'search' ? styles.activeBtn : styles.btn}
          onClick={() => setPage('search')}
        >
          🔍 Guard Check
        </button>
        <button
          style={page === 'all' ? styles.activeBtn : styles.btn}
          onClick={() => setPage('all')}
        >
          📋 All Records
        </button>
      </div>

      {/* Pages */}
      <div style={styles.content}>
        {page === 'register' && <Register />}
        {page === 'search' && <Search />}
        {page === 'all' && <AllRegistrations />}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: '#f0f2f5' },
  header: { background: '#1a237e', color: 'white', padding: '20px', textAlign: 'center' },
  title: { margin: 0, fontSize: '28px' },
  subtitle: { margin: '5px 0 0', opacity: 0.8 },
  nav: { display: 'flex', justifyContent: 'center', gap: '10px', padding: '20px', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  btn: { padding: '10px 20px', border: '2px solid #1a237e', borderRadius: '8px', background: 'white', color: '#1a237e', cursor: 'pointer', fontSize: '16px' },
  activeBtn: { padding: '10px 20px', border: '2px solid #1a237e', borderRadius: '8px', background: '#1a237e', color: 'white', cursor: 'pointer', fontSize: '16px' },
  content: { maxWidth: '800px', margin: '30px auto', padding: '0 20px' },
};

export default App;
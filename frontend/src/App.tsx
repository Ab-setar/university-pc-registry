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
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">🎓 University PC Registry</h1>
          <p className="text-blue-200 text-sm">Campus Laptop Management System</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-blue-200 text-sm">👤 {username} ({role})</span>
          <button
            className="bg-white text-blue-900 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-100 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow flex justify-center gap-4 px-6 py-3">
        {role === 'admin' && (
          <button
            className={`px-6 py-2 rounded-lg font-semibold text-sm transition ${page === 'register' ? 'bg-blue-900 text-white' : 'border-2 border-blue-900 text-blue-900 hover:bg-blue-50'}`}
            onClick={() => setPage('register')}
          >
            📝 Register Laptop
          </button>
        )}
        <button
          className={`px-6 py-2 rounded-lg font-semibold text-sm transition ${page === 'search' ? 'bg-blue-900 text-white' : 'border-2 border-blue-900 text-blue-900 hover:bg-blue-50'}`}
          onClick={() => setPage('search')}
        >
          🔍 Guard Check
        </button>
        {role === 'admin' && (
          <button
            className={`px-6 py-2 rounded-lg font-semibold text-sm transition ${page === 'all' ? 'bg-blue-900 text-white' : 'border-2 border-blue-900 text-blue-900 hover:bg-blue-50'}`}
            onClick={() => setPage('all')}
          >
            📋 All Records
          </button>
        )}
        {role === 'admin' && (
          <button
            className={`px-6 py-2 rounded-lg font-semibold text-sm transition ${page === 'stats' ? 'bg-blue-900 text-white' : 'border-2 border-blue-900 text-blue-900 hover:bg-blue-50'}`}
            onClick={() => setPage('stats')}
          >
            📊 Statistics
          </button>
        )}
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {page === 'register' && role === 'admin' && <Register />}
        {page === 'search' && <Search />}
        {page === 'all' && role === 'admin' && <AllRegistrations />}
      </div>
    </div>
  );
}

export default App;
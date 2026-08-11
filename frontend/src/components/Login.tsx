import React, { useState } from 'react';
import API_BASE from '../api';

interface Props {
  onLogin: (role: string, username: string) => void;
}

function Login({ onLogin }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setMessage('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.role, data.username);
      } else {
        setMessage('Invalid username or password');
      }
    } catch (err) {
      setMessage('Error connecting to server');
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoCircle}>
            <img
              src="/haramaya-logo.png"
              alt="Haramaya University"
              style={styles.logoImg}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div style={styles.logoFallback}>HU</div>
          </div>
          <div style={styles.headerText}>
            <div style={styles.uniName}>Haramaya University</div>
            <div style={styles.systemName}>PC Registry System</div>
          </div>
        </div>

        <div style={styles.formWrap}>
          <div style={styles.formTitle}>Sign in</div>
          <div style={styles.formSub}>Enter your credentials to access the system</div>

          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          {message && <div style={styles.error}>⚠ {message}</div>}

          <button
            style={loading ? styles.btnDisabled : styles.btn}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
        </div>

        <div style={styles.footer}>
          © 2026 Haramaya University · PC Registry System
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  card: { background: '#ffffff', borderRadius: '20px', width: '100%', maxWidth: '420px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' },
  header: { background: '#0f172a', padding: '32px 24px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
  logoCircle: { width: '88px', height: '88px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #1e40af', boxShadow: '0 0 0 4px rgba(30,64,175,0.3)', background: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  logoImg: { width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' },
  logoFallback: { color: '#60a5fa', fontSize: '28px', fontWeight: '700' },
  headerText: { textAlign: 'center' },
  uniName: { color: '#ffffff', fontSize: '18px', fontWeight: '700' },
  systemName: { color: '#60a5fa', fontSize: '12px', marginTop: '4px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.1em' },
  formWrap: { padding: '28px 28px 16px' },
  formTitle: { fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' },
  formSub: { fontSize: '13px', color: '#64748b', marginBottom: '24px' },
  field: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  input: { width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box' },
  error: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#dc2626', marginBottom: '16px' },
  btn: { width: '100%', padding: '12px', background: '#1e40af', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' },
  btnDisabled: { width: '100%', padding: '12px', background: '#93c5fd', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'not-allowed', marginTop: '8px' },
  footer: { textAlign: 'center', padding: '16px', fontSize: '11px', color: '#94a3b8', borderTop: '1px solid #f1f5f9' },
};

export default Login;

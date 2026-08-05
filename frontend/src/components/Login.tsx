import React, { useState } from 'react';

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
      const res = await fetch('https://university-pc-registry-production.up.railway.app/login', {
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
        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>💻</div>
          <div>
            <div style={styles.logoTitle}>University PC Registry</div>
            <div style={styles.logoSub}>University of Addis Ababa</div>
          </div>
        </div>

        <div style={styles.divider} />

        <div style={styles.formWrap}>
          <div style={styles.formTitle}>Sign in to your account</div>
          <div style={styles.formSub}>Enter your credentials to continue</div>

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

          {message && (
            <div style={styles.error}>
              ⚠ {message}
            </div>
          )}

          <button
            style={loading ? styles.btnDisabled : styles.btn}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>

        <div style={styles.hints}>
          <div style={styles.hintTitle}>Demo accounts</div>
          <div style={styles.hintRow}>
            <span style={styles.hintBadge}>Admin</span>
            <span style={styles.hintText}>admin / admin123</span>
          </div>
          <div style={styles.hintRow}>
            <span style={styles.hintBadge}>Guard</span>
            <span style={styles.hintText}>guard / guard123</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: { minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  card: { background: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '400px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.4)' },
  logoWrap: { padding: '24px', display: 'flex', alignItems: 'center', gap: '12px', background: '#0f172a' },
  logoIcon: { width: '40px', height: '40px', background: '#1e3a5f', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' },
  logoTitle: { color: '#ffffff', fontSize: '14px', fontWeight: '600' },
  logoSub: { color: '#64748b', fontSize: '11px', marginTop: '2px' },
  divider: { height: '1px', background: '#f1f5f9' },
  formWrap: { padding: '24px' },
  formTitle: { fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' },
  formSub: { fontSize: '12px', color: '#64748b', marginBottom: '20px' },
  field: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '6px' },
  input: { width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', color: '#0f172a', outline: 'none', transition: 'border .15s', boxSizing: 'border-box' },
  error: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: '#dc2626', marginBottom: '16px' },
  btn: { width: '100%', padding: '10px', background: '#1e40af', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
  btnDisabled: { width: '100%', padding: '10px', background: '#93c5fd', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'not-allowed' },
  hints: { padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #f1f5f9' },
  hintTitle: { fontSize: '11px', fontWeight: '500', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  hintRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' },
  hintBadge: { background: '#dbeafe', color: '#1e40af', fontSize: '10px', fontWeight: '500', padding: '2px 8px', borderRadius: '10px' },
  hintText: { fontSize: '12px', color: '#64748b', fontFamily: 'monospace' },
};

export default Login;

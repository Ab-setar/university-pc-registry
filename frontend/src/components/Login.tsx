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

  const logoBase64 = 'data:image/jpeg;base64,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';

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <img src={logoBase64} alt="Haramaya University" style={styles.logoImg} />
          <div>
            <div style={styles.logoTitle}>PC Registry System</div>
            <div style={styles.logoSub}>Haramaya University</div>
          </div>
        </div>

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
            <div style={styles.error}>⚠ {message}</div>
          )}

          <button
            style={loading ? styles.btnDisabled : styles.btn}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: { minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  card: { background: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '400px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.4)' },
  logoWrap: { padding: '24px', display: 'flex', alignItems: 'center', gap: '12px', background: '#0f172a' },
  logoImg: { width: '52px', height: '52px', borderRadius: '8px', objectFit: 'cover' },
  logoTitle: { color: '#ffffff', fontSize: '14px', fontWeight: '600' },
  logoSub: { color: '#94a3b8', fontSize: '11px', marginTop: '2px' },
  formWrap: { padding: '24px' },
  formTitle: { fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' },
  formSub: { fontSize: '12px', color: '#64748b', marginBottom: '20px' },
  field: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '6px' },
  input: { width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', color: '#0f172a', outline: 'none', boxSizing: 'border-box' },
  error: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: '#dc2626', marginBottom: '16px' },
  btn: { width: '100%', padding: '10px', background: '#1e40af', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
  btnDisabled: { width: '100%', padding: '10px', background: '#93c5fd', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'not-allowed' },
};

export default Login;

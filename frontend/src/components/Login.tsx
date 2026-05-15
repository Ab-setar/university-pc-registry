import React, { useState } from 'react';

interface Props {
    onLogin: (role: string, username: string) => void;
}

function Login({ onLogin }: Props) {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const handleLogin = async () => {
        if (!username || !password) {
            setMessage('❌ Please fill all fields!');
            return;
        }
        try {
            const res = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (data.success) {
                onLogin(data.role, data.username);
            } else {
                setMessage('❌ Invalid username or password!');
            }
        } catch (err) {
            setMessage('❌ Error connecting to server!');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>🎓 University PC Registry</h1>
                <p style={styles.subtitle}>Please login to continue</p>

                <input
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    style={styles.input}
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <button style={styles.btn} onClick={handleLogin}>
                    Login
                </button>

                {message && <p style={styles.message}>{message}</p>}

                {/* <div style={styles.hint}>
                    <p>👤 Admin: username: <b>admin</b> password: <b>admin123</b></p>
                    <p>💂 Guard: username: <b>guard</b> password: <b>guard123</b></p>
                </div> */}
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: { minHeight: '100vh', background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    card: { background: 'white', borderRadius: '12px', padding: '40px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
    title: { margin: '0 0 5px', color: '#1a237e', textAlign: 'center', fontSize: '24px' },
    subtitle: { margin: '0 0 30px', color: '#666', textAlign: 'center' },
    input: { display: 'block', width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box' },
    btn: { width: '100%', padding: '14px', background: '#1a237e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
    message: { textAlign: 'center', marginTop: '15px', fontSize: '16px', color: 'red' },
    hint: { marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px', fontSize: '14px', color: '#666' },
};

export default Login;
import React, { useState } from 'react';

interface Registration {
  id: number;
  owner_name: string;
  student_id: string;
  laptop_brand: string;
  serial_number: string;
  status: string;
  created_at: string;
}

function Search() {
  const [serial, setSerial] = useState<string>('');
  const [result, setResult] = useState<Registration | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleSearch = async () => {
    if (!serial) {
      setMessage('❌ Please enter a serial number!');
      return;
    }
    try {
      const res = await fetch(`http://localhost:3001/search/${serial}`);
      const data = await res.json();
      if (data.found) {
        setResult(data.data);
        setMessage('');
      } else {
        setResult(null);
        setMessage('❌ No laptop found with this serial number!');
      }
    } catch (err) {
      setMessage('❌ Error connecting to server!');
    }
  };

  const handleStatus = async (id: number, status: string) => {
    try {
      await fetch(`http://localhost:3001/status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (result) setResult({ ...result, status });
    } catch (err) {
      setMessage('❌ Error updating status!');
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>🔍 Guard Check</h2>
      <p style={styles.subtitle}>Search laptop by serial number when leaving campus</p>

      <input
        style={styles.input}
        placeholder="Enter Serial Number"
        value={serial}
        onChange={e => setSerial(e.target.value)}
      />
      <button style={styles.btn} onClick={handleSearch}>
        Search
      </button>

      {message && <p style={styles.message}>{message}</p>}

      {result && (
        <div style={styles.result}>
          <h3 style={styles.resultTitle}>✅ Laptop Found!</h3>
          <div style={styles.row}><span style={styles.label}>Owner:</span> {result.owner_name}</div>
          <div style={styles.row}><span style={styles.label}>Student ID:</span> {result.student_id}</div>
          <div style={styles.row}><span style={styles.label}>Brand:</span> {result.laptop_brand}</div>
          <div style={styles.row}><span style={styles.label}>Serial:</span> {result.serial_number}</div>
          <div style={styles.row}>
            <span style={styles.label}>Status:</span>
            <span style={result.status === 'inside' ? styles.inside : styles.outside}>
              {result.status === 'inside' ? '🟢 Inside Campus' : '🔴 Outside Campus'}
            </span>
          </div>
          <div style={styles.buttons}>
            <button style={styles.greenBtn} onClick={() => handleStatus(result.id, 'inside')}>
              ✅ Mark as Inside
            </button>
            <button style={styles.redBtn} onClick={() => handleStatus(result.id, 'outside')}>
              🚪 Mark as Outside
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  card: { background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  title: { margin: '0 0 5px', color: '#1a237e' },
  subtitle: { margin: '0 0 20px', color: '#666' },
  input: { display: 'block', width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '14px', background: '#1a237e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
  message: { textAlign: 'center', marginTop: '15px', fontSize: '16px' },
  result: { marginTop: '20px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' },
  resultTitle: { margin: '0 0 15px', color: '#1a237e' },
  row: { marginBottom: '10px', fontSize: '16px' },
  label: { fontWeight: 'bold', marginRight: '10px' },
  inside: { color: 'green', fontWeight: 'bold' },
  outside: { color: 'red', fontWeight: 'bold' },
  buttons: { display: 'flex', gap: '10px', marginTop: '15px' },
  greenBtn: { flex: 1, padding: '12px', background: 'green', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
  redBtn: { flex: 1, padding: '12px', background: 'red', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
};

export default Search;
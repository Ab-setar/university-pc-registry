import React, { useState, useEffect } from 'react';

interface Registration {
  id: number;
  owner_name: string;
  student_id: string;
  laptop_brand: string;
  serial_number: string;
  status: string;
  created_at: string;
}

function AllRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const res = await fetch('http://localhost:3001/registrations');
      const data: Registration[] = await res.json();
      setRegistrations(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>📋 All Registrations</h2>
      <p style={styles.subtitle}>All laptops registered on campus</p>

      {loading && <p>Loading...</p>}

      {!loading && registrations.length === 0 && (
        <p style={styles.empty}>No laptops registered yet.</p>
      )}

      {registrations.map(reg => (
        <div key={reg.id} style={styles.item}>
          <div style={styles.row}>
            <span style={styles.label}>👤 Owner:</span> {reg.owner_name}
          </div>
          <div style={styles.row}>
            <span style={styles.label}>🎓 Student ID:</span> {reg.student_id}
          </div>
          <div style={styles.row}>
            <span style={styles.label}>💻 Brand:</span> {reg.laptop_brand}
          </div>
          <div style={styles.row}>
            <span style={styles.label}>🔢 Serial:</span> {reg.serial_number}
          </div>
          <div style={styles.row}>
            <span style={styles.label}>📅 Date:</span> {new Date(reg.created_at).toLocaleString()}
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Status:</span>
            <span style={reg.status === 'inside' ? styles.inside : styles.outside}>
              {reg.status === 'inside' ? '🟢 Inside Campus' : '🔴 Outside Campus'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  card: { background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  title: { margin: '0 0 5px', color: '#1a237e' },
  subtitle: { margin: '0 0 20px', color: '#666' },
  empty: { textAlign: 'center', color: '#666', fontSize: '16px' },
  item: { background: '#f5f5f5', borderRadius: '8px', padding: '15px', marginBottom: '15px' },
  row: { marginBottom: '8px', fontSize: '15px' },
  label: { fontWeight: 'bold', marginRight: '8px' },
  inside: { color: 'green', fontWeight: 'bold' },
  outside: { color: 'red', fontWeight: 'bold' },
};

export default AllRegistrations;
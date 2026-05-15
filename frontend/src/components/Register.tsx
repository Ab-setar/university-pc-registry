import React, { useState } from 'react';

interface FormData {
  owner_name: string;
  student_id: string;
  laptop_brand: string;
  serial_number: string;
}

interface Receipt {
  id: number;
  owner_name: string;
  student_id: string;
  laptop_brand: string;
  serial_number: string;
  created_at: string;
}

function Register() {
  const [form, setForm] = useState<FormData>({
    owner_name: '',
    student_id: '',
    laptop_brand: '',
    serial_number: '',
  });
  const [message, setMessage] = useState<string>('');
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const handleSubmit = async () => {
    if (!form.owner_name || !form.student_id || !form.laptop_brand || !form.serial_number) {
      setMessage('❌ Please fill all fields!');
      return;
    }
    try {
      const res = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('✅ Laptop registered successfully!');
        setReceipt({
          id: data.id,
          owner_name: form.owner_name,
          student_id: form.student_id,
          laptop_brand: form.laptop_brand,
          serial_number: form.serial_number,
          created_at: new Date().toLocaleString(),
        });
        setForm({ owner_name: '', student_id: '', laptop_brand: '', serial_number: '' });
      }
    } catch (err) {
      setMessage('❌ Error connecting to server!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="no-print" style={styles.card}>
        <h2 style={styles.title}>📝 Register Laptop</h2>
        <p style={styles.subtitle}>Fill in the details when entering campus</p>

        <input
          style={styles.input}
          placeholder="Owner Full Name"
          value={form.owner_name}
          onChange={e => setForm({ ...form, owner_name: e.target.value })}
        />
        <input
          style={styles.input}
          placeholder="Student ID"
          value={form.student_id}
          onChange={e => setForm({ ...form, student_id: e.target.value })}
        />
        <input
          style={styles.input}
          placeholder="Laptop Brand (e.g. Dell, HP, Lenovo)"
          value={form.laptop_brand}
          onChange={e => setForm({ ...form, laptop_brand: e.target.value })}
        />
        <input
          style={styles.input}
          placeholder="Serial Number"
          value={form.serial_number}
          onChange={e => setForm({ ...form, serial_number: e.target.value })}
        />

        <button style={styles.btn} onClick={handleSubmit}>
          Register Laptop
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </div>

      {/* Receipt */}
      {receipt && (
        <div style={styles.receiptCard}>
          <div style={styles.receiptHeader}>
            <h2 style={styles.receiptTitle}>🎓 University PC Registry</h2>
            <p style={styles.receiptSubtitle}>Registration Receipt</p>
          </div>
          <div style={styles.receiptBody}>
            <div style={styles.receiptRow}>
              <span style={styles.receiptLabel}>Registration ID:</span>
              <span>#{receipt.id}</span>
            </div>
            <div style={styles.receiptRow}>
              <span style={styles.receiptLabel}>Owner Name:</span>
              <span>{receipt.owner_name}</span>
            </div>
            <div style={styles.receiptRow}>
              <span style={styles.receiptLabel}>Student ID:</span>
              <span>{receipt.student_id}</span>
            </div>
            <div style={styles.receiptRow}>
              <span style={styles.receiptLabel}>Laptop Brand:</span>
              <span>{receipt.laptop_brand}</span>
            </div>
            <div style={styles.receiptRow}>
              <span style={styles.receiptLabel}>Serial Number:</span>
              <span>{receipt.serial_number}</span>
            </div>
            <div style={styles.receiptRow}>
              <span style={styles.receiptLabel}>Date & Time:</span>
              <span>{receipt.created_at}</span>
            </div>
            <div style={styles.receiptRow}>
              <span style={styles.receiptLabel}>Status:</span>
              <span style={{ color: 'green', fontWeight: 'bold' }}>🟢 Inside Campus</span>
            </div>
          </div>
          <button className="no-print" style={styles.printBtn} onClick={handlePrint}>
            🖨️ Print Receipt
          </button>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  card: { background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' },
  title: { margin: '0 0 5px', color: '#1a237e' },
  subtitle: { margin: '0 0 20px', color: '#666' },
  input: { display: 'block', width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '14px', background: '#1a237e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
  message: { textAlign: 'center', marginTop: '15px', fontSize: '16px' },
  receiptCard: { background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '2px dashed #1a237e' },
  receiptHeader: { textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #1a237e', paddingBottom: '15px' },
  receiptTitle: { margin: '0 0 5px', color: '#1a237e' },
  receiptSubtitle: { margin: 0, color: '#666' },
  receiptBody: { marginBottom: '20px' },
  receiptRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee', fontSize: '16px' },
  receiptLabel: { fontWeight: 'bold', color: '#1a237e' },
  printBtn: { width: '100%', padding: '14px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
};

export default Register;
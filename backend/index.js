const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
const db = new Database('registry.db');

app.use(cors());
app.use(express.json());

// Create table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_name TEXT NOT NULL,
    student_id TEXT NOT NULL,
    laptop_brand TEXT NOT NULL,
    serial_number TEXT NOT NULL,
    status TEXT DEFAULT 'inside',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Register a laptop (entering campus)
app.post('/register', (req, res) => {
  const { owner_name, student_id, laptop_brand, serial_number } = req.body;
  const stmt = db.prepare(`
    INSERT INTO registrations (owner_name, student_id, laptop_brand, serial_number)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(owner_name, student_id, laptop_brand, serial_number);
  res.json({ success: true, id: result.lastInsertRowid });
});

// Get all registrations
app.get('/registrations', (req, res) => {
  const rows = db.prepare('SELECT * FROM registrations ORDER BY created_at DESC').all();
  res.json(rows);
});

// Search by serial number (guard checks when leaving)
app.get('/search/:serial', (req, res) => {
  const row = db.prepare('SELECT * FROM registrations WHERE serial_number = ?').get(req.params.serial);
  if (row) {
    res.json({ found: true, data: row });
  } else {
    res.json({ found: false });
  }
});

// Update status (inside / outside)
app.put('/status/:id', (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE registrations SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ success: true });
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});

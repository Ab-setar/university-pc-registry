import express, { Request, Response } from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const app = express();
const db = new Database('registry.db');

app.use(cors());
app.use(express.json());

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_name TEXT NOT NULL,
    student_id TEXT NOT NULL,
    laptop_brand TEXT NOT NULL,
    serial_number TEXT NOT NULL,
    status TEXT DEFAULT 'inside',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL
  );
`);

// Add default users if not exists
const adminExists = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
if (!adminExists) {
  db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run('admin', 'admin123', 'admin');
  db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run('guard', 'guard123', 'guard');
}

// Types
interface Registration {
  id: number;
  owner_name: string;
  student_id: string;
  laptop_brand: string;
  serial_number: string;
  status: string;
  created_at: string;
}

interface RegisterBody {
  owner_name: string;
  student_id: string;
  laptop_brand: string;
  serial_number: string;
}

interface LoginBody {
  username: string;
  password: string;
}

// Login
app.post('/login', (req: Request<{}, {}, LoginBody>, res: Response) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password) as any;
  if (user) {
    res.json({ success: true, role: user.role, username: user.username });
  } else {
    res.json({ success: false, message: 'Invalid username or password' });
  }
});

// Register a laptop
app.post('/register', (req: Request<{}, {}, RegisterBody>, res: Response) => {
  const { owner_name, student_id, laptop_brand, serial_number } = req.body;
  const stmt = db.prepare(`
    INSERT INTO registrations (owner_name, student_id, laptop_brand, serial_number)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(owner_name, student_id, laptop_brand, serial_number);
  res.json({ success: true, id: result.lastInsertRowid });
});

// Get all registrations
app.get('/registrations', (_req: Request, res: Response) => {
  const rows = db.prepare('SELECT * FROM registrations ORDER BY created_at DESC').all();
  res.json(rows);
});

// Search by serial number
app.get('/search/:serial', (req: Request, res: Response) => {
  const row = db.prepare('SELECT * FROM registrations WHERE serial_number = ?').get(req.params.serial) as Registration | undefined;
  if (row) {
    res.json({ found: true, data: row });
  } else {
    res.json({ found: false });
  }
});

// Search by name
app.get('/searchname/:name', (req: Request, res: Response) => {
  const rows = db.prepare("SELECT * FROM registrations WHERE owner_name LIKE ?").all(`%${req.params.name}%`) as Registration[];
  res.json(rows);
});

// Update status
app.put('/status/:id', (req: Request, res: Response) => {
  const { status } = req.body;
  db.prepare('UPDATE registrations SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ success: true });
});

// Delete registration
app.delete('/delete/:id', (req: Request, res: Response) => {
  db.prepare('DELETE FROM registrations WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.listen(3001, () => {
  console.log('🚀 Server running on http://localhost:3001');
});
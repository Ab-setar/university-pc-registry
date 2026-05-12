# 🎓 University PC Registry System

A fullstack web application to manage laptop registration on university campus. Built to replace the traditional paper-based system used by campus security guards.

---

## 📋 About The Project

At our university, students and staff must register their laptops when entering campus. When leaving, the security guard checks the registration record. This app replaces the old paper system with a fast, digital solution.

### The Problem
- ❌ Paper records are slow and hard to search
- ❌ Records can be lost or damaged
- ❌ No way to track laptop status in real time

### The Solution
- ✅ Digital registration in seconds
- ✅ Instant search by serial number
- ✅ Real time status tracking (inside/outside campus)
- ✅ All records saved safely in a database

---

## 🚀 Features

- 📝 **Register Laptop** — Register any laptop entering campus
- 🔍 **Guard Check** — Search laptop by serial number when leaving
- 📋 **All Records** — View all registered laptops
- 🟢 **Status Tracking** — Mark laptops as inside or outside campus

---

## 🛠️ Built With

### Frontend
- React
- TypeScript

### Backend
- Node.js
- Express
- TypeScript
- SQLite (better-sqlite3)

---

## 📦 Installation

### Requirements
- Node.js v18 or higher
- npm

### Clone the project
```bash
git clone https://github.com/Ab-setar/university-pc-registry.git
cd university-pc-registry
```

### Setup Backend
```bash
cd backend
npm install
npm run dev
```

### Setup Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm start
```

### Open the app
Go to your browser and open:

http://localhost:3000

---

## 🔒 Security

- Database file is excluded from version control
- Environment variables used for sensitive config
- CORS protection enabled on the backend

---

## �� Screenshots

> Register Laptop Screen — Fill in laptop details when entering campus

> Guard Check Screen — Search by serial number when leaving campus

> All Records Screen — View all registered laptops

---

## 🗺️ Roadmap

- [ ] Login system for admin and guards
- [ ] Print registration receipt
- [ ] Export records to PDF
- [ ] Deploy online
- [ ] Mobile friendly design

---

## 👨‍💻 Author

**Fati**
- GitHub: [@Ab-setar](https://github.com/Ab-setar)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./library.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS records (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, book TEXT, action TEXT, date DATETIME DEFAULT CURRENT_TIMESTAMP)");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/options', (req, res) => res.sendFile(path.join(__dirname, 'public/options.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public/login.html')));

app.post('/submit', (req, res) => {
    const { user, book, action } = req.body;
    db.run("INSERT INTO records (user, book, action) VALUES (?, ?, ?)", [user, book, action], () => {
        res.send(`<body style="background:#0f0c29; color:white; display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif;"><h2>✔ Action Recorded! Redirecting...</h2><script>setTimeout(()=>window.location.href='/options', 2000)</script></body>`);
    });
});

app.post('/admin-panel', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '1234') {
        db.all("SELECT * FROM records", (err, rows) => {
            let trs = rows.map(r => `<tr><td>${r.id}</td><td>${r.user}</td><td>${r.book}</td><td>${r.action}</td><td>${r.date}</td></tr>`).join('');
            res.send(`<style>body{background:#eee; font-family:sans-serif;} table{width:90%; margin:20px auto; border-collapse:collapse;} th,td{padding:12px; border:1px solid #ccc; text-align:left;} th{background:#302b63; color:white;}</style>
            <h2 style="text-align:center">Librarian Master List</h2><table><tr><th>ID</th><th>User</th><th>Book</th><th>Action</th><th>Time</th></tr>${trs}</table><p style="text-align:center"><a href="/">Logout</a></p>`);
        });
    } else {
        res.send("Wrong credentials! <a href='/login'>Back</a>");
    }
});

module.exports = app; // Needed for Vercel
app.listen(3000);
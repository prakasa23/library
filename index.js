const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
let records = []; // In-Memory DB for Vercel stability

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/options', (req, res) => res.sendFile(path.join(__dirname, 'public', 'options.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));

app.post('/submit', (req, res) => {
    const { user, book, action } = req.body;
    records.push({ id: records.length+1, user, book, action, date: new Date().toLocaleString() });
    res.send(`<body style="background:#1e3c72; color:white; display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif; text-align:center;">
        <div><h2>✔ Request Saved!</h2><script>setTimeout(()=>window.location.href='/options', 2000)</script></div></body>`);
});

app.post('/admin-panel', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '1234') {
        let trs = records.map(r => `<tr><td>${r.id}</td><td>${r.user}</td><td>${r.book}</td><td>${r.action}</td><td>${r.date}</td></tr>`).join('');
        res.send(`<style>body{font-family:sans-serif; text-align:center;} table{width:90%; margin:20px auto; border-collapse:collapse;} th,td{padding:12px; border:1px solid #ccc;} th{background:#1e3c72; color:white;}</style>
        <h2>Librarian Database</h2><table><tr><th>ID</th><th>User</th><th>Book</th><th>Action</th><th>Time</th></tr>${trs || '<tr><td colspan="5">Empty</td></tr>'}</table><br><a href="/">Logout</a>`);
    } else {
        res.send("<div style='text-align:center; margin-top:50px;'><h2>Access Denied</h2><a href='/login'>Try Again</a></div>");
    }
});

app.listen(process.env.PORT || 3000);
module.exports = app;
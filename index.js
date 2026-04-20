const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// This is our "Virtual Database"
// It works exactly like a database but won't crash Vercel
let records = []; 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Navigation Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/options', (req, res) => res.sendFile(path.join(__dirname, 'public', 'options.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));

// Save a record
app.post('/submit', (req, res) => {
    const { user, book, action } = req.body;
    
    // Create a new record object
    const newRecord = {
        id: records.length + 1,
        user: user,
        book: book,
        action: action,
        date: new Date().toLocaleString()
    };
    
    records.push(newRecord); // Store it in our list
    
    res.send(`
        <body style="background:#0f0c29; color:white; display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif; text-align:center;">
            <div>
                <h2>✔ Action Recorded for ${user}!</h2>
                <p>Returning to dashboard...</p>
                <script>setTimeout(()=>window.location.href='/options', 2000)</script>
            </div>
        </body>
    `);
});

// Admin Panel (Librarian View)
app.post('/admin-panel', (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'admin' && password === '1234') {
        // Build the table rows from our records list
        let trs = records.map(r => `
            <tr>
                <td>${r.id}</td>
                <td>${r.user}</td>
                <td>${r.book}</td>
                <td>${r.action}</td>
                <td>${r.date}</td>
            </tr>`).join('');

        res.send(`
            <style>
                body{background:#eee; font-family:sans-serif;} 
                table{width:95%; margin:20px auto; border-collapse:collapse; background:white;} 
                th,td{padding:12px; border:1px solid #ccc; text-align:left;} 
                th{background:#302b63; color:white;} 
                h2{text-align:center;}
            </style>
            <h2>Librarian Master List</h2>
            <table>
                <tr><th>ID</th><th>User</th><th>Book</th><th>Action</th><th>Time</th></tr>
                ${trs || '<tr><td colspan="5" style="text-align:center">No records found yet.</td></tr>'}
            </table>
            <p style="text-align:center"><a href="/">Logout</a></p>
        `);
    } else {
        res.send("<div style='text-align:center; margin-top:50px; font-family:sans-serif;'><h2>Access Denied!</h2><p>Incorrect Username or Password.</p><a href='/login'>Try Again</a></div>");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
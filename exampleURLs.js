//
//
// THIS FILE IS JUST EXAMPLE CODE TO SEE HOW TO ROUTE BETWEEN URL'S

const express = require('express');

const app = express();

let currentUrl = 'http://localhost:3000/'; // Default URL

// Route for the first URL
app.get('/url1', (req, res) => {
    res.send('Hello from URL 1!');
});

// Route for the second URL
app.get('/url2', (req, res) => {
    res.send('Hello from URL 2!');
});

// Route to get current URL
app.get('/', (req, res) => {
    res.send(`Current URL is ${currentUrl}`);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
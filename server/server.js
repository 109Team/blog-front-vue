const express = require('express');
const path = require('path');

const CONFIG = require('./server.config');
const app = express();

app.use(express.static(path.join(__dirname, 'client')));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/index.html'));
})

app.listen(CONFIG.port || 3000, () => {
    console.log(`server is listen on port: ${CONFIG.port}...`);
})
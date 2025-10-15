const express = require('express');
const path = require('path');

const app = express();

// Serve all static files from current directory
app.use(express.static(__dirname));

const PORT = 3000;
app.listen(PORT, () => console.log(`Frontend server running on port ${PORT}`));
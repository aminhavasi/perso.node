const http = require('http');
const express = require('express');
const app = express();
const httpService = http.createServer(app);
require('dotenv').config();
const { db } = require('./src/db/mongodb');
const port = process.env.PORT || 5000;

//-------------------------------------------------------
app.use(express.json());
db();
app.use('/api/auth', require('./src/routes/auth'));
httpService.listen(port, () => {
    console.log(`server is running on port ${port}`);
});

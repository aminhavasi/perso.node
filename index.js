const http = require('http');
const express = require('express');
const app = express();
const httpService = http.createServer(app);
require('dotenv').config();
const { db } = require('./src/db/mongodb');
const cors = require('cors');
const rfs = require('rotating-file-stream');
const path = require('path');
const morgan = require('morgan');
const port = process.env.PORT || 5000;

//-------------------------------------------------------
const corsOptions = {
    exposedHeaders: 'x-auth ',
};
app.use(cors(corsOptions));
app.use(express.json());
let accessLogStream = rfs.createStream('httpRequest.log', {
    interval: '1d',
    path: path.resolve(__dirname + '/src/log'),
});
app.use(morgan('combined', { stream: accessLogStream }));
db();

app.use('/api/auth', require('./src/routes/auth'));
httpService.listen(port, () => {
    console.log(`server is running on port ${port}`);
});

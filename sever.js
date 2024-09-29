const express = require('express');
const app = express();
const db = require('./db');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
// const logRequest = (req, res, next) => {
//     console.log(`[${new Date().toLocaleString()}] Request Made to: ${req.originalUrl}`);
//     next();
// }
// app.use(logRequest);

const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/condidateRoutes');
app.use('/candidate', candidateRoutes);
app.use('/user', userRoutes);


app.listen(3000, () => {
    console.log('lestening on port 3000');
})
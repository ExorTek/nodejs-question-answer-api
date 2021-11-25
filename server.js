const express = require('express');
const dotenv = require('dotenv');
const routers = require('./routers');
const connectDatabase = require('./helpers/database/connectDatabase');
const customErrorHandler = require('./middlewares/error/customErrorHandler');
const path = require('path');

// Environment Variables
dotenv.config({
    path: './config/env/config.env'
});

// MongoDB Connection
connectDatabase();

const app = express();
// Express - Body Middleware
app.use(express.json());
const PORT = process.env.PORT;

// Routers Middleware
app.use("/api", routers);

// Error Handler
app.use(customErrorHandler);

// Static File
app.use(express.static(path.join(__dirname, 'public')));

// Listen Port
app.listen(PORT, (() => {
    console.log(`Server listening on port ${PORT} : ${process.env.NODE_ENV}`);
}));

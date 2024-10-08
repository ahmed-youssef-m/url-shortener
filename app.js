require('dotenv').config();
const express = require('express');
const urlRoutes = require('./routes/url');
const connectDB  = require('./config/db')

const app = express();

app.use(express.json());

connectDB();

app.use('/', urlRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {console.log(`Server running http://localhost:${PORT}`)});

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
dotenv.config();

mongoose.connect(process.env.MONGO_URL)
    .then(() =>
        console.log('Connected to MongoDB'))
    .catch(err =>
        console.error('Could not connect to MongoDB', err));


app.listen(process.env.PORT, () => {
    console.log(`Server is Running on ${process.env.PORT}`);
});

require('../server/controllers/updaterController');
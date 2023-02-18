const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const { PORT = 3000, MONGOOSE_URL } = process.env;

const app = express();

mongoose.connect(MONGOOSE_URL);

app.listen(PORT);

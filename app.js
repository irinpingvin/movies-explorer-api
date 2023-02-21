const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes/routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, MONGOOSE_URL, NODE_ENV } = process.env;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === 'production' ? MONGOOSE_URL : 'mongodb://localhost:27017/moviesdb');

app.use(requestLogger);

app.use('/', router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);

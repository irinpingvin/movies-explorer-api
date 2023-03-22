const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
require('dotenv').config();
const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rateLimiter');
const { DEV_MONGOOSE_URL } = require('./utils/dbconfig');
const corsValidation = require('./middlewares/corsValidation');

const { PORT = 3000, MONGOOSE_URL, NODE_ENV } = process.env;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsValidation);
app.use(requestLogger);
app.use(helmet());
app.use(limiter);

mongoose.connect(NODE_ENV === 'production' ? MONGOOSE_URL : DEV_MONGOOSE_URL);

app.use('/', router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);

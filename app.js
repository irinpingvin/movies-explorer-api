const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
require('dotenv').config();
const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes/routes');

const { PORT = 3000, MONGOOSE_URL } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGOOSE_URL);

// TODO: временная авторизация
app.use((req, res, next) => {
  req.user = {
    _id: '63f0ce90b158c036091aa374',
  };

  next();
});

app.use('/', router);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);

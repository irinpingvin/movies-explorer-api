const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

function getUser(req, res, next) {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      } else {
        res.send({ name: user.name, email: user.email });
      }
    })
    .catch(next);
}

function updateUser(req, res, next) {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      } else {
        res.send({ name: user.name, email: user.email });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные в запросе');
      } else {
        next(err);
      }
    })
    .catch(next);
}

function signup(req, res, next) {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => res.send({ name: user.name, email: user.email, _id: user._id }))
    .catch((e) => {
      if (e.code === 11000) {
        const err = new Error('Пользователь с таким email уже существует');
        err.statusCode = 409;
        next(err);
      } else if (e.name === 'ValidationError') {
        throw new ValidationError(e.message.replace('user validation failed: ', ''));
      } else {
        next(e);
      }
    })
    .catch(next);
}

module.exports = { getUser, updateUser, signup };

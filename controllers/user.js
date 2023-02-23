const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

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
    .catch((e) => {
      if (e.code === 11000) {
        const err = new Error('Пользователь с таким email уже существует');
        err.statusCode = 409;
        next(err);
      } else if (e.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные в запросе');
      } else {
        next(e);
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

function signin(req, res, next) {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 604800000,
        httpOnly: true,
      });

      res.send(token);
    })
    .catch(() => {
      throw new UnauthorizedError('Неверная почта или пароль');
    })
    .catch(next);
}

function signout(req, res) {
  res.clearCookie('jwt', { httpOnly: true });
  res.send({ message: 'Вы вышли из учетной записи' });
}

module.exports = {
  getUser, updateUser, signup, signin, signout,
};

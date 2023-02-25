const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');
const {
  notFoundUserErrorMessage,
  duplicateEmailErrorMessage,
  incorrectDataErrorMessage,
  signoutMessage,
  validationError,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

function getUser(req, res, next) {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(notFoundUserErrorMessage);
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
        throw new NotFoundError(notFoundUserErrorMessage);
      } else {
        res.send({ name: user.name, email: user.email });
      }
    })
    .catch((e) => {
      if (e.code === 11000) {
        next(new ConflictError(duplicateEmailErrorMessage));
      } else if (e.name === validationError) {
        next(ValidationError(incorrectDataErrorMessage));
      } else {
        next(e);
      }
    });
}

function signup(req, res, next) {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => res.send({ name: user.name, email: user.email, _id: user._id }))
    .catch((e) => {
      if (e.code === 11000) {
        next(new ConflictError(duplicateEmailErrorMessage));
      } else if (e.name === validationError) {
        next(ValidationError(e.message.replace('user validation failed: ', '')));
      } else {
        next(e);
      }
    });
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
      res.send({ token });
    })
    .catch(next);
}

function signout(req, res) {
  res.clearCookie('jwt', { httpOnly: true });
  res.send({ message: signoutMessage });
}

module.exports = {
  getUser, updateUser, signup, signin, signout,
};

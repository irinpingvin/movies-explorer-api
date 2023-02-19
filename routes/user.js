const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { getUser, updateUser } = require('../controllers/user');

router.get('/users/me', getUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    name: Joi.string().min(2).max(30),
  }),
}), updateUser);

module.exports = router;

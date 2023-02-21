const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./user');
const movieRouter = require('./movie');
const auth = require('../middlewares/auth');
const { signup, signin, signout } = require('../controllers/user');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), signup);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), signin);

router.use(auth);
router.use('/', userRouter);
router.use('/', movieRouter);
router.post('/signout', signout);

router.use('*', (_, __, next) => { next(new NotFoundError('запрашиваемый url не найден')); });

module.exports = router;

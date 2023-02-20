const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./user');
const movieRouter = require('./movie');
const auth = require('../middlewares/auth');
const { signup } = require('../controllers/user');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), signup);

router.use(auth);
router.use('/', userRouter);
router.use('/', movieRouter);

module.exports = router;

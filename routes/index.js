const router = require('express').Router();
const userRouter = require('./user');
const movieRouter = require('./movie');
const auth = require('../middlewares/auth');
const { signup, signin, signout } = require('../controllers/user');
const NotFoundError = require('../errors/NotFoundError');
const { validateSignup, validateSignin } = require('../utils/validation');
const { notFoundUrlErrorMessage } = require('../utils/constants');

router.post('/signup', validateSignup, signup);

router.post('/signin', validateSignin, signin);

router.use(auth);
router.use('/', userRouter);
router.use('/', movieRouter);
router.post('/signout', signout);

router.use('*', (_, __, next) => { next(new NotFoundError(notFoundUrlErrorMessage)); });

module.exports = router;

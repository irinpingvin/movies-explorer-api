const router = require('express').Router();
const userRouter = require('./user');
const movieRouter = require('./movie');
const auth = require('../middlewares/auth');

router.use(auth);
router.use('/', userRouter);
router.use('/', movieRouter);

module.exports = router;

const router = require('express').Router();
const { getUser, updateUser } = require('../controllers/user');
const { validateUserUpdate } = require('../utils/validation');

router.get('/users/me', getUser);

router.patch('/users/me', validateUserUpdate, updateUser);

module.exports = router;

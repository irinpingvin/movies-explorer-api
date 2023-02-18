const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');

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

module.exports = { getUser };

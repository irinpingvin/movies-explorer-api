const Movie = require('../models/movie');

function getSavedMovies(req, res, next) {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
}

module.exports = { getSavedMovies };

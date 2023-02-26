const Movie = require('../models/movie');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const { notFoundMovieErrorMessage, forbiddenDeletionMovieErrorMessage, validationError } = require('../utils/constants');

function getSavedMovies(req, res, next) {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
}

function addMovie(req, res, next) {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === validationError) {
        next(new ValidationError(err.message.replace('movie validation failed: ', '')));
      } else {
        next(err);
      }
    });
}

function deleteMovie(req, res, next) {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(notFoundMovieErrorMessage);
      }
      if (String(movie.owner) === req.user._id) {
        Movie.findByIdAndRemove(req.params._id)
          .then(() => res.send(movie))
          .catch(next);
      } else {
        throw new ForbiddenError(forbiddenDeletionMovieErrorMessage);
      }
    })
    .catch(next);
}

module.exports = { getSavedMovies, addMovie, deleteMovie };

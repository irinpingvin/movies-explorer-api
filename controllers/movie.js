const Movie = require('../models/movie');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');

function getSavedMovies(req, res, next) {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
}

function addMovie(req, res, next) {
  const {
    country, director, duration, year, description, image,
    trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError(err.message.replace('movie validation failed: ', ''));
      } else {
        next(err);
      }
    })
    .catch(next);
}

function deleteMovie(req, res, next) {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Запрашиваемый фильм не найден');
      } else {
        Movie.findByIdAndRemove(req.params._id)
          .then(() => res.send(movie));
      }
    })
    .catch(next);
}

module.exports = { getSavedMovies, addMovie, deleteMovie };

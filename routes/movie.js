const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { getSavedMovies, addMovie } = require('../controllers/movie');

router.get('/movies', getSavedMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(/^https?:\/\/(w{3}\.)?.*$/),
    trailerLink: Joi.string().required().regex(/^https?:\/\/(w{3}\.)?.*$/),
    thumbnail: Joi.string().required().regex(/^https?:\/\/(w{3}\.)?.*$/),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.string().required(),
  }),
}), addMovie);

module.exports = router;

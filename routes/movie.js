const router = require('express').Router();
const { getSavedMovies, addMovie, deleteMovie } = require('../controllers/movie');
const { validateAddingMovie, validateMovieDeletion } = require('../utils/validation');

router.get('/movies', getSavedMovies);

router.post('/movies', validateAddingMovie, addMovie);

router.delete('/movies/:_id', validateMovieDeletion, deleteMovie);

module.exports = router;

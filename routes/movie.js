const router = require('express').Router();
const { getSavedMovies } = require('../controllers/movie');

router.get('/movies', getSavedMovies);

module.exports = router;

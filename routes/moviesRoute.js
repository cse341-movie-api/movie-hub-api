const express = require('express');
const router = express.Router();
const controller = require('../controllers/moviesController');
const { ensureAuthenticated } = require('../middleware/isAuthenticated');
const { validateMovie, validateMovieId } = require('../middleware/validate');

router.get('/', /* #swagger.tags = ['Movies'] */ controller.getAllMovies);
router.get('/:id', /* #swagger.tags = ['Movies'] */ validateMovieId, controller.getOneMovie);
router.post('/', /* #swagger.tags = ['Movies'] */ ensureAuthenticated, validateMovie, controller.createMovie);
router.put('/:id', /* #swagger.tags = ['Movies'] */ ensureAuthenticated, validateMovieId, validateMovie, controller.updateMovie);
router.delete('/:id', /* #swagger.tags = ['Movies'] */ ensureAuthenticated, validateMovieId, controller.deleteMovie);

module.exports = router;

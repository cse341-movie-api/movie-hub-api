const express = require('express');
const router = express.Router();
const controller = require('../controllers/moviesController');
const { ensureAuthenticated } = require('../middleware/isAuthenticated');

router.get('/', /* #swagger.tags = ['Movies'] */ controller.getAllMovies);
router.get('/:id', /* #swagger.tags = ['Movies'] */ controller.getOneMovie);

router.post('/', /* #swagger.tags = ['Movies'] */ ensureAuthenticated, controller.createMovie);

router.put('/:id', /* #swagger.tags = ['Movies'] */ ensureAuthenticated, controller.updateMovie);

router.delete('/:id', /* #swagger.tags = ['Movies'] */ ensureAuthenticated, controller.deleteMovie);

module.exports = router;

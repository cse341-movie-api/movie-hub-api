const express = require('express');
const router = express.Router();
const controller = require('../controllers/moviesController');

router.get('/', /* #swagger.tags = ['Movies'] */ controller.getAllMovies);
router.get('/:id', /* #swagger.tags = ['Movies'] */ controller.getOneMovie);

router.post('/', /* #swagger.tags = ['Movies] */ controller.createMovie);

router.put('/:id', /* #swagger.tags = ['Movies] */ controller.updateMovie);

router.delete('/:id', /* #swagger.tags = ['Movies'] */ controller.deleteMovie);

module.exports = router;

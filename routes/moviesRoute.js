const express = require('express');
const router = express.Router();
const controller = require('../controllers/moviesController');

router.get('/', controller.getAllMovies);
router.get('/:id', controller.getOneMovie);
router.post('/',controller.createMovie);
router.put('/:id',controller.updateMovie);
router.delete('/:id',controller.deteleMovie);


module.exports = router;



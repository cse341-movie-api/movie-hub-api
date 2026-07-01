const express = require('express');
const router = express.Router();
const controller = require('../controllers/reviewsController');
const {ensureAuthenticated} = require('../middleware/isAuthenticated');

router.get('/',/* #swagger.tags = ['Reviews']*/ controller.getReviews);
router.get('/:id',/* #swagger.tags = ['Reviews']*/ controller.getOneReview);
router.get('/user/:userId',/* #swagger.tags = ['Reviews']*/ controller.userReview);
router.get('/movie/:movieId',/* #swagger.tags = ['Reviews']*/ controller.movieReview);
router.post('/', /* #swagger.tags = ['Reviews']*/ ensureAuthenticated, controller.createReview);
router.put('/:id', /* #swagger.tags = ['Reviews']*/ ensureAuthenticated, controller.updateReview);
router.delete('/:id', /* #swagger.tags = ['Reviews']*/ ensureAuthenticated, controller.deleteReview);
module.exports = router;

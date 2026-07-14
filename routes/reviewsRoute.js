const express = require('express');
const router = express.Router();
const controller = require('../controllers/reviewsController');
const { ensureAuthenticated } = require('../middleware/isAuthenticated');
const { validateReview, validateReviewId, validateReviewUserId, validateReviewMovieId } = require('../middleware/validate');

router.get('/', /* #swagger.tags = ['Reviews'] */ controller.getReviews);
router.get('/user/:userId', /* #swagger.tags = ['Reviews'] */ validateReviewUserId, controller.userReview);
router.get('/movie/:movieId', /* #swagger.tags = ['Reviews'] */ validateReviewMovieId, controller.movieReview);
router.get('/:id', /* #swagger.tags = ['Reviews'] */ validateReviewId, controller.getOneReview);
router.post('/', /* #swagger.tags = ['Reviews'] #swagger.security = [{ "OAuth2HeaderKey": [] }] */ ensureAuthenticated, validateReview, controller.createReview);
router.put('/:id', /* #swagger.tags = ['Reviews'] #swagger.security = [{ "OAuth2HeaderKey": [] }] */ ensureAuthenticated, validateReviewId, validateReview, controller.updateReview);
router.delete('/:id', /* #swagger.tags = ['Reviews'] #swagger.security = [{ "OAuth2HeaderKey": [] }] */ ensureAuthenticated, validateReviewId, controller.deleteReview);

module.exports = router;
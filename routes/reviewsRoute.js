// const express = require('express');
// const router = express.Router();
// const controller = require('../controllers/reviewsController');
// const {ensureAuthenticated} = require('../middleware/isAuthenticated');
// const {validateReview} = require('../middleware/validate');

// router.get('/',/* #swagger.tags = ['Reviews']*/ controller.getReviews);
// router.get('/:id',/* #swagger.tags = ['Reviews']*/ controller.getOneReview);
// router.get('/user/:userId',/* #swagger.tags = ['Reviews']*/ controller.userReview);
// router.get('/movie/:movieId',/* #swagger.tags = ['Reviews']*/ controller.movieReview);
// router.post('/', /* #swagger.tags = ['Reviews']*/ ensureAuthenticated, validateReview, controller.createReview);
// router.put('/:id', /* #swagger.tags = ['Reviews']*/ ensureAuthenticated,validateReview, controller.updateReview);
// router.delete('/:id', /* #swagger.tags = ['Reviews']*/ ensureAuthenticated, controller.deleteReview);
// module.exports = router;
const express = require('express');
const router = express.Router();
const controller = require('../controllers/reviewsController');
const { ensureAuthenticated } = require('../middleware/isAuthenticated');
const { validateReview, validateReviewId, validateReviewUserId, validateReviewMovieId } = require('../middleware/validate');

router.get('/', /* #swagger.tags = ['Reviews'] */ controller.getReviews);
router.get('/user/:userId', /* #swagger.tags = ['Reviews'] */ validateReviewUserId, controller.userReview);
router.get('/movie/:movieId', /* #swagger.tags = ['Reviews'] */ validateReviewMovieId, controller.movieReview);
router.get('/:id', /* #swagger.tags = ['Reviews'] */ validateReviewId, controller.getOneReview);
router.post('/', /* #swagger.tags = ['Reviews'] */ ensureAuthenticated, validateReview, controller.createReview);
router.put('/:id', /* #swagger.tags = ['Reviews'] */ ensureAuthenticated, validateReviewId, validateReview, controller.updateReview);
router.delete('/:id', /* #swagger.tags = ['Reviews'] */ ensureAuthenticated, validateReviewId, controller.deleteReview);

module.exports = router;
const express = require('express');
const router = express.Router();
const controller = require('../controllers/reviewsController');
// Code goes here
router.get('/',/*swagger.tags = ['Reviews']*/ controller.getReviews);
router.get('/:id',/*swagger.tags = ['Reviews']*/ controller.getOneReview);
router.post('/',/*swagger.tags = ['Reviews']*/ controller.postReview);
router.put('/:id',/*swagger.tags = ['Reviews']*/ controller.updateReview)
router.delete('/:id',/*swagger.tags = ['Reviews']*/ controller.deleteReview)
module.exports = router;

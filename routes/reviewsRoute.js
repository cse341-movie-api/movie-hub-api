const express = require('express');
const router = express.Router();
const controller = require('../controllers/reviewsController');
// Code goes here
router.get('/',controller.getReviews);
router.get('/:id',controller.getOneReview);
router.post('/',controller.postReview);
router.put('/:id',controller.updateReview)
router.delete('/:id',controller.deleteReview)
module.exports = router;
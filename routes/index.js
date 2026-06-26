const express = require('express');
const router = express.Router();

router.use('/', require('./swagger'));
router.use('/movies', require('./moviesRoute'));
router.use('/users', require('./usersRoute'));
router.use('/reviews', require('./reviewsRoute'));
router.use('/watchlist', require('./watchlistRoute'));
// Temporarily disabled until we finish collection testing
// router.use('/auth', require('./auth'));

module.exports = router;
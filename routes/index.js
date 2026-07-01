const express = require('express');
const router = express.Router();

router.use('/', require('./swagger'));
router.use('/movies', require('./moviesRoute'));
router.use('/users', require('./usersRoute'));
router.use('/reviews', require('./reviewsRoute'));
router.use('/watchlist', require('./watchlistRoute'));
router.use('/auth', require('./auth'));

module.exports = router;
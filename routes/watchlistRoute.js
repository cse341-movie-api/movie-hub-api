const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');

// GET all watchlist items
router.get('/', /* #swagger.tags = ['Watchlist'] */ watchlistController.getAllWatchlistItems);

// GET watchlist items for a specific user
router.get('/user/:userId', /* #swagger.tags = ['Watchlist'] */ watchlistController.getWatchlistItemsByUserId);

// GET a single watchlist item by its unique ID
router.get('/:id', /* #swagger.tags = ['Watchlist'] */ watchlistController.getWatchlistItemById);

// POST a new item to the watchlist
router.post('/', /* #swagger.tags = ['Watchlist'] */ watchlistController.createWatchlistItem);

// PUT (update) an existing watchlist item completely or partially
router.put('/:id', /* #swagger.tags = ['Watchlist'] */ watchlistController.updateWatchlistItem);

// DELETE an item from the watchlist
router.delete('/:id', /* #swagger.tags = ['Watchlist'] */ watchlistController.deleteWatchlistItem);


module.exports = router;
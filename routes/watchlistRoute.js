const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');

// GET all watchlist items
router.get('/', watchlistController.getAllWatchlistItems);

// GET a single watchlist item by its unique ID
router.get('/:id', watchlistController.getWatchlistItemById);

// POST a new item to the watchlist
router.post('/', watchlistController.createWatchlistItem);

// PUT (update) an existing watchlist item completely or partially
router.put('/:id', watchlistController.updateWatchlistItem);

// DELETE an item from the watchlist
router.delete('/:id', watchlistController.deleteWatchlistItem);

module.exports = router;
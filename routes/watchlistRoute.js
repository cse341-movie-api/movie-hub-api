const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');
const { ensureAuthenticated } = require('../middleware/isAuthenticated');
const { validateWatchlist, validateWatchlistId, validateWatchlistUserId } = require('../middleware/validate');

// GET all watchlist items
router.get('/', /* #swagger.tags = ['Watchlist'] */ watchlistController.getAllWatchlistItems);

// GET watchlist items for a specific user
router.get('/user/:userId', /* #swagger.tags = ['Watchlist'] */ validateWatchlistUserId, watchlistController.getWatchlistItemsByUserId);

// GET a single watchlist item by its unique ID
router.get('/:id', /* #swagger.tags = ['Watchlist'] */ validateWatchlistId, watchlistController.getWatchlistItemById);

// POST a new item to the watchlist
router.post('/', /* #swagger.tags = ['Watchlist'] #swagger.security = [{ "OAuth2HeaderKey": [] }] */ ensureAuthenticated, validateWatchlist, watchlistController.createWatchlistItem);

// PUT (update) an existing watchlist item completely or partially
router.put('/:id', /* #swagger.tags = ['Watchlist'] #swagger.security = [{ "OAuth2HeaderKey": [] }] */ ensureAuthenticated, validateWatchlistId, validateWatchlist, watchlistController.updateWatchlistItem);

// DELETE an item from the watchlist
router.delete('/:id', /* #swagger.tags = ['Watchlist'] #swagger.security = [{ "OAuth2HeaderKey": [] }] */ ensureAuthenticated, validateWatchlistId, watchlistController.deleteWatchlistItem);


module.exports = router;
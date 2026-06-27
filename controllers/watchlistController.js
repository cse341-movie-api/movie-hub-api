const { ObjectId } = require('mongodb');
const mongodb = require('../db/connect');

// Get all watchlist items
const getAllWatchlistItems = async (req, res, next) => { // Add next to the function declaration
  try {
    const result = await mongodb
        .getDb()
        .collection('watchlist')
        .find();

    const lists = await result.toArray();

    return res.status(200).json(lists);
  } catch (error) {
    next(error); // Pass unexpected errors to the global error handler
  }
};

// Get a single watchlist item by ID
const getWatchlistItemById = async (req, res, next) => { // Add next to the function declaration
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Must use a valid watchlist ID to find an item.' });
    }
    const watchlistId = new ObjectId(req.params.id);
    const result = await mongodb
        .getDb()
        .collection('watchlist')
        .findOne({ _id: watchlistId });

    if (!result) {
      return res.status(404).json({ message: 'Watchlist item not found.' });
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error); // Pass unexpected errors to the global error handler
  }
};

// Get watchlist items for a specific user
const getWatchlistItemsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: 'Must provide a valid user ID to find watchlist items.' });
    }

    const result = await mongodb
        .getDb()
        .collection('watchlist')
        .find({ userId });

    const items = await result.toArray();
    
    // Check if the array length is 0 (no items), if yes return 404 message
    if (items.length === 0) {
      return res.status(404).json({ message: 'No watchlist items were found for this user.' });
    }
    
    return res.status(200).json(items);
  } catch (error) {
    next(error); // Pass unexpected errors to the global error handler
  }
};

// Create a new watchlist item
const createWatchlistItem = async (req, res, next) => { // Add next to the function declaration
  try {
    const watchlistItem = {
      userId: req.body.userId,
      movieId: req.body.movieId,
      dateAdded: req.body.dateAdded || new Date().toISOString(),
      status: req.body.status || 'Plan to Watch',
      priority: req.body.priority || 'Medium',
      reminderSet: req.body.reminderSet || false,
      notes: req.body.notes || ''
    };

    const result = await mongodb
        .getDb()
        .collection('watchlist')
        .insertOne(watchlistItem);
        
    if (result.acknowledged) {
        const id = new ObjectId(result.insertedId);
        const newWatchlistItem = await mongodb
            .getDb()
            .collection('watchlist')
            .findOne({ _id: id });
        res.status(201).json(newWatchlistItem);

    } else {
      res.status(500).json({ message: 'Error occurred while creating the watchlist item.' });
    }
  } catch (error) {
    next(error); // Pass unexpected errors to the global error handler
  }
};

// Update an existing watchlist item
const updateWatchlistItem = async (req, res, next) => { // Add next to the function declaration
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Must use a valid watchlist ID to update an item.' });
    }
    const watchlistId = new ObjectId(req.params.id);
    
    const { userId, movieId, dateAdded, status, priority, reminderSet, notes } = req.body;

    const result = await mongodb
        .getDb()
        .collection('watchlist')
        .updateOne(
            { _id: watchlistId },
            {
                $set: {
                    userId,
                    movieId,
                    dateAdded,
                    status,
                    priority,
                    reminderSet,
                    notes
                }
            }
        );

    if (result.matchedCount === 0) {
        return res.status(404).json({
            message: 'Watchlist item not found.'
        });
    }

    const itemAfterUpdate = await mongodb
        .getDb()
        .collection('watchlist')
        .findOne({ _id: watchlistId });

    return res.status(200).json(itemAfterUpdate);
  } catch (error) {
    next(error); // Pass unexpected errors to the global error handler
  }
};

// Delete a watchlist item
const deleteWatchlistItem = async (req, res, next) => { // Add next to the function declaration
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Must use a valid watchlist ID to delete an item.' });
    }
    const watchlistId = new ObjectId(req.params.id);
    const result = await mongodb
        .getDb()
        .collection('watchlist')
        .deleteOne({ _id: watchlistId });

    if (result.deletedCount === 0) {
        return res.status(404).json({
            message: 'Watchlist item not found.'
        });
    }

    return res.status(204).json();
  } catch (error) {
    next(error); // Pass unexpected errors to the global error handler
  }
};

module.exports = {
  getAllWatchlistItems,
  getWatchlistItemById,
  getWatchlistItemsByUserId,
  createWatchlistItem,
  updateWatchlistItem,
  deleteWatchlistItem
};
const { ObjectId } = require('mongodb');
const mongodb = require('../db/connect');

const COLLECTION_NAME = 'watchlist';

// Get all watchlist items
const getAllWatchlistItems = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection(COLLECTION_NAME).find();
        result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'An error occurred while retrieving the watchlist.' });
  }
};

// Get a single watchlist item by ID
const getWatchlistItemById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Must use a valid watchlist ID to find an item.' });
    }
    const watchlistId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection(COLLECTION_NAME).find({ _id: watchlistId });
    
    result.toArray().then((lists) => {
      if (lists.length === 0) {
        return res.status(404).json({ message: 'Watchlist item not found.' });
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists[0]);
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'An error occurred while retrieving the item.' });
  }
};

// Create a new watchlist item
const createWatchlistItem = async (req, res) => {
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

    const response = await mongodb.getDb().db().collection(COLLECTION_NAME).insertOne(watchlistItem);
    if (response.acknowledged) {
      res.status(201).json({
        message: 'Watchlist item created successfully.',
        watchlist_id: response.insertedId
      });
    } else {
      res.status(500).json({ message: 'Error occurred while creating the watchlist item.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create watchlist item.' });
  }
};

// Update an existing watchlist item
const updateWatchlistItem = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Must use a valid watchlist ID to update an item.' });
    }
    const watchlistId = new ObjectId(req.params.id);
    
    const updatedItem = {
      userId: req.body.userId,
      movieId: req.body.movieId,
      dateAdded: req.body.dateAdded,
      status: req.body.status,
      priority: req.body.priority,
      reminderSet: req.body.reminderSet,
      notes: req.body.notes
    };

    const response = await mongodb.getDb().db().collection(COLLECTION_NAME)
      .replaceOne({ _id: watchlistId }, updatedItem);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'No item found with that ID or no new data provided to update.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update watchlist item.' });
  }
};

// Delete a watchlist item
const deleteWatchlistItem = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Must use a valid watchlist ID to delete an item.' });
    }
    const watchlistId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection(COLLECTION_NAME)
      .deleteOne({ _id: watchlistId });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'Watchlist item deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Watchlist item not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete watchlist item.' });
  }
};

module.exports = {
  getAllWatchlistItems,
  getWatchlistItemById,
  createWatchlistItem,
  updateWatchlistItem,
  deleteWatchlistItem
};
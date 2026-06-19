const { ObjectId } = require('mongodb');
const mongodb = require('../db/connect');
const db = mongodb.getDb();

const collection = db.collection('watchlist');

// Get all watchlist items
const getAllWatchlistItems = async (req, res, next) => { // Add next to the function declaration
  try {
    const result = await mongodb
        .collection(collection)
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
        .collection(collection)
        .find({ _id: watchlistId });
    
    result.toArray().then((lists) => {
      if (lists.length === 0) {
        return res.status(404).json({ message: 'Watchlist item not found.' });
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists[0]);
    });
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

    const response = await mongodb
        .collection(collection)
        .insertOne(watchlistItem);
        
    if (response.acknowledged) {
        const id = new ObjectId(response.insertedId);
        const newWatchlistItem = await db.collection(collection).getOne({ _id: id });
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
    
    const updatedItem = {
      userId: req.body.userId,
      movieId: req.body.movieId,
      dateAdded: req.body.dateAdded,
      status: req.body.status,
      priority: req.body.priority,
      reminderSet: req.body.reminderSet,
      notes: req.body.notes
    };

    const response = await mongodb
        .collection(collection)
        .updateOne(
            { _id: watchlistId },
            {
                $set: {
                userId: req.body.userId,
                movieId: req.body.movieId,
                dateAdded: req.body.dateAdded,
                status: req.body.status,
                priority: req.body.priority,
                reminderSet: req.body.reminderSet,
                notes: req.body.notes
                }
            }
        );

    if (response.matchedCount === 0) {
        return res.status(404).json({
            message: 'Watchlist item not found.'
        });
    }

    return res.status(204).send();
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
    const response = await mongodb
        .collection(collection)
        .deleteOne({ _id: watchlistId });

    if (response.deletedCount === 0) {
        return res.status(404).json({
            message: 'Watchlist item not found.'
        });
    }

    return res.status(204).send();
  } catch (error) {
    next(error); // Pass unexpected errors to the global error handler
  }
};

module.exports = {
  getAllWatchlistItems,
  getWatchlistItemById,
  createWatchlistItem,
  updateWatchlistItem,
  deleteWatchlistItem
};
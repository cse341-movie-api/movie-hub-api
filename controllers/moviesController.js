const { getDb } = require('../db/connect');
const { ObjectId } = require('mongodb');

/**
 * @description Retrieve all movies
 * @route GET /movies
 */
const getAllMovies = async (req, res, next) => {
  try {
    const db = getDb();
    const collection = db.collection('movies');
    const movies = await collection.find({}).toArray();

    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

/**
 * @description Retrieve a single movie using an id
 * @route GET /movies/:id
 */
const getOneMovie = async (req, res, next) => {
  const id = req.params.id;
  try {
    const db = getDb();
    const collection = db.collection('movies');
    const movie = await collection.findOne(new ObjectId(id));

    res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMovies,
  getOneMovie,
};

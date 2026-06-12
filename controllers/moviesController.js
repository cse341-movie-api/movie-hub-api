const { getDb } = require('../db/connect');
const { ObjectId } = require('mongodb');

/**
 * @description Retrieve all movies
 * @route GET /movies
 */
const getAllMovies = async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection('movies');
    const movies = await collection.find({}).toArray();

    res.status(200).json(movies);
  } catch (error) {
    res.status(404).json(error);
  }
};

/**
 * @description Retrieve a single movie using an id
 * @route GET /movies/:id
 */
const getOneMovie = async (req, res) => {
  const id = req.params.id;
  try {
    const db = getDb();
    const collection = db.collection('movies');
    const movie = await collection.findOne(new ObjectId(id));

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getAllMovies,
  getOneMovie,
};

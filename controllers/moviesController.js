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
    const result = await collection.find().toArray();

    res.status(200).json(result);
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
    const result = await collection.findOne({ _id: new ObjectId(id) });

    if (!result) {
      return res.status(404).json({ error: 'Movie not found.' });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @description Creates a new movie resource
 * @route POST /movies
 */
const createMovie = async (req, res, next) => {
  // TODO: Add validation
  const movie = {
    title: req.body.title,
    year: req.body.year,
    plot: req.body.plot,
    genres: req.body.genres,
    runtime: req.body.runtime,
    rated: req.body.rated,
    cast: req.body.cast,
    poster: req.body.poster,
    languages: req.body.languages,
    imdb: req.body.imdb,
    rotten_tomatoes: req.body.rotten_tomatoes,
  };

  try {
    const db = getDb();
    const collection = db.collection('movies');
    const result = await collection.insertOne(movie);

    const id = new ObjectId(result.insertedId);
    const newMovie = await collection.findOne({ _id: id });
    return res.status(201).json(newMovie);
  } catch (error) {
    next(error);
  }
};

/**
 * @description Update a movie resource
 * @route PUT /movies/:id
 */
const updateMovie = async (req, res, next) => {
  // TODO: Add validation
  const id = req.params.id;

  const movie = {
    title: req.body.title,
    year: req.body.year,
    plot: req.body.plot,
    genres: req.body.genres,
    runtime: req.body.runtime,
    rated: req.body.rated,
    cast: req.body.cast,
    poster: req.body.poster,
    languages: req.body.languages,
    imdb: req.body.imdb,
    rotten_tomatoes: req.body.rotten_tomatoes,
  };

  try {
    const db = getDb();
    const collection = db.collection('movies');
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: movie },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Movie not found.' });
    }

    const updatedMovie = await collection.findOne({ _id: new ObjectId(id) });
    return res.status(200).json(updatedMovie);
  } catch (error) {
    next(error);
  }
};

/**
 * @description Delete a movie resource
 * @route DELETE /movies/:id
 */
const deleteMovie = async (req, res, next) => {
  const id = req.params.id;

  try {
    const db = getDb();
    const collection = db.collection('movies');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Movie not found.' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMovies,
  getOneMovie,
  createMovie,
  updateMovie,
  deleteMovie,
};

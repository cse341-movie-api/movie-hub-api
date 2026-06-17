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
const createMovie = async (req,res, next) => {
  const movie = {
    title: req.body.title,
    year: req.body.title,
    plot: req.body.plot,
    genres: req.body.genres,
    runtime: req.body.runtime,
    rated: req.body.rated,
    cast: req.body.cast,
    poster: req.body.poster,
    languages: req.body.languages,
    imdb: req.body.imdb,
    rotten_tomatoes: req.body.rotten_tomatoes 
  }

  try {
    const POST = await getDb().collection('movies').insertOne(movie);
            if (POST.acknowledged) {
                res.status(201).json(POST);
                return;
            } 
  } catch (error) {
    next(error);
  }
}

const updateMovie = async (req,res) => {
  const id = req.params.id;
  const movie = {
    title: req.body.title,
    year: req.body.title,
    plot: req.body.plot,
    genres: req.body.genres,
    runtime: req.body.runtime,
    rated: req.body.rated,
    cast: req.body.cast,
    poster: req.body.poster,
    languages: req.body.languages,
    imdb: req.body.imdb,
    rotten_tomatoes: req.body.rotten_tomatoes 
  }
  try {
    const PUT = await getDb().collection('movies').replaceOne({ _id: id }, movie);
        if (PUT.acknowledged) {
            return res.status(204).json(PUT);

        }
  } catch (error) {
    next(error);
  }

}
const deteleMovie = async (req,res) => {
  const id = req.params.id;

  try {
    const DELETE = await mongodb.getDb().collection('movies').deleteOne({ _id: id });
        if (DELETE.acknowledged) {
            return res.status(204).json(DELETE);
        }
  } catch (error) {
    next(error);
  }
}


module.exports = {
  getAllMovies,
  getOneMovie,
  createMovie,
  updateMovie,
  deteleMovie
};


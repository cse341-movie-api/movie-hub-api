const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
const collection = 'reviews';

const getReviews = async (req, res, next) => {

    try {
        const result = await mongodb
            .getDb()
            .collection(collection)
            .find()
            .toArray();

        res.status(200).json(result);

    }
    catch (error) {
        next(error);
    };
}
const getOneReview = async (req, res, next) => {
    const id = req.params.id;
    try {
        const result = await mongodb
            .getDb()
            .collection(collection)
            .findOne({ _id: new ObjectId(id) });


        if (!result) {
            return res.status(404).json({ error: 'The review was not found in the database.' });
        } else {
            res.status(200).json(result)
        }

    } catch (error) {
        next(error);
    }
}
const userReview = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const result = await mongodb
            .getDb()
            .collection(collection)
            .find({ userId: new ObjectId(userId) })
            .toArray();


        if (result.length === 0) {
            return res.status(404).json({ error: 'The review was not found in the database.' });
        } else {
            res.status(200).json(result)
        }

    } catch (error) {
        next(error);
    }
}
const movieReview = async (req, res, next) => {
    const movieId = req.params.movieId;
    try {
        const result = await mongodb
            .getDb()
            .collection(collection)
            .find({ movieId: new ObjectId(movieId) })
            .toArray();


        if (result.length === 0) {
            return res.status(404).json({ error: 'The review was not found in the database.' });
        } else {
            res.status(200).json(result)
        }

    } catch (error) {
        next(error);
    }
}

const createReview = async (req, res, next) => {
    const review = {
        userId: req.body.userId,
        movieId: req.body.movieId,
        rating: req.body.rating,
        reviewText: req.body.reviewText,
        dateCreated: new Date(),
        authorName: req.body.authorName,
        isSpoiler: req.body.isSpoiler
    }
    try {
        const db = mongodb.getDb();
        const result = await db.collection(collection).insertOne(review);

        if (result.acknowledged) {
            const createdReview = await mongodb.getDb().collection(collection).findOne({ _id: result.insertedId });
            res.status(201).json(createdReview);
            return;
        }

    } catch (error) {
        next(error);
    }
}
const updateReview = async (req, res, next) => {
    const id = req.params.id;
    const {
        userId,
        movieId,
        rating,
        reviewText,
        authorName,
        isSpoiler
    } = req.body;

    try {
        const result = await mongodb
            .getDb()
            .collection(collection)
            .updateOne({ _id: new ObjectId(id) },
                {
                    $set: {
                        userId,
                        movieId,
                        rating,
                        reviewText,
                        authorName,
                        isSpoiler
                    }
                });
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'the review could not be found in the database.' })

        } else if (result.acknowledged) {
            const UpdatedReview = await mongodb.getDb().collection(collection).findOne({ _id: new ObjectId(id) });
            return res.status(200).json(UpdatedReview);
        }

    } catch (error) {
        next(error);

    }
}
const deleteReview = async (req, res, next) => {
    const id = req.params.id;
    try {
        const result = await mongodb
            .getDb()
            .collection(collection)
            .deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'the review could not be found in the database.' })

        } else if (result.acknowledged) {
            return res.status(204).json();
        }
    } catch (error) {
        next(error);
    }
}


module.exports = {
    getReviews,
    getOneReview,
    createReview,
    updateReview,
    deleteReview,
    userReview,
    movieReview
}
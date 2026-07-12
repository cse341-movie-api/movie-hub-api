const { ObjectId } = require('mongodb');
const Joi = require('joi');

const userSchema = Joi.object({
    googleId: Joi.string().required(),
    displayName: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('user', 'admin').default('user'),
    location: Joi.string().optional().allow(''),
    preferences: Joi.object({
        favoriteGenre: Joi.string().optional().allow(''),
        notifications: Joi.boolean().optional()
    }).optional()
}).unknown(true);

const movieSchema = Joi.object({
    title: Joi.string().trim().required(),
    year: Joi.number().integer().min(1800).max(new Date().getFullYear() + 5).required(),
    plot: Joi.string().trim().required(),
    genres: Joi.array().items(Joi.string().trim()).min(1).required(),
    runtime: Joi.number().integer().min(1).required(),
    rated: Joi.string().valid('G', 'PG', 'PG-13', 'R', 'NC-17', 'Not Rated').required(),
    cast: Joi.array().items(Joi.string().trim()).optional(),
    poster: Joi.string().uri().optional().allow(''),
    languages: Joi.array().items(Joi.string().trim()).optional(),
    imdb: Joi.object({ rating: Joi.number().min(0).max(10).required() }).optional().allow(null),
    rotten_tomatoes: Joi.object({ tomato_meter: Joi.number().integer().min(0).max(100).required() }).optional().allow(null)
}).unknown(true);

const reviewSchema = Joi.object({
    userId: Joi.string().custom((value, helpers) => {
        if (!ObjectId.isValid(value)) return helpers.error('any.invalid');
        return value;
    }, 'MongoDB ObjectId Validation').required().messages({ 'any.invalid': 'userId must be a valid MongoDB ObjectId.' }),
    movieId: Joi.string().custom((value, helpers) => {
        if (!ObjectId.isValid(value)) return helpers.error('any.invalid');
        return value;
    }, 'MongoDB ObjectId Validation').required().messages({ 'any.invalid': 'movieId must be a valid MongoDB ObjectId.' }),
    rating: Joi.number().min(1).max(5).required(),
    reviewText: Joi.string().required(),
    authorName: Joi.string().required(),
    isSpoiler: Joi.boolean().required()
}).unknown(true);

const watchlistSchema = Joi.object({
    userId: Joi.string().required(),
    movieId: Joi.string().required(),
    status: Joi.string().valid('Plan to Watch', 'Watching', 'Completed', 'Dropped').default('Plan to Watch'),
    priority: Joi.string().valid('Low', 'Medium', 'High').default('Medium'),
    reminderSet: Joi.boolean().default(false),
    notes: Joi.string().optional().allow('')
}).unknown(true);

const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body, { errors: { wrap: { label: false } } });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const validateMovie = (req, res, next) => {
    const { error } = movieSchema.validate(req.body, { errors: { wrap: { label: false } } });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body, { errors: { wrap: { label: false } } });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const validateWatchlist = (req, res, next) => {
    const { error } = watchlistSchema.validate(req.body, { errors: { wrap: { label: false } } });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const validateWatchlistId = (req, res, next) => {
    if (!req.params.id || !ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            message: "Must use a valid watchlist ID to find an item."
        });
    }
    next();
};

const validateWatchlistUserId = (req, res, next) => {
    if (!req.params.userId || !ObjectId.isValid(req.params.userId)) {
        return res.status(400).json({
            message: "Must provide a valid user ID to find watchlist items."
        });
    }
    next();
};

const validateUserId = (req, res, next) => {
    if (!req.params.id || !ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            message: "Must use a valid user ID to find an item."
        });
    }
    next();
};

const validateReviewId = (req, res, next) => {
    if (!req.params.id || !ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            message: "Must use a valid review ID to find an item."
        });
    }
    next();
};

const validateMovieId = (req, res, next) => {
    if (!req.params.id || !ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            message: "Must use a valid movie ID to find an item."
        });
    }

    next();
};

module.exports = {
    validateUser,
    validateMovie,
    validateMovieId,
    validateReview,
    validateWatchlist,
    validateWatchlistId,
    validateWatchlistUserId,
    validateUserId,
    validateReviewId
};
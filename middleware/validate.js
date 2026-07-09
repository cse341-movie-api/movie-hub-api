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
    title: Joi.string().required(),
    director: Joi.string().required(),
    releaseYear: Joi.number().integer().min(1800).max(new Date().getFullYear() + 5).required(),
    genre: Joi.array().items(Joi.string()).required(),
    runtimeMinutes: Joi.number().integer().min(1).required(),
    synopsis: Joi.string().required(),
    rating: Joi.string().valid('G', 'PG', 'PG-13', 'R', 'NC-17', 'Not Rated').required()
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

module.exports = {
    validateUser,
    validateMovie,
    validateReview,
    validateWatchlist
};
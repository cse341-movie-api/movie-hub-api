const request = require('supertest');
const express = require('express');

// Mock review controller functions
jest.mock('../controllers/reviewsController', () => ({
    getReviews: jest.fn((req, res) => {
        res.status(200).json({ handler: 'getReviews' });
    }),

    getOneReview: jest.fn((req, res) => {
        res.status(200).json({ handler: 'getOneReview', id: req.params.id });
    }),

    userReview: jest.fn((req, res) => {
        res.status(200).json({ handler: 'userReview', userId: req.params.userId });
    }),

    movieReview: jest.fn((req, res) => {
        res.status(200).json({ handler: 'movieReview', movieId: req.params.movieId });
    }),

    createReview: jest.fn((req, res) => {
        res.status(201).json({ handler: 'createReview' });
    }),

    updateReview: jest.fn((req, res) => {
        res.status(200).json({ handler: 'updateReview', id: req.params.id });
    }),

    deleteReview: jest.fn((req, res) => {
        res.status(204).send();
    })
}));

jest.mock('../middleware/isAuthenticated', () => ({
    ensureAuthenticated: jest.fn((req, res, next) => {
        next();
    })
}));

jest.mock('../middleware/validate', () => ({
    validateReview: jest.fn((req, res, next) => {
        next();
    }),

    validateReviewId: jest.fn((req, res, next) => {
        next();
    }),

    validateReviewUserId: jest.fn((req, res, next) => {
        next();
    }),

    validateReviewMovieId: jest.fn((req, res, next) => {
        next();
    })
}));

const reviewsRouter = require('../routes/reviewsRoute');
const reviewsController = require('../controllers/reviewsController');
const { ensureAuthenticated } = require('../middleware/isAuthenticated');
const { validateReview, validateReviewId, validateReviewUserId, validateReviewMovieId } = require('../middleware/validate');

const app = express();
app.use(express.json());
app.use('/reviews', reviewsRouter);

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Reviews Route Tests', () => {
    describe('GET /reviews', () => {
        it('should route the request to getReviews', async () => {
            const res = await request(app).get('/reviews');
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ handler: 'getReviews' });
            expect(reviewsController.getReviews).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /reviews/user/:userId', () => {
        it('should run user ID validation and route to userReview', async () => {
            const userId = '665f8a1b2c3d4e5f6a7b8c9d';
            const res = await request(app).get(`/reviews/user/${userId}`);
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ handler: 'userReview', userId });
            expect(validateReviewUserId).toHaveBeenCalledTimes(1);
            expect(reviewsController.userReview).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /reviews/movie/:movieId', () => {
        it('should run movie ID validation and route to movieReview', async () => {
            const movieId = '573a1397f29313caabce8783';
            const res = await request(app).get(`/reviews/movie/${movieId}`);
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ handler: 'movieReview', movieId });
            expect(validateReviewMovieId).toHaveBeenCalledTimes(1);
            expect(reviewsController.movieReview).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /reviews/:id', () => {
        it('should run review ID validation and route to getOneReview', async () => {
            const id = '6a3c3951ecc7db183386198e';
            const res = await request(app).get(`/reviews/${id}`);
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ handler: 'getOneReview', id });
            expect(validateReviewId).toHaveBeenCalledTimes(1);
            expect(reviewsController.getOneReview).toHaveBeenCalledTimes(1);
        });
    });

    describe('POST /reviews', () => {
        it('should run authentication and validation before creating a review', async () => {
            const res = await request(app)
                .post('/reviews')
                .send({
                    userId: '665f8a1b2c3d4e5f6a7b8c9d',
                    movieId: '573a1397f29313caabce8783',
                    rating: 5,
                    reviewText: 'An excellent movie.',
                    authorName: 'Jane Doe',
                    isSpoiler: false
                });

            expect(res.status).toBe(201);
            expect(res.body).toEqual({ handler: 'createReview' });
            expect(ensureAuthenticated).toHaveBeenCalledTimes(1);
            expect(validateReview).toHaveBeenCalledTimes(1);
            expect(reviewsController.createReview).toHaveBeenCalledTimes(1);
        });
    });

    describe('PUT /reviews/:id', () => {
        it('should run authentication and validation before updating a review', async () => {
            const id = '6a3c3951ecc7db183386198e';
            const res = await request(app)
                .put(`/reviews/${id}`)
                .send({
                    userId: '665f8a1b2c3d4e5f6a7b8c9d',
                    movieId: '573a1397f29313caabce8783',
                    rating: 4,
                    reviewText: 'Updated review text.',
                    authorName: 'Jane Doe',
                    isSpoiler: false
                });

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ handler: 'updateReview', id });
            expect(ensureAuthenticated).toHaveBeenCalledTimes(1);
            expect(validateReviewId).toHaveBeenCalledTimes(1);
            expect(validateReview).toHaveBeenCalledTimes(1);
            expect(reviewsController.updateReview).toHaveBeenCalledTimes(1);
        });
    });

    describe('DELETE /reviews/:id', () => {
        it('should run authentication and review ID validation before deleting a review', async () => {
            const id = '6a3c3951ecc7db183386198e';
            const res = await request(app).delete(`/reviews/${id}`);
            expect(res.status).toBe(204);
            expect(ensureAuthenticated).toHaveBeenCalledTimes(1);
            expect(validateReviewId).toHaveBeenCalledTimes(1);
            expect(reviewsController.deleteReview).toHaveBeenCalledTimes(1);
        });
    });
});
const request = require('supertest');
const express = require('express');

jest.mock('../controllers/watchlistController', () => ({
    getAllWatchlistItems: jest.fn((req, res) => {
        res.status(200).json({ handler: 'getAllWatchlistItems' });
    }),

    getWatchlistItemById: jest.fn((req, res) => {
        res.status(200).json({ handler: 'getWatchlistItemById', id: req.params.id });
    }),

    getWatchlistItemsByUserId: jest.fn((req, res) => {
        res.status(200).json({ handler: 'getWatchlistItemsByUserId', userId: req.params.userId });
    }),

    createWatchlistItem: jest.fn((req, res) => {
        res.status(201).json({ handler: 'createWatchlistItem' });
    }),

    updateWatchlistItem: jest.fn((req, res) => {
        res.status(200).json({ handler: 'updateWatchlistItem', id: req.params.id });
    }),

    deleteWatchlistItem: jest.fn((req, res) => {
        res.status(204).send();
    })
}));

jest.mock('../middleware/isAuthenticated', () => ({
    ensureAuthenticated: jest.fn((req, res, next) => {
        next();
    })
}));

jest.mock('../middleware/validate', () => ({
    validateWatchlist: jest.fn((req, res, next) => {
        next();
    }),

    validateWatchlistId: jest.fn((req, res, next) => {
        next();
    }),

    validateWatchlistUserId: jest.fn((req, res, next) => {
        next();
    })
}));

const watchlistRouter = require('../routes/watchlistRoute');
const watchlistController = require('../controllers/watchlistController');
const { ensureAuthenticated } = require('../middleware/isAuthenticated');
const { validateWatchlist, validateWatchlistId, validateWatchlistUserId } = require('../middleware/validate');

const app = express();
app.use(express.json());
app.use('/watchlist', watchlistRouter);

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Watchlist Route Tests', () => {
    describe('GET /watchlist', () => {
        it('should route the request to getAllWatchlistItems', async () => {
            const res = await request(app).get('/watchlist');
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ handler: 'getAllWatchlistItems' });
            expect(watchlistController.getAllWatchlistItems).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /watchlist/user/:userId', () => {
        it('should run user ID validation and route to getWatchlistItemsByUserId', async () => {
            const userId = '665f8a1b2c3d4e5f6a7b8c9d';
            const res = await request(app).get(`/watchlist/user/${userId}`);
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ handler: 'getWatchlistItemsByUserId', userId });
            expect(validateWatchlistUserId).toHaveBeenCalledTimes(1);
            expect(watchlistController.getWatchlistItemsByUserId).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /watchlist/:id', () => {
        it('should run ID validation and route to getWatchlistItemById', async () => {
            const id = '507f1f77bcf86cd799439011';
            const res = await request(app).get(`/watchlist/${id}`);
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ handler: 'getWatchlistItemById', id });
            expect(validateWatchlistId).toHaveBeenCalledTimes(1);
            expect(watchlistController.getWatchlistItemById).toHaveBeenCalledTimes(1);
        });
    });

    describe('POST /watchlist', () => {
        it('should run authentication and validation before creating an item', async () => {
            const res = await request(app)
                .post('/watchlist')
                .send({
                    userId: '665f8a1b2c3d4e5f6a7b8c9d',
                    movieId: '6a2202b14be80c66150f5454',
                    status: 'Completed',
                    priority: 'Low',
                    reminderSet: false,
                    notes: 'Finished watching.'
                });

            expect(res.status).toBe(201);
            expect(res.body).toEqual({ handler: 'createWatchlistItem' });
            expect(ensureAuthenticated).toHaveBeenCalledTimes(1);
            expect(validateWatchlist).toHaveBeenCalledTimes(1);
            expect(watchlistController.createWatchlistItem).toHaveBeenCalledTimes(1);
        });
    });

    describe('PUT /watchlist/:id', () => {
        it('should run authentication and validation before updating an item', async () => {
            const id = '507f1f77bcf86cd799439011';
            const res = await request(app)
                .put(`/watchlist/${id}`)
                .send({
                    userId: '665f8a1b2c3d4e5f6a7b8c9d',
                    movieId: '6a2202b14be80c66150f5454',
                    status: 'Completed',
                    priority: 'Low',
                    reminderSet: false,
                    notes: 'Finished watching.'
                });

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ handler: 'updateWatchlistItem', id });
            expect(ensureAuthenticated).toHaveBeenCalledTimes(1);
            expect(validateWatchlistId).toHaveBeenCalledTimes(1);
            expect(validateWatchlist).toHaveBeenCalledTimes(1);
            expect(watchlistController.updateWatchlistItem).toHaveBeenCalledTimes(1);
        });
    });

    describe('DELETE /watchlist/:id', () => {
        it('should run authentication and ID validation before deleting an item', async () => {
            const id = '507f1f77bcf86cd799439011';
            const res = await request(app).delete(`/watchlist/${id}`);
            expect(res.status).toBe(204);
            expect(ensureAuthenticated).toHaveBeenCalledTimes(1);
            expect(validateWatchlistId).toHaveBeenCalledTimes(1);
            expect(watchlistController.deleteWatchlistItem).toHaveBeenCalledTimes(1);
        });
    });
});
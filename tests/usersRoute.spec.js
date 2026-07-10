const request = require('supertest');
const express = require('express');

jest.mock('../controllers/usersController', () => ({
    getUserByEmail: jest.fn((req, res) => {
        res.status(200).json({
            handler: 'getUserByEmail',
            email: req.params.email
        });
    }),

    getAllUsers: jest.fn((req, res) => {
        res.status(200).json({ handler: 'getAllUsers' });
    }),

    getOneUser: jest.fn((req, res) => {
        res.status(200).json({ handler: 'getOneUser', id: req.params.id });
    }),

    createUser: jest.fn((req, res) => {
        res.status(201).json({ handler: 'createUser' });
    }),

    updateUser: jest.fn((req, res) => {
        res.status(200).json({ handler: 'updateUser', id: req.params.id });
    }),

    deleteUser: jest.fn((req, res) => {
        res.status(204).send();
    })
}));

jest.mock('../middleware/isAuthenticated', () => ({
    ensureAuthenticated: jest.fn((req, res, next) => {
        next();
    })
}));

jest.mock('../middleware/validate', () => ({
    validateUser: jest.fn((req, res, next) => {
        next();
    }),

    validateUserId: jest.fn((req, res, next) => {
        next();
    })
}));

const usersRouter = require('../routes/usersRoute');
const usersController = require('../controllers/usersController');
const { ensureAuthenticated } = require('../middleware/isAuthenticated');
const { validateUser, validateUserId } = require('../middleware/validate');

const app = express();
app.use(express.json());
app.use('/users', usersRouter);

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Users Route Tests', () => {
    describe('GET /users/email/:email', () => {
        it('should route the request to getUserByEmail', async () => {
            const email = 'rforrester@example.com';
            const res = await request(app).get(`/users/email/${email}`);
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ handler: 'getUserByEmail', email });
            expect(usersController.getUserByEmail).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /users', () => {
        it('should route the request to getAllUsers', async () => {
            const res = await request(app).get('/users');
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ handler: 'getAllUsers' });
            expect(usersController.getAllUsers).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /users/:id', () => {
        it('should run ID validation and route to getOneUser', async () => {
            const id = '6a3c3951ecc7db183386198e';
            const res = await request(app).get(`/users/${id}`);
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ handler: 'getOneUser', id });
            expect(validateUserId).toHaveBeenCalledTimes(1);
            expect(usersController.getOneUser).toHaveBeenCalledTimes(1);
        });
    });

    describe('POST /users', () => {
        it('should run authentication and validation before creating a user', async () => {
            const res = await request(app)
                .post('/users')
                .send({
                    googleId: '109876543210987654321',
                    displayName: 'Robert Forrester',
                    email: 'rforrester@example.com',
                    role: 'user',
                    location: 'Rexburg, ID',
                    preferences: {
                        favoriteGenre: 'Action',
                        notifications: true
                    }
                });
            expect(res.status).toBe(201);
            expect(res.body).toEqual({ handler: 'createUser' });
            expect(ensureAuthenticated).toHaveBeenCalledTimes(1);
            expect(validateUser).toHaveBeenCalledTimes(1);
            expect(usersController.createUser).toHaveBeenCalledTimes(1);
        });
    });

    describe('PUT /users/:id', () => {
        it('should run authentication and validation before updating a user', async () => {
            const id = '6a3c3951ecc7db183386198e';
            const res = await request(app)
                .put(`/users/${id}`)
                .send({
                    googleId: '109876543210987654321',
                    displayName: 'Robert Forrester',
                    email: 'rforrester@example.com',
                    joinedDate: '2026-06-04T15:00:00.000Z',
                    role: 'user',
                    location: 'Rexburg, ID',
                    preferences: {
                        favoriteGenre: 'Action',
                        notifications: true
                    }
                });
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ handler: 'updateUser', id });
            expect(ensureAuthenticated).toHaveBeenCalledTimes(1);
            expect(validateUserId).toHaveBeenCalledTimes(1);
            expect(validateUser).toHaveBeenCalledTimes(1);
            expect(usersController.updateUser).toHaveBeenCalledTimes(1);
        });
    });

    describe('DELETE /users/:id', () => {
        it('should run authentication and ID validation before deleting a user', async () => {
            const id = '6a3c3951ecc7db183386198e';
            const res = await request(app).delete(`/users/${id}`);
            expect(res.status).toBe(204);
            expect(ensureAuthenticated).toHaveBeenCalledTimes(1);
            expect(validateUserId).toHaveBeenCalledTimes(1);
            expect(usersController.deleteUser).toHaveBeenCalledTimes(1);
        });
    });
});
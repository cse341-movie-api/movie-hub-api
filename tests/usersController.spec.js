const request = require('supertest');
const express = require('express');
const { getUserByEmail, getAllUsers, getOneUser, createUser, updateUser, deleteUser } = require('../controllers/usersController');
const { getDb } = require('../db/connect');
const { Collection } = require('mongodb');

// Initializing standalone Express application specifically for testing
const app = express();
app.use(express.json());

// Mapping controller functions to matching endpoints
app.get('/users/email/:email', getUserByEmail);
app.get('/users', getAllUsers);
app.get('/users/:id', getOneUser);
app.post('/users', createUser);
app.put('/users/:id', updateUser);
app.delete('/users/:id', deleteUser);

// Mocked database to protect production and live data
jest.mock('../db/connect', () => ({
    getDb: () => ({
        collection: () => ({
            findOne: jest.fn().mockImplementation((query) => {
                if (query.email === 'rforrester@example.com' || query._id) {
                    return Promise.resolve({
                        _id: '6a3c3951ecc7db183386198e',
                        googleId: '109876543210987654321',
                        displayName: 'Robert Forrester',
                        email: 'rforrester@example.com',
                        role: 'user'
                    });
                }
                return Promise.resolve(null); // Emulates document not found
            }),
            find: () => ({
                toArray: () => Promise.resolve([{ email: 'rforreseter@example.com', displayName: 'Robert Forrester' }
                ])
            }),
            insertOne: jest.fn().mockResolvedValue({ acknowledged: true, insertedId: '6a3c3951ecc7db183386198e' }),
            updateOne: jest.fn().mockImplementation((query) => {
                if (query._id && query._id.toString() === '6a3c3951ecc7db183386198e') {
                    return Promise.resolve({ matchedCount: 1, acknowledged: true });
                }
                return Promise.resolve({ matchedCount: 0, acknowledged: true });
            }),
            deleteOne: jest.fn().mockImplementation((query) => {
                if (query._id && query._id.toString() === '6a3c3951ecc7db183386198e') {
                    return Promise.resolve({ deletedCount: 1 });
                }
                return Promise.resolve({ deletedCount: 0 });
            })
        })
    })
}));

describe('Users Collection Unit Test', () => {
    // 1. Test getUserByEmail
    describe('GET /users/email/:email', () => {
        it('should return 200 and user details if the email profile exists', async () => {
            const res = await request(app).get('/users/email/rforrester@example.com');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('email', 'rforrester@example.com');
        });

        it('should return 404 if email is missing from database records', async () => {
            const res = await request(app).get('/users/email/missing@example.com');
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'No user profile was found with that email address.');
        });
    });

    // 2. Test getAllUsers
    describe('GET /users', () => {
        it('should return 200 and an array containing all application users', async () => {
            const res = await request(app).get('/users');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    // 3. Test getOneUser
    describe('GET /users/:id', () => {
        it('should return 200 and user object when creating data succeeds', async () => {
            const res = await request(app).get('/users/6a3c3951ecc7db183386198e');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id', '6a3c3951ecc7db183386198e');
        });
    });

    // 4. Test createUser
    describe('POST /users', () => {
        it('should return 201 and user object when creation data succeeds', async () => {
            const mockBody = {
                googleId: '12345',
                displayName: 'Test User',
                email: 'test@example.com'
            };
            const res = await request(app).post('/users').send(mockBody);
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('displayName', 'Robert Forrester');
        });
    });

    // 5. Test updateUser
    describe('PUT /users/:id', () => {
        it('should return 200 and full user data sheet if document updates correctly', async () => {
            const mockUpdate = { displayName: 'Jonathan Matthews', email: 'jonm@gmail.com', location: 'Boston, MA', preferences: { favoriteGenre: 'Action', notifications: true } };
            const res = await request(app).put('/users/6a3c3951ecc7db183386198e').send(mockUpdate);
            expect(res.status).toBe(200);
        });

        it('should return 404 if trying to update an invalid/non-existent user ID', async () => {
            const mockUpdate = { displayName: 'Bobs Uruncle' };
            const res = await request(app).put('/users/555f8a1b2c3d4e5f6a7b8c9d').send(mockUpdate);
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'User not found. No update occurred.');
        });
    });

    // 6. Test deleteUser
    describe('DELETE /users/:id', () => {
        it('should return 204 status indicating no content when deletion is successful', async () => {
            const res = await request(app).delete('/users/6a3c3951ecc7db183386198e');
            expect(res.status).toBe(204);
        });

        it('should return 404 status if target database record cannot be found to delete', async () => {
            const res = await request(app).delete('/users/555f8a1b2c3d4e5f6a7b8c9d');
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'User not found. No user deleted.');
        });
    });
});


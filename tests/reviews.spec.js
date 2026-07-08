const request = require('supertest');
const express = require('express');
const getDb = require('../db/connect');
const collection = require('mongodb');
const {
    getReviews,
    getOneReview,
    createReview,
    updateReview,
    deleteReview,
    userReview,
    movieReview
}  = require('../controllers/reviewsController');

// Initializing standalone Express application specifically for testing
const app = express();
app.use(express.json());

// Mapping controller functions to matching endpoints
app.get('/',getReviews);
app.get('/:id', getOneReview);
app.get('/user/:userid', userReview);
app.get('/movie/:movieid', movieReview);
app.post('/', createReview);
app.put('/:id', updateReview);
app.delete('/:id', deleteReview);

jest.mock('../db/connect', () => ({
    getDb: () => ({
        collection: () => ({
            findOne: jest.fn().mockImplementation((query) => {
                if (query._id) {
                    return Promise.resolve({
                        _id: '6a3c3951ecc7db183386198e',
                        userId: '665f8a1b2c3d4e5f6a7b8c9d',
                        movieId: '573a1397f29313caabce8783',
                        rating: 5,
                        reviewText: 'An absolute classic! The storytelling is top-tier.',
                        dateCreated: '2026-06-04T14:30:00Z',
                        authorName: 'Jane Doe',
                        isSpoiler: false
                    });
                }
                return Promise.resolve(null); // Emulates document not found
            }),
            find: () => ({
                toArray: () => Promise.resolve([{
                        _id: '6a3c3951ecc7db183386198e',
                        userId: '665f8a1b2c3d4e5f6a7b8c9d',
                        movieId: '573a1397f29313caabce8783',
                        rating: 5,
                        reviewText: 'An absolute classic! The storytelling is top-tier.',
                        dateCreated: '2026-06-04T14:30:00Z',
                        authorName: 'Jane Doe',
                        isSpoiler: false
                    }
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

describe('Reviews Collections Unit Test', () =>{
    //test getReviews
    describe('GET /reviews',() =>{
        it('should return 200 and an array containing all application reviews',async () => {
            const res = await request(app).get('/');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        })
    })
    describe('GET /reviews/:id', () =>{
        it('should return 200 and a review object when creating data succeeds', async () => {
            const res = await request(app).get('/6a3c3951ecc7db183386198e')
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id', '6a3c3951ecc7db183386198e');
        })
    })
    
})
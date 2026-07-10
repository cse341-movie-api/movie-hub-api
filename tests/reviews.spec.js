const request = require('supertest');
const express = require('express');
const getDb = require('../db/connect');
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
app.get('/user/:userId', userReview);
app.get('/movie/:movieId', movieReview);
app.post('/', createReview);
app.put('/:id', updateReview);
app.delete('/:id', deleteReview);

// Error handling middleware (must be after routes)
app.use((err, req, res, next) => {
    console.error("Test error:", err);
    res.status(500).json({ error: err.message });
});

const reviews = [
    {
        _id: '6a3c3951ecc7db183386198e',
        userId: '6a3c3951ecc7db183386198e',
        movieId: '573a1397f29313caabce8783',
        rating: 5,
        reviewText: 'An absolute classic! The storytelling is top-tier.',
        dateCreated: '2026-06-04T14:30:00Z',
        authorName: 'Jane Doe',
        isSpoiler: false
    },
    {
        _id: '6a35f4fb146eb9059a6610c4',
        userId: '665f8a1b2c3d4e5f6a7b8c9d',
        movieId: '6a2202b14be80c66150f5454',
        rating: 10,
        reviewText: 'I hated this movie!',
        dateCreated: '2026-06-20T02:03:39.180+00:00',
        authorName: 'Jane Doe',
        isSpoiler: true
    },
];


jest.mock('../db/connect', () => ({
    getDb: () => ({
        collection: () => ({
            findOne: jest.fn().mockImplementation((query = {}) => {
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
            find: jest.fn().mockImplementation((query = {}) => {
                let filtered = reviews;
                if (query.userId) {
                    filtered = reviews.filter(r=> r.userId === query.userId.toString())
                };
                if (query.movieId) {
                    filtered = reviews.filter(r=> r.movieId === query.movieId.toString())
                };
                return{
                    toArray: () => Promise.resolve(filtered)
                };
            }),
            insertOne: jest.fn().mockResolvedValue({ acknowledged: true, insertedId: '6a3c3951ecc7db183386198e' }),
            updateOne: jest.fn().mockImplementation((query = {}) => {
                if (query._id && query._id.toString() === '6a3c3951ecc7db183386198e') {
                    return Promise.resolve({ matchedCount: 1, acknowledged: true });
                }
                return Promise.resolve({ matchedCount: 0, acknowledged: true });
            }),
            deleteOne: jest.fn().mockImplementation((query = {}) => {
                if (query._id && query._id.toString() === '6a3c3951ecc7db183386198e') {
                    return Promise.resolve({ deletedCount: 1, acknowledged: true });
                }
                return Promise.resolve({ deletedCount: 0, acknowledged: true });
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
    // Test getOneReview
    describe('GET /reviews/:id', () =>{
        it('should return 200 and a review object when creating data succeeds', async () => {
            const res = await request(app).get('/6a3c3951ecc7db183386198e')
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id', '6a3c3951ecc7db183386198e');
        })
    })
    //userReview
    describe('GET /user/:userId', () =>{
        it('should return 200 and a review object when creating data succeeds', async () => {
            const res = await request(app).get('/user/6a3c3951ecc7db183386198e')
            expect(res.status).toBe(200);
            expect(res.body[0]).toHaveProperty('userId', '6a3c3951ecc7db183386198e');
        })
    })
    //movieReview
    describe('GET /movie/:movieId', () =>{
        it('should return 200 and a review object when creating data succeeds', async () => {
            const res = await request(app).get('/movie/573a1397f29313caabce8783')
            expect(res.status).toBe(200);
            expect(res.body[0]).toHaveProperty('movieId', '573a1397f29313caabce8783');
        })
    })
    
    //createReview
    describe('POST /reviews',()=>{
        it('should return 201 and review object when creattion data succceeds', async () => {
            const mockBody = {
                userId: '665f8a1b2c3d4e5f6a7b8c9d',
                movieId: '573a1397f29313caabce8783',
                rating: 5,
                reviewText: 'An absolute classic! The storytelling is top-tier.',
                dateCreated: '2026-06-04T14:30:00Z',
                authorName: 'Jane Doe',
                isSpoiler: false
            }
            const res = await request(app).post('/').send(mockBody);
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('_id', '6a3c3951ecc7db183386198e');
        })
    })
    //updateReview
    describe('PUT /reviews/:id',()=>{
        it('should return 200 and full review data sheet if document updates correctly', async () => {
            const mockUpdate = { 
                userId: '665f8a1b2c3d4e5f6a7b8c9d',
                movieId: '573a1397f29313caabce8783',
                rating: 5,
                reviewText: 'An absolute classic! The storytelling is top-tier.',
                dateCreated: '2026-06-04T14:30:00Z',
                authorName: 'Omarlin Parra',
                isSpoiler: false
            };
            
            const res = await request(app).put('/6a3c3951ecc7db183386198e').send(mockUpdate);
            expect(res.status).toBe(200);
        });
        
        it('should return 404 if trying to update an invalid/non-existent user ID', async () => {
            const mockUpdate = { 
                userId: '665f8a1b2c3d4e5f6a7b8c9d',
                movieId: '573a1397f29313caabce8783',
                rating: 5,
                reviewText: 'An absolute classic! The storytelling is top-tier.',
                dateCreated: '2026-06-04T14:30:00Z',
                authorName: 'Omarlin Parra',
                isSpoiler: false
            };
            const res = await request(app).put('/555f8a1b2c3d4e5f6a7b8c9d').send(mockUpdate);
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('error', 'the review could not be found in the database.');
        });
    })
    //deleteReview
    describe('DELETE /reviews/:id', () => {
            it('should return 204 status indicating no content when deletion is successful', async () => {
                const res = await request(app).delete('/6a3c3951ecc7db183386198e');
                expect(res.status).toBe(204);
            });
    
            it('should return 404 status if target database record cannot be found to delete', async () => {
                const res = await request(app).delete('/555f8a1b2c3d4e5f6a7b8c9d');
                expect(res.status).toBe(404);
                expect(res.body).toHaveProperty('error', 'the review could not be found in the database.');
            });
        });

});
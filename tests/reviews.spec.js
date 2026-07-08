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
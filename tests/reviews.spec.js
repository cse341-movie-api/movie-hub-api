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
const request = require('supertest');
const express = require('express');
const {
  getAllMovies,
  getOneMovie,
  createMovie,
  updateMovie,
  deleteMovie,
} = require('../controllers/moviesController');
const { getDb } = require('../db/connect');
const { Collection } = require('mongodb');

// Initializing standalone Express application for testing
const app = express();
app.use(express.json());

// Map controller functions to endpoints
app.get('/movies', getAllMovies);
app.get('/movies/:id', getOneMovie);
app.post('/movies', createMovie);
app.put('/movies/:id', updateMovie);
app.delete('/movies/:id', deleteMovie);

// Mock data
const data = [
  {
    _id: '6a2202b14be80c66150f545d',
    title: 'Star Wars: Episode IV - A New Hope',
    year: 1977,
    plot: "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a wookiee and two droids to save the universe from the Empire's world-destroying battle-station.",
    genres: ['Action', 'Adventure', 'Fantasy'],
    runtime: 121,
    rated: 'PG',
    cast: ['Mark Hamill', 'Harrison Ford', 'Carrie Fisher', 'Peter Cushing'],
    poster:
      'https://m.media-amazon.com/images/M/MV5BNzVlY2MwMjktM2E4OS00Y2Y3LWE3ZjctYzhkZGM3YzA1ZWM2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SY1000_SX677_AL_.jpg',
    languages: ['English'],
    imdb: {
      rating: 8.6,
    },
    rotten_tomatoes: {
      tomato_meter: 93,
    },
  },
  {
    _id: '6a2202b14be80c66150f5460',
    title: 'The Fugitive',
    year: 1993,
    plot: 'Dr. Richard Kimble, unjustly accused of murdering his wife, must find the real killer while being the target of a nationwide manhunt.',
    genres: ['Action', 'Adventure', 'Crime'],
    runtime: 130,
    rated: 'PG-13',
    cast: ['Harrison Ford', 'Tommy Lee Jones', 'Sela Ward', 'Julianne Moore'],
    poster:
      'https://m.media-amazon.com/images/M/MV5BYmFmOGZjYTItYjY1ZS00OWRiLTk0NDgtMjQ5MzBkYWE2YWE0XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SY1000_SX677_AL_.jpg',
    languages: ['English', 'Polish', 'Spanish'],
    imdb: {
      rating: 7.8,
    },
    rotten_tomatoes: {
      tomato_meter: 96,
    },
  },
];

// Mock database functionality to protect live data
jest.mock('../db/connect', () => ({
  getDb: () => ({
    collection: () => ({
      findOne: jest.fn().mockImplementation((query) => {
        if (query._id && query._id.toString() === '6a2202b14be80c66150f545d') {
          return Promise.resolve(data[0]);
        }
        // Emulate document not found
        return Promise.resolve(null);
      }),

      find: () => ({
        toArray: () => Promise.resolve(data),
      }),

      insertOne: jest.fn().mockResolvedValue({
        acknowledged: true,
        insertedId: '6a2202b14be80c66150f545d',
      }),

      updateOne: jest.fn().mockImplementation((query) => {
        if (query._id && query._id.toString() === '6a2202b14be80c66150f545d') {
          return Promise.resolve({ matchedCount: 1, acknowledged: true });
        }
        return Promise.resolve({ matchedCount: 0, acknowledged: true });
      }),

      deleteOne: jest.fn().mockImplementation((query) => {
        if (query._id && query._id.toString() === '6a2202b14be80c66150f545d') {
          return Promise.resolve({ deletedCount: 1 });
        }
        return Promise.resolve({ deletedCount: 0 });
      }),
    }),
  }),
}));

describe('Movies Collection Unit Test', () => {
  // 1. Test getAllMovies
  describe('GET /movies', () => {
    it('should return 200 and all movies in database', async () => {
      const res = await request(app).get('/movies');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // 2. Test getOneMovie
  describe('GET /movies/:id', () => {
    it('should return 200 and a single movie based on provided id', async () => {
      const res = await request(app).get('/movies/6a2202b14be80c66150f545d');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        'title',
        'Star Wars: Episode IV - A New Hope',
      );
    });

    it('should return 404 if movie is not found', async () => {
      const res = await request(app).get('/movies/6a2202b14be80c66150f545b');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Movie not found.');
    });
  });

  // 3. Test createMovie
  describe('POST /movies', () => {
    it('should return 201 and new movie object', async () => {
      const mockBody = {
        title: 'Test Movie',
        year: 2026,
        plot: 'Test Plot',
        genres: ['Test'],
        runtime: 100,
        rated: 'G',
        cast: ['Cast', 'List'],
        poster: 'http://poster.url',
        languages: ['Language'],
        imdb: { rating: 9.0 },
        rotten_tomatoes: { tomato_meter: 90 },
      };
      const res = await request(app).post('/movies').send(mockBody);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty(
        'title',
        'Star Wars: Episode IV - A New Hope',
      );
    });
  });

  // 4. Test updateMovie
  describe('PUT /movies/:id', () => {
    it('should return 200 along with updated movie resource', async () => {
      const mockUpdate = {
        title: 'Updated Movie',
        year: 2024,
        plot: 'Updated Plot',
        genres: ['Updated'],
        runtime: 120,
        rated: 'PG',
        cast: ['Updated', 'List'],
        poster: 'http://updated-poster.url',
        languages: ['Updated', 'Language'],
        imdb: { rating: 8.0 },
        rotten_tomatoes: { tomato_meter: 95 },
      };
      const res = await request(app)
        .put('/movies/6a2202b14be80c66150f545d')
        .send(mockUpdate);
      expect(res.status).toBe(200);
    });

    it('should return 404 if trying to update an invalid/non-existent movie ID', async () => {
      const mockUpdate = { title: 'Invalid Update' };
      const res = await request(app)
        .put('/movies/5b2202b14be80c66150f545d')
        .send({ title: 'Bad Update' });
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Movie not found.');
    });
  });

  // 5. Test deleteMovie
  describe('DELETE /movies/:id', () => {
    it('should return 204 when a movie is properly deleted', async () => {
      const res = await request(app).delete('/movies/6a2202b14be80c66150f545d');
      expect(res.status).toBe(204);
    });

    it('should return 404 status if movie resource cannot be found', async () => {
      const res = await request(app).delete('/movies/5b2202b14be80c66150f545d');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Movie not found.');
    });
  });
});

const request = require('supertest');
const express = require('express');

jest.mock('../controllers/moviesController', () => ({
  getAllMovies: jest.fn((req, res) => {
    res.status(200).json({ handler: 'getAllMovies' });
  }),

  getOneMovie: jest.fn((req, res) => {
    res.status(200).json({ handler: 'getOneMovie', id: req.params.id });
  }),

  createMovie: jest.fn((req, res) => {
    res.status(201).json({ handler: 'createMovie' });
  }),

  updateMovie: jest.fn((req, res) => {
    res.status(200).json({ handler: 'updateMovie', id: req.params.id });
  }),

  deleteMovie: jest.fn((req, res) => {
    res.status(204).send();
  }),
}));

jest.mock('../middleware/isAuthenticated', () => ({
  ensureAuthenticated: jest.fn((req, res, next) => {
    next();
  }),
}));

const moviesRouter = require('../routes/moviesRoute');
const moviesController = require('../controllers/moviesController');
const { ensureAuthenticated } = require('../middleware/isAuthenticated');

const app = express();
app.use(express.json());
app.use('/movies', moviesRouter);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Movies Route Tests', () => {
  describe('GET /movies', () => {
    it('should route the request to getAllMovies', async () => {
      const res = await request(app).get('/movies');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ handler: 'getAllMovies' });
      expect(moviesController.getAllMovies).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /movies/:id', () => {
    it('should route the request to getOneMovie', async () => {
      const id = '6a2202b14be80c66150f545d';
      const res = await request(app).get(`/movies/${id}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ handler: 'getOneMovie', id });
      expect(moviesController.getOneMovie).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /movies', () => {
    it('should run authentication before routing the request to createMovie', async () => {
      const data = {
        _id: '6a2202b14be80c66150f545d',
        title: 'Star Wars: Episode IV - A New Hope',
        year: 1977,
        plot: "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a wookiee and two droids to save the universe from the Empire's world-destroying battle-station.",
        genres: ['Action', 'Adventure', 'Fantasy'],
        runtime: 121,
        rated: 'PG',
        cast: [
          'Mark Hamill',
          'Harrison Ford',
          'Carrie Fisher',
          'Peter Cushing',
        ],
        poster:
          'https://m.media-amazon.com/images/M/MV5BNzVlY2MwMjktM2E4OS00Y2Y3LWE3ZjctYzhkZGM3YzA1ZWM2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SY1000_SX677_AL_.jpg',
        languages: ['English'],
        imdb: {
          rating: 8.6,
        },
        rotten_tomatoes: {
          tomato_meter: 93,
        },
      };
      const res = await request(app).post('/movies').send(data);
      expect(res.status).toBe(201);
      expect(ensureAuthenticated).toHaveBeenCalledTimes(1);
      expect(moviesController.createMovie).toHaveBeenCalledTimes(1);
    });
  });

  describe('PUT /movies/:id', () => {
    it('should run authentication before routing the request to updateMovie', async () => {
      const id = '6a2202b14be80c66150f545d';
      const data = {
        _id: '6a2202b14be80c66150f545d',
        title: 'Star Wars: Episode IV - A New Hope',
        year: 1977,
        plot: "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a wookiee and two droids to save the universe from the Empire's world-destroying battle-station.",
        genres: ['Action', 'Adventure', 'Fantasy'],
        runtime: 121,
        rated: 'PG',
        cast: [
          'Mark Hamill',
          'Harrison Ford',
          'Carrie Fisher',
          'Peter Cushing',
        ],
        poster:
          'https://m.media-amazon.com/images/M/MV5BNzVlY2MwMjktM2E4OS00Y2Y3LWE3ZjctYzhkZGM3YzA1ZWM2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SY1000_SX677_AL_.jpg',
        languages: ['English'],
        imdb: {
          rating: 8.6,
        },
        rotten_tomatoes: {
          tomato_meter: 93,
        },
      };
      const res = await request(app).put(`/movies/${id}`).send(data);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ handler: 'updateMovie', id });
      expect(ensureAuthenticated).toHaveBeenCalledTimes(1);
      expect(moviesController.updateMovie).toHaveBeenCalledTimes(1);
    });
  });

  describe('DELETE /movies/:id', () => {
    it('should run authentication before routing the request to deleteMovie', async () => {
      const id = '6a2202b14be80c66150f545d';
      const res = await request(app).delete(`/movies/${id}`);
      expect(res.status).toBe(204);
      expect(ensureAuthenticated).toHaveBeenCalledTimes(1);
      expect(moviesController.deleteMovie).toHaveBeenCalledTimes(1);
    });
  });
});

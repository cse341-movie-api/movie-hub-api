const request = require('supertest');
const app = require('../server');

describe('Server Setup Unit Test', () => {

  describe('GET /', () => {
    it('should return 200 when the server route is working', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
    });
  });

  describe('GET invalid route', () => {
    it('should return 404 for a route that does not exist', async () => {
      const res = await request(app).get('/completely-fake-route-path');
      expect(res.status).toBe(404);
    });
  });

  describe('Route Input Validation Handler', () => {
    it('should intercept malformed ObjectIds and return a 400 validation error', async () => {
      const res = await request(app).get('/watchlist/not-a-valid-object-id');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Must use a valid watchlist ID to find an item.');
    });
  });

  describe('Global 500 Error Middleware Handler', () => {
    it('should catch unhandled runtime exceptions and return a 500 status code', async () => {
      app.get('/force-a-system-crash', (req, res, next) => {
        const err = new Error('Simulated database connection failure.');
        next(err);
      });

      const res = await request(app).get('/force-a-system-crash');
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('message', 'An internal server error occurred.');
      expect(res.body).toHaveProperty('error', 'Simulated database connection failure.');
    });
  });

});
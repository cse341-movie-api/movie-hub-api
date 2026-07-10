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

  describe('Error Handler', () => {
    it('should return 500 when an internal server error occurs', async () => {
      const res = await request(app).get('/watchlist/not-a-valid-object-id');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('message', 'An internal server error occurred.');
    });
  });

});
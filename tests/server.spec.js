const request = require('supertest');
const express = require('express');

describe('Server Setup Unit Test', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Root route used to verify the server is running
    app.get('/', (req, res) => {
      res.status(200).json({ message: 'Server is running' });
    });

    // Route used to test the global error handler
    app.get('/error-test', (req, res, next) => {
      next(new Error('Test error'));
    });

    // Test route to verify JSON requests
    app.post('/echo', (req, res) => {
      res.status(200).json(req.body);
    });

    // Global error handler
    app.use((err, req, res, next) => {
      res.status(500).json({
        message: 'An internal server error occurred.',
        error: err.message
      });
    });
  });

  describe('GET /', () => {
    it('should return 200 when the server route is working', async () => {
      const res = await request(app).get('/');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Server is running');
    });
  });

  describe('POST /echo', () => {
    it('should return the same JSON that was sent', async () => {
      const body = {
        name: 'Alvaro',
        course: 'CSE341'
      };

      const res = await request(app).post('/echo').send(body);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(body);
    });
  });

  describe('GET invalid route', () => {
    it('should return 404 for a route that does not exist', async () => {
      const res = await request(app).get('/not-found');

      expect(res.status).toBe(404);
    });
  });

  describe('Error Handler', () => {
    it('should return 500 when an internal server error occurs', async () => {
      const res = await request(app).get('/error-test');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('message', 'An internal server error occurred.');
      expect(res.body).toHaveProperty('error', 'Test error');
    });
  });
});
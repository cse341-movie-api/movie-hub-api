const request = require('supertest');
const express = require('express');
const {
  getAllWatchlistItems,
  getWatchlistItemById,
  getWatchlistItemsByUserId,
  createWatchlistItem,
  updateWatchlistItem,
  deleteWatchlistItem
} = require('../controllers/watchlistController');

// Initializing standalone Express application specifically for testing
const app = express();
app.use(express.json());

// Mapping controller functions to matching endpoints
app.get('/watchlist', getAllWatchlistItems);
app.get('/watchlist/user/:userId', getWatchlistItemsByUserId);
app.get('/watchlist/:id', getWatchlistItemById);
app.post('/watchlist', createWatchlistItem);
app.put('/watchlist/:id', updateWatchlistItem);
app.delete('/watchlist/:id', deleteWatchlistItem);

// Mocked database to protect production and live data
jest.mock('../db/connect', () => {
  const store = [
    {
      _id: '507f1f77bcf86cd799439011',
      userId: 'user123',
      movieId: 'movie123',
      status: 'Plan to Watch',
      priority: 'Medium'
    }
  ];
  let lastInsertedItem = null;

  return {
    getDb: () => ({
      collection: () => ({
        find: jest.fn().mockImplementation((query) => ({
          toArray: () => Promise.resolve(
            query && query.userId
              ? store.filter((item) => item.userId === query.userId)
              : store
          )
        })),
        findOne: jest.fn().mockImplementation((query) => {
          const id = query && query._id ? (query._id.toString() === '[object Object]' ? query._id.toHexString() : query._id.toString()) : null;
          const item = store.find((entry) => entry._id === id);
          if (item) {
            return Promise.resolve(item);
          }
          if (lastInsertedItem && lastInsertedItem._id === id) {
            return Promise.resolve(lastInsertedItem);
          }
          return Promise.resolve(null);
        }),
        insertOne: jest.fn().mockImplementation((item) => {
          const createdItem = { ...item, _id: '507f1f77bcf86cd799439012' };
          lastInsertedItem = createdItem;
          store.push(createdItem);
          return Promise.resolve({ acknowledged: true, insertedId: createdItem._id });
        }),
        updateOne: jest.fn().mockImplementation((query, update) => {
          const id = query && query._id ? (query._id.toString() === '[object Object]' ? query._id.toHexString() : query._id.toString()) : null;
          const item = store.find((entry) => entry._id === id);

          if (item) {
            if (update && update.$set) {
              Object.assign(item, update.$set);
            }
            return Promise.resolve({ matchedCount: 1, acknowledged: true });
          }

          return Promise.resolve({ matchedCount: 0, acknowledged: true });
        }),
        deleteOne: jest.fn().mockImplementation((query) => {
          const id = query && query._id ? (query._id.toString() === '[object Object]' ? query._id.toHexString() : query._id.toString()) : null;
          const index = store.findIndex((entry) => entry._id === id);

          if (index >= 0) {
            store.splice(index, 1);
            return Promise.resolve({ deletedCount: 1 });
          }

          return Promise.resolve({ deletedCount: 0 });
        })
      })
    })
  };
});

describe('Watchlist Collection Unit Test', () => {
  describe('GET /watchlist', () => {
    it('should return 200 and an array of watchlist items', async () => {
      const res = await request(app).get('/watchlist');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /watchlist/:id', () => {
    it('should return 200 and the requested watchlist item', async () => {
      const res = await request(app).get('/watchlist/507f1f77bcf86cd799439011');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', '507f1f77bcf86cd799439011');
      expect(res.body).toHaveProperty('movieId', 'movie123');
    });

    it('should return 400 when an invalid watchlist ID format is provided', async () => {
      const res = await request(app).get('/watchlist/not-a-valid-id');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Must use a valid watchlist ID to find an item.');
    });
  });

  describe('GET /watchlist/user/:userId', () => {
    it('should return 200 and watchlist items for a valid user', async () => {
      const res = await request(app).get('/watchlist/user/user123');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('userId', 'user123');
    });

    it('should return 404 when no watchlist items are found for the requested user', async () => {
      const res = await request(app).get('/watchlist/user/unknownuser');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'No watchlist items were found for this user.');
    });
  });

  describe('POST /watchlist', () => {
    it('should return 201 and the created watchlist item', async () => {
      const mockBody = {
        userId: 'user123',
        movieId: 'movie456',
        status: 'Watching',
        priority: 'High'
      };

      const res = await request(app).post('/watchlist').send(mockBody);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('movieId', 'movie456');
    });
  });

  describe('PUT /watchlist/:id', () => {
    it('should return 200 and the updated watchlist item', async () => {
      const mockUpdate = { status: 'Watching', priority: 'High' };
      const res = await request(app).put('/watchlist/507f1f77bcf86cd799439011').send(mockUpdate);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'Watching');
    });

    it('should return 404 when no matching watchlist item exists to update', async () => {
      const mockUpdate = { status: 'Completed' };
      const res = await request(app).put('/watchlist/607f1f77bcf86cd799439011').send(mockUpdate);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Watchlist item not found.');
    });
  });

  describe('DELETE /watchlist/:id', () => {
    it('should return 204 when the watchlist item is deleted successfully', async () => {
      const res = await request(app).delete('/watchlist/507f1f77bcf86cd799439011');
      expect(res.status).toBe(204);
    });

    it('should return 404 when the target watchlist item does not exist', async () => {
      const res = await request(app).delete('/watchlist/607f1f77bcf86cd799439011');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Watchlist item not found.');
    });
  });
});

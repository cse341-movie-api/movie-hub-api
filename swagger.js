const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Movie Hub Registry & Review API',
        description: 'Comprehensive group project backend management system for movies, user accounts, reviews, and watchlists.',
    },
    host: 'movie-hub-api.onrender.com',
    schemes: ['https'],
    definitions: {
        Movie: {
            title: 'Back to the Future Part III',
            year: 1990,
            plot: 'Marty McFly travels to 1885 to rescue Doc Brown from a duel and fix the timeline.',
            genres: ['Adventure', 'Comedy', 'Sci-Fi'],
            runtime: 118,
            rated: 'PG',
            cast: ['Michael J. Fox', 'Christopher Lloyd', 'Mary Steenburgen'],
            poster: 'https://m.media-amazon.com/images/M/MV5BOGI0NDFlYjUtYjc2Ny00MTE5LTg2OTEtZjU4NzVmNGE0YTMzXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SY1000_SX677_AL_.jpg',
            languages: ['English'],
            imdb: {
                rating: 7.4
            },
            rotten_tomatoes: {
                tomato_meter: 79
            }
        },
        User: {
            googleId: '109876543210987654321',
            displayName: 'Robert Forrester',
            email: 'rforrester@example.com',
            joinedDate: '2026-06-24T20:08:49.058Z',
            role: 'user',
            location: 'Seattle, WA',
            preferences: {
                favoriteGenre: 'Sci-Fi',
                notifications: true
            }
        },
        Watchlist: {
            userId: '665f8a1b2c3d4e5f6a7b8c9d',
            movieId: '6a2202b14be80c66150f5454',
            dateAdded: '2026-06-04T15:00:00Z',
            status: 'completed',
            priority: 'low',
            reminderSet: false,
            notes: 'Movie night completely finished.'
        },
        Review: {
            userId: '665f8a1b2c3d4e5f6a7b8c9d',
            movieId: '573a1397f29313caabce8783',
            rating: 5,
            reviewText: 'An absolute classic! The storytelling is top-tier.',
            dateCreated: '2026-06-04T14:30:00Z',
            authorName: 'Jane Doe',
            isSpoiler: false
        },
    },
    securityDefinitions: {
        OAuth2HeaderKey: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'Type exactly: Bearer <YOUR_TOKEN_STRING>'
        }
    }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
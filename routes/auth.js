const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.get('/google',
    /* #swagger.tags = ['Authentication'] */
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false
    })
);

router.get('/google/callback',
    /* #swagger.tags = ['Authentication'] */
    passport.authenticate('google', {
        failureRedirect: '/auth/failure',
        session: false
    }),
    (req, res) => {
        const token = jwt.sign(
            {
                id: req.user.googleId,
                email: req.user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Authentication successful.',
            token
        });
    }
);

router.get('/failure',
    /* #swagger.tags = ['Authentication'] */
    (req, res) => {
        res.status(401).json({ message: 'Google authentication failed.' });
    }
);

module.exports = router;
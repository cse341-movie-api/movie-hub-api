const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/status' }),
    (req, res) => {
        res.redirect('/auth/status');
    }
);

router.get('/status', (req, res) => {
    res.json({
        loggedIn: req.isAuthenticated(),
        user: req.user || null
    });
});

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.json({ message: 'Logged out successfully' });
    });
});

module.exports = router;

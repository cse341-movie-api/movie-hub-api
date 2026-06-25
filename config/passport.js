const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const mongodb = require('../db/connect');
        const db = mongodb.getDb();

        const primaryEmail = profile.emails?.[0]?.value;

        if (!primaryEmail) {
            return done(new Error('Authentication failed: A primary Google email address is required to register.'), null);
        }

        let user = await db.collection('users').findOne({ googleId: profile.id });

        if (!user) {
            const newUser = {
                googleId: profile.id,
                displayName: profile.displayName,
                email: primaryEmail,
                joinedDate: new Date(),
                role: "user",
                location: "not specified",
                preferences: {
                    favoriteGenre: "none",
                    notifications: true
                }
            };

            await db.collection('users').insertOne(newUser);
            user = newUser;
        }

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));
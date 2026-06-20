const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    const userProfile = {
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails?.[0]?.value
    };

    return done(null, userProfile);
}));

module.exports = passport;
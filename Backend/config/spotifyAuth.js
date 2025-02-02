const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const User = require('../models/User'); // Make sure this path is correct

passport.use(
    new SpotifyStrategy(
        {
            clientID: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            callbackURL: process.env.SPOTIFY_REDIRECT_URI, // Ensure this matches your redirect URI
        },
        async (accessToken, refreshToken, expires_in, profile, done) => {
            try {
                let user = await User.findOne({ spotifyId: profile.id });

                if (!user) {
                    user = new User({
                        spotifyId: profile.id,
                        displayName: profile.displayName,
                        email: profile.emails ? profile.emails[0].value : null,
                        profileImage: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
                        accessToken,  // Add this
                        refreshToken  // Add this
                    });
                } else {
                    // Update tokens for existing user
                    user.accessToken = accessToken;
                    user.refreshToken = refreshToken;
                }

                await user.save();
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});
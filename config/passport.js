const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, next) => {
        const newUser = new User({
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.giveName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        });
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            next(null, user);
          } else {
            user = await User.create(newUser);
            next(null, user);
          }
        } catch (error) {
          console.error(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id); // Store the user ID in the session
  });

  // Deserialize user
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user) => {
        done(null, user); // If user is found, pass it to done
      })
      .catch((err) => {
        done(err, null); // Pass any error to done
      });
  });
};

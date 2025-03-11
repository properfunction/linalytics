const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' }, // Assuming the login uses the 'email' field
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email }); // Find user by email
          if (!user) {
            return done(null, false, { message: 'No user found with that email' });
          }

          // Use the async comparePassword method
          const isMatch = await user.comparePassword(password);

          if (!isMatch) {
            return done(null, false, { message: 'Incorrect password' });
          }

          return done(null, user); // Successful login
        } catch (err) {
          console.error(err);
          return done(err); // Pass error to passport middleware
        }
      }
    )
  );
  
  passport.serializeUser((user, done) => {
    done(null, user.id); // Save the user id into the session
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
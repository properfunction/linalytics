const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

module.exports = function (passport) {
    passport.use(
      new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
        User.findOne({ email: email.toLowerCase() }, (err, user) => {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, { msg: `Email ${email} not found.` });
          }
          if (!user.password) {
            return done(null, false, {
              msg:
                "Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.",
            });
          }
          user.comparePassword(password, (err, isMatch) => {
            if (err) {
              return done(err);
            }
            if (isMatch) {
              return done(null, user);
            }
            return done(null, false, { msg: "Invalid email or password." });
          });
        });
      })
    );
  
    // passport.serializeUser((user, done) => {
    //   done(null, user.id); // Store the user's ID in the session
    // });
  
    // passport.deserializeUser((id, done) => {
    //   User.findById(id, (err, user) => done(err, user)); // Retrieve the user from the database based on the session ID
    // });
    
    passport.serializeUser((user, done) => {
      done(null, user.id); // Store the user's ID in the session
    });
    
    passport.deserializeUser(async (id, done) => {
      try {
        const user = await User.findById(id); // Retrieve the user from the database asynchronously
    
        if (!user) {
          return done(new Error("User not found"));
        }
    
        done(null, user); // Pass the user object to the done callback
      } catch (err) {
        done(err); // Handle any errors during the database query
      }
    });
  };
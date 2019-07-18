const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const bcrypt = require("bcryptjs");
const keys = require("./keys");
const User = require("../models/user-model");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      //options for the google strategy
      callbackURL: "/auth/google/redirect",
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret
    },
    (accessToken, refreshToken, profile, done) => {
      //passport callback fucntion
      User.findOne({ googleId: profile.id }).then(currentUser => {
        if (currentUser) {
          // already have the user
          console.log("user is: ", currentUser);
          done(null, currentUser);
        } else {
          // if not create user in our db
          var newUser = new User();
          newUser.google.username = profile.displayName;
          newUser.google.googleId = profile.id;
          newUser.google.thumbnail = profile._json.picture;
          newUser.save().then(newUser => {
            console.log("new user created" + newUser);
            done(null, newUser);
          });
        }
      });
    }
  )
);

// local strategy
var LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    // Match user
    User.findOne({ email: email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: "That email is not registered" });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password incorrect" });
          }
        });
      })
      .catch(err => console.log(err));
  })
);

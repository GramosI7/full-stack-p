const router = require("express").Router();
const passport = require("passport");
const User = require("../models/user-model");
const bcrypt = require("bcryptjs");

// auth login
router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});
// get render login local
router.get("/login/local", (req, res) => {
  res.render("login-local", { user: req.user });
});

router.get("/register", (req, res) => {
  res.render("register", { user: req.user });
});

// // auth login local
// router.post("/login/local", passport.authenticate("local"), function(req, res) {
//   res.redirect("/profile");
// });

// Login
router.post("/login/local", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/auth/login/local",
    failureFlash: true
  })(req, res, next);
});

// register
router.post("/register", (req, res) => {
  const { username, email, password, password2 } = req.body;
  let errors = [];

  // Check required fields
  if (!username || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  if (password !== password2) {
    errors.push({ msg: "Password do not match" });
  }

  if (errors.length > 0) {
    res.render("register", {
      user: req.user,
      errors,
      username,
      email,
      password,
      password2
    });
  } else {
    // Validation passed
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: "Email is already register !" });
        res.render("register", {
          user: req.user,
          errors,
          username,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          username,
          email,
          password
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // set password to hash
            newUser.password = hash;
            // save user
            console.log(newUser);

            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/auth/login/local");
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// auth logout
router.get("/logout", (req, res) => {
  // handle with passport
  req.logout();
  res.redirect("/");
});

// auth with google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"]
  })
);

// callback route for google to redirect to
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  // res.send(req.user);
  res.redirect("/profile");
});

module.exports = router;

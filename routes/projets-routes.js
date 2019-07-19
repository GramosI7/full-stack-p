const router = require("express").Router();
const { ensureAuthenticated } = require("../config/auth");
const Project = require("../models/project-model");

router.get("/", ensureAuthenticated, (req, res) => {
  Project.find().then((projects, err) => {
    if (err) console.log(err);
    res.render("projects", { user: req.user, projects });
  });
});

router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("add-project", { user: req.user });
});

router.post("/add", ensureAuthenticated, (req, res) => {
  const { title, description } = req.body;
  let errors = [];

  if (!title || !description) {
    errors.push({ msg: "Please fill in all fields" });
  }
  if (errors.length > 0) {
    res.render("add-project", {
      user: req.user,
      errors,
      title,
      description
    });
  }
  new Project({
    user: req.user.id,
    title: title,
    description: description
  })
    .save()
    .then(project => {
      req.flash("success_msg", "You save an project");
      res.redirect("/project");
    })
    .catch(err => console.log(err));
});

router.get("/:id", ensureAuthenticated, (req, res) => {
  Project.findOne({ _id: req.params.id })
    .populate("user", [])
    .then((project, err) => {
      if (err) console.log(err);
      console.log(project);
      res.render("project", { user: req.user, project });
    });
});

module.exports = router;

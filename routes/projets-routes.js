const router = require("express").Router();
const { ensureAuthenticated } = require("../config/auth");
const Project = require("../models/project-model");

// find all project
router.get("/", ensureAuthenticated, (req, res) => {
  Project.find().then((projects, err) => {
    if (err) console.log(err);
    res.render("projects", { user: req.user, projects });
  });
});

// get add page
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("add-project", { user: req.user });
});

// add project
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

// get project by id
router.get("/:id", ensureAuthenticated, (req, res) => {
  Project.findOne({ _id: req.params.id })
    .populate("user", ["username", "google"])
    .then((project, err) => {
      if (err) console.log(err);
      console.log(project);
      res.render("project", { user: req.user, project });
    });
});

// get modify project
router.get("/:id/modify", ensureAuthenticated, (req, res) => {
  Project.findOne({ _id: req.params.id })
    .populate("user", ["username", "google"])
    .then((project, err) => {
      if (err) console.log(err);
      // console.log(project);
      res.render("modify-project", { user: req.user, project });
    });
});

// post modify project
router.post("/:id/modify", ensureAuthenticated, (req, res) => {
  Project.findOneAndUpdate({ _id: req.params.id }, { $set: req.body })
    .then(project => {
      req.flash("success_msg", "You modify an project");
      res.redirect("/project/" + project.id);
    })
    .catch(err => console.log(err));
});

// delete project
router.get("/:id/delete", ensureAuthenticated, (req, res) => {
  Project.findOneAndRemove({ _id: req.params.id }).then((project, err) => {
    if (err) next(err);
    req.flash("success_msg", "You delete an project " + project.title);
    res.redirect("/project");
  });
});

module.exports = router;

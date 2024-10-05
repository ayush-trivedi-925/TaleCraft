const express = require("express");
const router = express.Router();

const { isLoggedIn, ensureGuest } = require("../middlewares/auth");
const Story = require("../models/Story");

// @Desc: Logging/Landing Page
// @Route: GET /
router.get("/", ensureGuest, (req, res) => {
  res.render("login");
});

// @Desc: Dashboard Page
// @Route: GET /dashboard
router.get("/dashboard", isLoggedIn, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean();
    res.render("dashboard", { name: req.user.displayName, stories });
  } catch (error) {
    console.log(err);
    res.render("errors/500");
  }
});

module.exports = router;

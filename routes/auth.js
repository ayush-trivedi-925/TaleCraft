const express = require("express");
const passport = require("passport");
const router = express.Router();

// @Desc: Auth with Google
// @Route: GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// @Desc: Google auth callback
// @Route: GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// @Desc: Logout
// @Route: GET /auth/logout
router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;

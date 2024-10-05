const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middlewares/auth");
const Story = require("../models/Story");
const User = require("../models/User");

// @Desc: Stories index
// @Route: GET /stories
router.get("/", isLoggedIn, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    console.log(stories);
    res.render("stories/index", { stories, user: req.user });
  } catch (error) {
    console.error(error); // Log the error stack
    res.render("errors/500"); // Render the error view
  }
});

router.get("/:id", isLoggedIn, async (req, res) => {
  const story = await Story.findById(req.params.id).populate("user");
  if (!story) {
    return res.render("errors/404");
  } else {
    res.render("stories/show", { story, user: req.user });
  }
});

// @Desc: Add story page
// @Route: GET /stories/add
router.get("/add", isLoggedIn, (req, res) => {
  res.render("stories/add");
});

// @Desc: Adds story
// @Route: POST /stories
router.post("/", isLoggedIn, async (req, res) => {
  try {
    const { title, status, body } = req.body;

    const newStory = new Story({
      title: title,
      status: status,
      body: body,
    });
    newStory.user = req.user._id;
    await newStory.save();
    console.log(newStory);
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.render("errors/500");
  }
});

// @Desc: Edit story form
// @Route: GET /stories/edit/:id

router.get("/edit/:id", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id);
    if (!story) {
      return res.render("error/404");
    }
    if (!story.user._id.equals(req.user._id)) {
      res.redirect("/stories");
    } else {
      res.render("stories/edit", { story });
    }
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

// @Desc: Update Story
// @Route: PUT /stories/:id
router.put("/:id", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    let story = await Story.findById(id);
    if (!story) {
      return res.render("error/404");
    }
    if (!story.user._id.equals(req.user._id)) {
      res.redirect("/stories");
    } else {
      story = await Story.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      res.redirect("/stories");
    }
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

// @Desc: Delete Story
// @Route: DELETE /stories/:id
router.delete("/:id", isLoggedIn, async (req, res) => {
  try {
    await Story.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

// @Desc: User stories
// @Routes: GET /stories/users/:userId
router.get("/user/:userId", async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: "public",
    }).populate("user");
    if (stories.length === 0) {
      return res.render("errors/404");
    } else {
      res.render("stories/index", { stories, user: req.user });
    }
  } catch (error) {
    console.error(error);
    res.render("errors/404");
  }
});

module.exports = router;

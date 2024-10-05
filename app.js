const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const dotenv = require("dotenv");

const morgan = require("morgan");

const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const methodOverride = require("method-override");

const path = require("path");

const ejs = require("ejs");
const ejsMate = require("ejs-mate");

// env config
dotenv.config({ path: "./config/config.env" });

// Passport config
require("./config/passport")(passport);

connectDB();

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

const app = express();

// Body Parser
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

// Logging
app.use(morgan("dev"));

// Session config
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL, // Use your MongoDB connection string here
      // Other options can be added here, such as collection name
    }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// ejs Helpers
const { formatDate, stripTags, truncate, editIcon } = require("./helpers/ejs");

// ejs
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Make the formatDate helper available to all EJS templates
app.locals.formatDate = formatDate;
app.locals.stripTags = stripTags;
app.locals.truncate = truncate;
app.locals.editIcon = editIcon;

// Setting up public directory | Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

app.listen(PORT, console.log("Listening on port: 3000"));

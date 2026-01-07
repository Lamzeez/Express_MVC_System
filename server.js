const path = require("path");
const express = require("express");
const methodOverride = require("method-override");
const session = require("express-session");
require("dotenv").config();

const sessionStore = require("./src/config/sessionStore");
const authRoutes = require("./src/routes/auth.routes");
const notesRoutes = require("./src/routes/notes.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "src", "public")));

// Sessions
app.use(
  session({
    key: "notecore.sid",
    secret: process.env.SESSION_SECRET || "dev_secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 6 // 6 hours
    }
  })
);

// Make user available in views
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

// Routes
app.get("/", (req, res) => {
  if (req.session.user) return res.redirect("/notes");
  return res.redirect("/auth/login");
});

app.use("/auth", authRoutes);
app.use("/notes", notesRoutes);

// 404
app.use((req, res) => res.status(404).send("404 - Page not found"));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("500 - Server error");
});

app.listen(PORT, () => {
  console.log(`NoteCore running at http://localhost:${PORT}`);
});

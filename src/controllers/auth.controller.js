const bcrypt = require("bcrypt");
const UserModel = require("../models/user.model");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.loginForm = (req, res) => {
  res.render("auth/login", { error: null, values: { email: "" } });
};

exports.registerForm = (req, res) => {
  res.render("auth/register", { error: null, values: { name: "", email: "" } });
};

exports.login = async (req, res, next) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";

    if (!EMAIL_RE.test(email) || password.length < 6) {
      return res.status(400).render("auth/login", {
        error: "Invalid email or password.",
        values: { email }
      });
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(400).render("auth/login", {
        error: "Invalid email or password.",
        values: { email }
      });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(400).render("auth/login", {
        error: "Invalid email or password.",
        values: { email }
      });
    }

    req.session.user = { id: user.id, name: user.name, email: user.email };
    res.redirect("/notes");
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const name = (req.body.name || "").trim();
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";
    const confirm = req.body.confirm_password || "";

    if (name.length < 2) {
      return res.status(400).render("auth/register", {
        error: "Name must be at least 2 characters.",
        values: { name, email }
      });
    }

    if (!EMAIL_RE.test(email)) {
      return res.status(400).render("auth/register", {
        error: "Please enter a valid email.",
        values: { name, email }
      });
    }

    if (password.length < 6) {
      return res.status(400).render("auth/register", {
        error: "Password must be at least 6 characters.",
        values: { name, email }
      });
    }

    if (password !== confirm) {
      return res.status(400).render("auth/register", {
        error: "Passwords do not match.",
        values: { name, email }
      });
    }

    const existing = await UserModel.findByEmail(email);
    if (existing) {
      return res.status(400).render("auth/register", {
        error: "Email is already registered.",
        values: { name, email }
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const created = await UserModel.create({ name, email, passwordHash });

    req.session.user = created; // auto-login after register
    res.redirect("/notes");
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("notecore.sid");
    res.redirect("/auth/login");
  });
};

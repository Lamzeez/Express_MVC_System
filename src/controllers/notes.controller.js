const NoteModel = require("../models/note.model");

function validateContent(content) {
  if (!content || !content.trim()) return "Content is required.";
  if (content.trim().length > 5000) return "Content is too long (max 5000 chars).";
  return null;
}

exports.index = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const notes = await NoteModel.getAllByUser(userId);
    res.render("notes/index", { notes, error: null });
  } catch (err) {
    next(err);
  }
};

exports.show = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const note = await NoteModel.getById(req.params.id, userId);
    if (!note) return res.status(404).send("Note not found");
    res.render("notes/show", { note });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const { title, content } = req.body;

    const errMsg = validateContent(content);
    if (errMsg) {
      const notes = await NoteModel.getAllByUser(userId);
      return res.status(400).render("notes/index", { notes, error: errMsg });
    }

    await NoteModel.create(userId, { title, content });
    res.redirect("/notes");
  } catch (err) {
    next(err);
  }
};

exports.editForm = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const note = await NoteModel.getById(req.params.id, userId);
    if (!note) return res.status(404).send("Note not found");
    res.render("notes/edit", { note, error: null });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const { title, content } = req.body;

    const errMsg = validateContent(content);
    if (errMsg) {
      const note = await NoteModel.getById(req.params.id, userId);
      if (!note) return res.status(404).send("Note not found");
      return res.status(400).render("notes/edit", {
        note: { ...note, title, content },
        error: errMsg
      });
    }

    const ok = await NoteModel.update(req.params.id, userId, { title, content });
    if (!ok) return res.status(404).send("Note not found");

    res.redirect(`/notes/${req.params.id}`);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const ok = await NoteModel.remove(req.params.id, userId);
    if (!ok) return res.status(404).send("Note not found");
    res.redirect("/notes");
  } catch (err) {
    next(err);
  }
};

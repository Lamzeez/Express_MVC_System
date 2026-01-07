const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const notes = require("../controllers/notes.controller");

router.use(auth);

router.get("/", notes.index);
router.post("/", notes.create);

router.get("/:id", notes.show);

router.get("/:id/edit", notes.editForm);
router.put("/:id", notes.update);

router.delete("/:id", notes.remove);

module.exports = router;

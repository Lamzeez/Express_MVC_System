const pool = require("../config/db");

class NoteModel {
  static async getAllByUser(userId) {
    const [rows] = await pool.execute(
      "SELECT id, user_id, title, content, created_at, updated_at FROM notes WHERE user_id = ? ORDER BY updated_at DESC",
      [userId]
    );
    return rows;
  }

  static async getById(noteId, userId) {
    const [rows] = await pool.execute(
      "SELECT id, user_id, title, content, created_at, updated_at FROM notes WHERE id = ? AND user_id = ? LIMIT 1",
      [noteId, userId]
    );
    return rows[0] || null;
  }

  static async create(userId, { title, content }) {
    const t = (title || "Untitled").trim() || "Untitled";
    const c = (content || "").trim();

    const [result] = await pool.execute(
      "INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)",
      [userId, t, c]
    );
    return result.insertId;
  }

  static async update(noteId, userId, { title, content }) {
    const t = (title || "Untitled").trim() || "Untitled";
    const c = (content || "").trim();

    const [result] = await pool.execute(
      "UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?",
      [t, c, noteId, userId]
    );

    return result.affectedRows > 0;
  }

  static async remove(noteId, userId) {
    const [result] = await pool.execute(
      "DELETE FROM notes WHERE id = ? AND user_id = ?",
      [noteId, userId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = NoteModel;

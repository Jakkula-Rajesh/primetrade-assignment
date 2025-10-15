const { openDb, run, all } = require('../utils/db');

async function createTask({ user_id, title, description, status = 'pending' }) {
  const db = openDb();
  const res = await run(db, `INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)`, [user_id, title, description, status]);
  const id = res.lastID;
  db.close();
  return { id, user_id, title, description, status };
}

async function getTasksByUser(user_id, { search, status } = {}) {
  const db = openDb();
  let sql = `SELECT * FROM tasks WHERE user_id = ?`;
  const params = [user_id];
  if (status) { sql += ` AND status = ?`; params.push(status); }
  if (search) { sql += ` AND (title LIKE ? OR description LIKE ?)`; params.push(`%${search}%`, `%${search}%`); }
  const rows = await all(db, sql, params);
  db.close();
  return rows;
}

async function getTaskById(id) {
  const db = openDb();
  const rows = await all(db, `SELECT * FROM tasks WHERE id = ?`, [id]);
  db.close();
  return rows[0];
}

async function updateTask(id, fields = {}) {
  const db = openDb();
  const set = [];
  const params = [];
  Object.keys(fields).forEach(k => { set.push(`${k} = ?`); params.push(fields[k]); });
  params.push(id);
  const sql = `UPDATE tasks SET ${set.join(', ')} WHERE id = ?`;
  await run(db, sql, params);
  const updated = await getTaskById(id);
  db.close();
  return updated;
}

async function deleteTask(id) {
  const db = openDb();
  await run(db, `DELETE FROM tasks WHERE id = ?`, [id]);
  db.close();
  return true;
}

module.exports = { createTask, getTasksByUser, getTaskById, updateTask, deleteTask };

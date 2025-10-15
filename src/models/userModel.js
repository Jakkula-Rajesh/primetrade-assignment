const { openDb, run, all } = require('../utils/db');

async function createUser({ name, email, password }) {
  const db = openDb();
  const res = await run(db, `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [name, email, password]);
  const id = res.lastID;
  db.close();
  return { id, name, email };
}

async function findUserByEmail(email) {
  const db = openDb();
  const rows = await all(db, `SELECT * FROM users WHERE email = ?`, [email]);
  db.close();
  return rows[0];
}

async function findUserById(id) {
  const db = openDb();
  const rows = await all(db, `SELECT id, name, email, created_at FROM users WHERE id = ?`, [id]);
  db.close();
  return rows[0];
}

module.exports = { createUser, findUserByEmail, findUserById };

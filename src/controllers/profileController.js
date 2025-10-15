const { findUserById } = require('../models/userModel');

async function getProfile(req, res) {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'unauthorized' });
  const user = await findUserById(userId);
  res.json({ user });
}

// for simplicity, only name can be updated here
async function updateProfile(req, res) {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'unauthorized' });
  const { name } = req.body;
  // quick and simple update using raw SQL - keep small for assignment
  const db = require('../utils/db').openDb();
  db.run(`UPDATE users SET name = ? WHERE id = ?`, [name, userId], function (err) {
    db.close();
    if (err) return res.status(500).json({ error: 'update failed' });
    res.json({ ok: true, name });
  });
}

module.exports = { getProfile, updateProfile };

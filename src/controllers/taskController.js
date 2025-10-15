const { createTask, getTasksByUser, getTaskById, updateTask, deleteTask } = require('../models/taskModel');

async function create(req, res) {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'unauthorized' });
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  const task = await createTask({ user_id: userId, title, description });
  res.json({ task });
}

async function list(req, res) {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'unauthorized' });
  const { search, status } = req.query;
  const tasks = await getTasksByUser(userId, { search, status });
  res.json({ tasks });
}

async function getOne(req, res) {
  const userId = req.user && req.user.id;
  const task = await getTaskById(req.params.id);
  if (!task || task.user_id !== userId) return res.status(404).json({ error: 'not found' });
  res.json({ task });
}

async function update(req, res) {
  const userId = req.user && req.user.id;
  const task = await getTaskById(req.params.id);
  if (!task || task.user_id !== userId) return res.status(404).json({ error: 'not found' });
  const updated = await updateTask(req.params.id, req.body);
  res.json({ task: updated });
}

async function remove(req, res) {
  const userId = req.user && req.user.id;
  const task = await getTaskById(req.params.id);
  if (!task || task.user_id !== userId) return res.status(404).json({ error: 'not found' });
  await deleteTask(req.params.id);
  res.json({ ok: true });
}

module.exports = { create, list, getOne, update, remove };

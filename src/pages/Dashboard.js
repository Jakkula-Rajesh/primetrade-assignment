import React, { useEffect, useState } from 'react';
import { getProfile, logout, updateProfile } from '../services/authService';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import Notification from '../components/Notification';
import '../App.css';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [profileName, setProfileName] = useState('');
  const nav = useNavigate();

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      setLoading(true);
      const p = await getProfile();
      setProfile(p);
      setProfileName(p?.name || '');
      const t = await API.get('/tasks');
      setTasks(t.data.tasks || []);
    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: 'Failed to load data' });
    } finally { setLoading(false); }
  }

  async function add() {
    if (!title) { setMessage({ type: 'error', text: 'Title required' }); return; }
    try {
      setLoading(true);
      await API.post('/tasks', { title });
      setTitle('');
      setMessage({ type: 'success', text: 'Task added' });
      await load();
    } catch (e) {
      setMessage({ type: 'error', text: 'Add failed' });
    } finally { setLoading(false); }
  }

  async function doSearch() {
    try {
      setLoading(true);
      const res = await API.get('/tasks', { params: { search } });
      setTasks(res.data.tasks || []);
    } catch (e) {
      setMessage({ type: 'error', text: 'Search failed' });
    } finally { setLoading(false); }
  }

  async function removeTask(id) {
    if (!window.confirm('Delete this task?')) return;
    try {
      setLoading(true);
      await API.delete(`/tasks/${id}`);
      setMessage({ type: 'success', text: 'Task deleted' });
      await load();
    } catch (e) {
      setMessage({ type: 'error', text: 'Delete failed' });
    } finally { setLoading(false); }
  }

  async function toggleStatus(task) {
    const newStatus = task.status === 'done' ? 'pending' : 'done';
    try {
      setLoading(true);
      await API.put(`/tasks/${task.id}`, { status: newStatus });
      setMessage({ type: 'success', text: 'Status updated' });
      await load();
    } catch (e) {
      setMessage({ type: 'error', text: 'Update failed' });
    } finally { setLoading(false); }
  }

  function startEdit(task) {
    setEditingTask({ ...task });
  }

  async function saveEdit() {
    if (!editingTask) return;
    try {
      setLoading(true);
      await API.put(`/tasks/${editingTask.id}`, { title: editingTask.title, description: editingTask.description });
      setMessage({ type: 'success', text: 'Task updated' });
      setEditingTask(null);
      await load();
    } catch (e) {
      setMessage({ type: 'error', text: 'Save failed' });
    } finally { setLoading(false); }
  }

  async function saveProfile() {
    try {
      setLoading(true);
      await updateProfile({ name: profileName });
      setMessage({ type: 'success', text: 'Profile updated' });
      await load();
    } catch (e) {
      setMessage({ type: 'error', text: 'Profile update failed' });
    } finally { setLoading(false); }
  }

  function handleLogout() {
    logout();
    nav('/login');
  }

  return (
    <div className="container">
      <header className="header">
        <div>
          <h2>Dashboard</h2>
          {profile && <div className="muted">{profile.name} • {profile.email}</div>}
        </div>
        <div>
          <button onClick={handleLogout} className="btn">Logout</button>
        </div>
      </header>

      {message && <Notification type={message.type} text={message.text} onClose={() => setMessage(null)} />}

      <section className="card">
        <h3>Profile</h3>
        <div>
          <input value={profileName} onChange={e => setProfileName(e.target.value)} />
          <button onClick={saveProfile} className="btn">Save</button>
        </div>
      </section>

      <section className="card">
        <h3>Tasks</h3>
        <div className="row">
          <input placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
          <button onClick={doSearch} className="btn">Search</button>
        </div>
        <div className="row" style={{ marginTop: 10 }}>
          <input placeholder="New task title" value={title} onChange={e => setTitle(e.target.value)} />
          <button onClick={add} className="btn">Add</button>
        </div>

        {loading ? <div>Loading...</div> : (
          <ul className="task-list">
            {tasks.map(t => (
              <li key={t.id} className="task-item">
                <div>
                  <strong>{t.title}</strong> <small className="muted">{t.status}</small>
                  <div className="task-actions">
                    <button onClick={() => toggleStatus(t)} className="btn small">Toggle</button>
                    <button onClick={() => startEdit(t)} className="btn small">Edit</button>
                    <button onClick={() => removeTask(t.id)} className="btn small danger">Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {editingTask && (
          <div className="modal">
            <div className="modal-content">
              <h4>Edit Task</h4>
              <input value={editingTask.title} onChange={e => setEditingTask({ ...editingTask, title: e.target.value })} />
              <textarea value={editingTask.description || ''} onChange={e => setEditingTask({ ...editingTask, description: e.target.value })} />
              <div style={{ marginTop: 8 }}>
                <button onClick={saveEdit} className="btn">Save</button>
                <button onClick={() => setEditingTask(null)} className="btn">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { getProfile, logout } from '../services/authService';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [search, setSearch] = useState('');
  const nav = useNavigate();

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const p = await getProfile();
      setProfile(p);
      const t = await API.get('/tasks');
      setTasks(t.data.tasks || []);
    } catch (e) {
      console.error(e);
    }
  }

  async function add() {
    if (!title) return;
    await API.post('/tasks', { title });
    setTitle('');
    load();
  }

  async function doSearch() {
    const res = await API.get('/tasks', { params: { search } });
    setTasks(res.data.tasks || []);
  }

  function handleLogout() {
    logout();
    nav('/login');
  }

  return (
    <div style={{ maxWidth: 900, margin: '1rem auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2>Dashboard</h2>
          {profile && <div>{profile.name} • {profile.email}</div>}
        </div>
        <div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <section style={{ marginTop: 20 }}>
        <h3>Tasks</h3>
        <div>
          <input placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
          <button onClick={doSearch}>Search</button>
        </div>
        <div style={{ marginTop: 10 }}>
          <input placeholder="New task title" value={title} onChange={e => setTitle(e.target.value)} />
          <button onClick={add}>Add</button>
        </div>

        <ul>
          {tasks.map(t => (
            <li key={t.id}>{t.title} <small>({t.status})</small></li>
          ))}
        </ul>
      </section>
    </div>
  );
}

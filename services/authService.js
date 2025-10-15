import API from './api';

export async function login(email, password) {
  const res = await API.post('/auth/login', { email, password });
  if (res.data.token) localStorage.setItem('token', res.data.token);
  return res.data;
}

export async function register(name, email, password) {
  const res = await API.post('/auth/register', { name, email, password });
  if (res.data.token) localStorage.setItem('token', res.data.token);
  return res.data;
}

export function logout() {
  localStorage.removeItem('token');
}

export async function getProfile() {
  const res = await API.get('/profile');
  return res.data.user;
}

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDb } = require('./utils/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// initialize DB and create tables
initDb().then(() => console.log('Database initialized'))
  .catch(err => console.error('DB init error', err));

// routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

app.get('/', (req, res) => res.json({ ok: true, message: 'Primetrade assignment backend' }));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

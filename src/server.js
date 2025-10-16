// import dotenv from 'dotenv';
// dotenv.config();

import express from 'express';

import cors from 'cors';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import db from './db3.js';

const app = express();
const PORT = 5000;

app.use(cors());

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

/* ===========================
   📘 Get all blogs
=========================== */
app.get('/blogs', (req, res) => {
  db.query('SELECT * FROM blogs ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

/* ===========================
   📗 Get a single blog by ID
=========================== */
app.get('/blogs/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM blogs WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0)
      return res.status(404).json({ message: 'Blog not found' });
    res.json(result[0]);
  });
});

/* ===========================
   🟢 Create a new blog
=========================== */
app.post('/blogs', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content)
    return res.status(400).json({ message: 'Title and content required' });

  db.query(
    'INSERT INTO blogs (title, content) VALUES (?, ?)',
    [title, content],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id: result.insertId,
        title,
        content,
        message: 'Blog created successfully',
      });
    }
  );
});

/* ===========================
   ✏️ Update a blog
=========================== */
app.put('/blogs/:id', (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  db.query(
    'UPDATE blogs SET title=?, content=? WHERE id=?',
    [title, content, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Blog updated successfully' });
    }
  );
});

/* ===========================
   ❌ Delete a blog
=========================== */
app.delete('/blogs/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM blogs WHERE id=?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Blog deleted successfully' });
  });
});

/* ===========================
   🚀 Start server
=========================== */
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);

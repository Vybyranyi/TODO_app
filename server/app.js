import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import sequelize from './config/db.js';
import db from './models/index.js';
const { User } = db;

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'todo_test';

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Tables are synchronized with the database');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error synchronizing the database:', err);
  });

// User registration endpoint
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ email, password, role: 'user' });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User created',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// Middleware (authenticate)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: admin only' });
  }
  next();
};

// Task endpoints
app.get('/tasks', authenticateToken, async (req, res) => {
  const tasks = await db.Task.findAll({ where: { userId: req.user.userId } });
  res.json(tasks);
});

app.post('/task', authenticateToken, async (req, res) => {
  const { title, description, status } = req.body;
  const task = await db.Task.create({
    userId: req.user.userId,
    title,
    description,
    status,
  });
  res.status(201).json(task);
});


app.put('/task/:id', authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, status } = req.body;

    const task = await db.Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden: You cannot edit this task' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/task/:id', authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await db.Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden: You cannot delete this task' });
    }

    await task.destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin dashboard endpoint
app.get('/admin/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: ['id', 'email', 'role']
    });

    const tasks = await db.Task.findAll();

    res.json({ users, tasks });
  } catch (err) {
    console.error('Error in admin dashboard:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/admin/user/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    if (parseInt(userId) === req.user.userId) {
      return res.status(400).json({ message: 'Admins cannot delete themselves' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await db.Task.destroy({ where: { userId } });

    await user.destroy();

    res.json({ message: 'User and their tasks deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

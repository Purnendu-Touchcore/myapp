const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection (only connect if not already connected and not in test mode)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/todoapp';
if (process.env.NODE_ENV !== 'test' && mongoose.connection.readyState === 0) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// Routes
const todoRoutes = require('./routes/todos');
app.use('/api/todos', todoRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Start server (only if not in test environment)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
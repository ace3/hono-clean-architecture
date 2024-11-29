const { Hono } = require('hono');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const { authenticateRequest } = require('./middlewares/authMiddleware');

const app = new Hono();


app.route('/api/auth', authRoutes); // Register user routes
app.use('/api/users/*', authenticateRequest); // Apply middleware to all user routes
app.route('/api/users', userRoutes); // Register user routes

module.exports = app;

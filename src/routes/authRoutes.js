
const { Hono } = require('hono');
const authRoutes = new Hono();
const authService = require('../services/authService');


authRoutes.post('/login', async (ctx) => {
  const { email, password } = await ctx.req.json();
  const token = await authService.authenticateUser(email, password);
    return ctx.json({token})

})

module.exports = authRoutes
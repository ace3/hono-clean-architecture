
const { Hono } = require('hono');
const userService = require('../services/userService');
const userRoutes = new Hono();

userRoutes.get('/', async (ctx) => {
   const users = await userService.getAllUsers();
  return ctx.json(users);
});

module.exports = userRoutes;


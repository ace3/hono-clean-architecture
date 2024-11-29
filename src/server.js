const app = require('./app');

const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 3000;

export default {  
  port: PORT, 
  fetch: app.fetch, 
} 
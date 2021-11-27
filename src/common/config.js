const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  PORT: process.env.PORT ? process.env.PORT : 5000,
  DEBUG: process.env.debug ? true : false,
};

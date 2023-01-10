import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: +(process.env.PORT ?? 5000),
  DEBUG: !!process.env.debug,
};

export default config;

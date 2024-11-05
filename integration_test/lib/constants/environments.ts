import { config } from 'dotenv';
config();
const environments = {
  baseUrl: process.env.HOST_URL || 'http://localhost:3000',
  ci: process.env.CI,
};

export default environments;

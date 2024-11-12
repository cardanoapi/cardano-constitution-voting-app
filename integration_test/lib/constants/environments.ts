import { config } from 'dotenv';
config();
const environments = {
  baseUrl: process.env.HOST_URL || 'http://localhost:3000',
  kuber: {
    apiUrl:
      process.env.KUBER_API_URL || 'https://sanchonet.kuber.cardanoapi.io',
    apiKey: process.env.KUBER_API_KEY || '',
  },
  networkId: process.env.NETWORK_ID || 0,
  ci: process.env.CI,
};

export default environments;

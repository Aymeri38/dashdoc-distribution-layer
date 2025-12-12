import dotenv from 'dotenv';

dotenv.config();

const getConfig = () => {
  return {
    PORT: process.env.PORT,
    DASHDOC_API_KEY: process.env.DASHDOC_API_KEY,
    DASHDOC_API_URL: process.env.DASHDOC_API_URL,
  };
};

const config = getConfig();

// Valide que les variables essentielles sont chargées
if (!config.DASHDOC_API_KEY || !config.DASHDOC_API_URL) {
  throw new Error('Missing critical environment variables for Dashdoc integration.');
}

export default config;
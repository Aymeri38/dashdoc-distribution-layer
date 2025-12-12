import app from './app';
import config from './config/config';
import { testConnection } from './services/dashdoc/dashdocClient';

const PORT = config.PORT || 3001;

app.listen(PORT, async () => {
  // eslint-disable-next-line no-console
  console.log(`[server]: Server is running at http://localhost:${PORT}`);

  // On teste la connexion à l'API Dashdoc au démarrage
  await testConnection();
});
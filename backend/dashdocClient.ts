import axios, { AxiosInstance } from 'axios';
import config from '../../config/config';

/**
 * Instance Axios pré-configurée pour l'API Dashdoc.
 * Elle inclut l'URL de base et l'en-tête d'autorisation.
 */
const dashdocApiClient: AxiosInstance = axios.create({
  baseURL: config.DASHDOC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${config.DASHDOC_API_KEY}`,
  },
});

/**
 * Teste la connexion à l'API Dashdoc en effectuant un appel simple.
 * @returns {Promise<boolean>} True si la connexion est réussie, false sinon.
 */
export const testConnection = async (): Promise<boolean> => {
  try {
    // Nous appelons un endpoint qui nécessite une authentification mais a peu d'impact.
    // La récupération des transports avec une limite de 1 est un bon candidat.
    const response = await dashdocApiClient.get('/transports', {
      params: { per_page: 1 },
    });

    if (response.status === 200) {
      console.log('[Dashdoc] API connection successful.');
      return true;
    }
    return false;
  } catch (error) {
    console.error('[Dashdoc] API connection failed.');
    if (axios.isAxiosError(error)) {
      console.error('Error details:', error.response?.data || error.message);
    }
    return false;
  }
};

export default dashdocApiClient;
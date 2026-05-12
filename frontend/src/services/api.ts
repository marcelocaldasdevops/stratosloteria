import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Lottery Results API (External)
const CAIXA_API = "https://loteriascaixa-api.herokuapp.com/api";

export const getLatestResult = async (modality: string) => {
  const response = await axios.get(`${CAIXA_API}/${modality}/latest`);
  return response.data;
};

export const getHistory = async (modality: string) => {
  const response = await axios.get(`${CAIXA_API}/${modality}`);
  return response.data;
};

// Internal Backend API
export const saveGame = async (game: { modality: string, numbers: number[], meta: any }) => {
  const response = await api.post('/games', game);
  return response.data;
};

export const getGames = async () => {
  const response = await api.get('/games');
  return response.data;
};

export const deleteGame = async (id: string) => {
  const response = await api.delete(`/games/${id}`);
  return response.data;
};

export default api;

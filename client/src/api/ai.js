import api from '../lib/api';

export const askAI = (prompt) => {
    return api.post('/api/ask', { prompt });
};

import api from '../lib/api';

export const googleAuth = (code) => {
    return api.get(`/auth/google?code=${code}`);
};

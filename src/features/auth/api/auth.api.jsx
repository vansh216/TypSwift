import api from '../../../shared/api/axios.jsx';

export const loginApi = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

export const registerApi = async (username, email, password) => {
  const res = await api.post('/auth/register', { username, email, password });
  return res.data;
};
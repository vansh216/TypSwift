import api from '../../../shared/api/axios';


export const fetchUserStats = async () => {
  const res = await api.get('/user/stats');
  return res.data;
};


export const fetchUserHistory = async ({ page = 1, limit = 10 } = {}) => {
  const res = await api.get('/user/history', {
    params: { page, limit }
  });
  return res.data;
};
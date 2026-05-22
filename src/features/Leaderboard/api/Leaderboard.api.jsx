import api from '../../../shared/api/axios';


export const fetchLeaderboard = async ({ duration = null, limit = 10 } = {}) => {
  const params = {};

  if (duration) params.duration = duration;
  if (limit)    params.limit    = limit;

  const res = await api.get('/Leaderboard', { params });
  return res.data;
};
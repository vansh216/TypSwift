import api from '../../../shared/api/axios';

// POST /api/ai/analyze
// send test result to backend for AI analysis
// works for both guest and logged in users

export const analyzeTestResult = async ({
  wpm,
  accuracy,
  duration,
  errors,
  wpmHistory  = [],
  charErrors  = [],
}) => {
  const res = await api.post('/ai/analyze', {
    wpm,
    accuracy,
    duration,
    errors,
    wpmHistory,
    charErrors,
  });
  return res.data;
};
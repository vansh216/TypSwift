import api from '../../../shared/api/axios.jsx';


// fetch random paragraph based on filters

export const fetchParagraph = async ({ difficulty = 'medium', duration = 3 } = {}) => {
    const res = await api.get('/test/paragraph', {
        params: { difficulty, duration },
    });
    return res.data;
};


// submit completed test result

export const submitTest = async ({
    wpm,
    accuracy,
    duration,
    errors,
    wpmHistory,
    paragraphId,
}) => {
    const res = await api.post('/test/submit', {
        wpm,
        accuracy,
        duration,
        errors,
        wpmHistory,
        paragraphId,
    });
    return res.data;
};
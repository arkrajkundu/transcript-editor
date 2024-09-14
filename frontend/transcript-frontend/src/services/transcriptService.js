import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getTranscript = async () => {
  const response = await axios.get(`${API_URL}/transcript`);
  return response.data;
};

export const updateTranscript = async (id, newWord) => {
  const response = await axios.post(`${API_URL}/transcript/update`, { id, newWord });
  return response.data;
};

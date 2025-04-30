const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const config = {
  apiUrl: API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL,
  imageUrl: `${API_URL}/uploads`,
}; 
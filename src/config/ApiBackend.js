//const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://d19e-3-22-242-137.ngrok-free.app';
// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5433';
const BACKEND_URL = 'http://localhost:5433';

export { BACKEND_URL };

export const getApiUrl = (path) => {
  const formattedPath = path.startsWith('/') ? path.substring(1) : path;
  return `${BACKEND_URL}/${formattedPath}`;
};
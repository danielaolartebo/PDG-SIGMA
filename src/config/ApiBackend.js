//const BACKEND_URL = 'http://localhost:5433';
const BACKEND_URL = 'https://sigma-backend-d9dednhzhyeug2h7.eastus-01.azurewebsites.net';

export { BACKEND_URL };

export const getApiUrl = (path) => {
  const formattedPath = path.startsWith('/') ? path.substring(1) : path;
  return `${BACKEND_URL}/${formattedPath}`;
};

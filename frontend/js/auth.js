const API_BASE = (window.ROYAL_STORE_API_BASE || '').replace(/\/$/, '');
const TOKEN_KEY = 'royal_store_access_token';

export const getToken = () => sessionStorage.getItem(TOKEN_KEY);
export const setToken = (token) => sessionStorage.setItem(TOKEN_KEY, token);
export const logout = () => sessionStorage.removeItem(TOKEN_KEY);
export const isLoggedIn = () => Boolean(getToken());

export const authFetch = (path, options = {}) => {
  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(`${API_BASE}${path}`, { ...options, headers });
};

export const login = async (email, password) => {
  const response = await authFetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message || 'Login failed.');
  setToken(payload.data.token);
  return payload.data.user;
};

export const signup = async (name, email, password) => {
  const response = await authFetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message || 'Signup failed.');
  setToken(payload.data.token);
  return payload.data.user;
};

export const getCurrentUser = async () => {
  if (!getToken()) return null;
  const response = await authFetch('/api/auth/me');
  if (response.status === 401) {
    logout();
    return null;
  }
  if (!response.ok) throw new Error('Could not load account.');
  const payload = await response.json();
  return payload.data.user;
};

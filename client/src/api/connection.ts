import { router } from '@/router';
import axios, { HttpStatusCode } from 'axios';
import { useTokenStore } from '../stores/token-store';
import { logout } from './account';

export const BASE_URL =
  location.hostname === 'localhost'
    ? 'http://localhost:3005'
    : '';

console.log('BASE_URL:', BASE_URL);

export const server = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function ensureValidAccessToken() {
  const tokenStore = useTokenStore();
  if (!tokenStore.accessToken) {
    if (tokenStore.refreshToken) {
      await fetchAccessToken();
    } else {
      // No refresh token, force logout
      logout();
      throw new Error('No refresh token found. User must log in.');
    }
  }
}

export function initializeConnection() {
  addInterceptors();
}

export function addInterceptors() {
  // Insert the access token into the Authorization header
  server.interceptors.request.use(async (config) => {
    //@ts-ignore
    if (!config) config = {};
    config!.headers!.Authorization = `Bearer ${useTokenStore().accessToken}`;
    return config;
  });

  // Handle 401 errors by fetching a new access token
  server.interceptors.response.use(
    (res) => {
      return res;
    },
    async (error) => {
      const excludeUrls = [
        '/auth/token',
        '/account/login',
        '/account/register'
      ];
      if (
        error.response?.status === HttpStatusCode.Unauthorized &&
        !excludeUrls.includes(error.config.url)
      ) {
        // If it's a 401 error on a fetchAccessToken request, it means the refresh token is invalid
        // Redirect the user to the login page
        if (error.config.url?.includes('/auth/token')) {
          useTokenStore().clear();
          router.push('/login');
          return Promise.reject('Invalid refresh token');
        }

        if (!useTokenStore().refreshToken)
          return Promise.reject(
            error.response?.data?.message || 'No refresh token found'
          );

        await fetchAccessToken();

        // After fetching the access token, retry the original request
        // This is done by returning the server call with the original config
        // Add the new access token to the Authorization header
        const config = error.config;
        config.headers['Authorization'] = `Bearer ${useTokenStore().accessToken}`;
        return server(config);
      }

      return Promise.reject(error);
    }
  );
}

export async function fetchAccessToken() {
  let response;
  try {
    console.log(
      '@fetchAccessToken: refreshToken:',
      useTokenStore().refreshToken
    );
    response = await server.put('/auth/token', {
      refreshToken: useTokenStore().refreshToken
    });
  } catch (error) {
    console.error('Invalid refresh token');
    logout();
    return;
  }

  useTokenStore().accessToken = response.data.accessToken;
}

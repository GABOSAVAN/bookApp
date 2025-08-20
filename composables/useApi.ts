import { useRuntimeConfig } from '#app';
import type { UserCredentials } from '~/types/auth';

export const useApi = () => {
  const runtimeConfig = useRuntimeConfig();
  const API_BASE = runtimeConfig.public.apiBase;

  async function callApi(endpoint: string, options: RequestInit) {
    const url = `${API_BASE}${endpoint}`;
    
    // Headers por defecto
    const defaultHeaders = {
      'Content-Type': 'application/json',
      // Aquí puedes añadir otros headers, como el token de autorización
      // 'Authorization': `Bearer ${token}`
    };

    const finalOptions = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, finalOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en la solicitud');
      }

      return data;
    } catch (err) {
      throw new Error((err as Error).message || 'Error de red');
    }
  }

  return {
    login: (credentials: UserCredentials) => callApi('user/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (credentials: UserCredentials) => callApi('user/register', { method: 'POST', body: JSON.stringify(credentials) }),
  };
};
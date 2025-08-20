import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useApi } from '~/composables/useApi';
import type { User, UserCredentials } from '~/types/auth';

// Exportar la definición del store
export const useAuthStore = defineStore('auth', () => {
  // Inicializamos el composable para usarlo en las acciones
  const { login: apiLogin, register: apiRegister } = useApi();

  // Estado
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle');
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!token.value);
  const isLoading = computed(() => status.value === 'loading');

  // Acciones
  async function login(credentials: UserCredentials) {
    status.value = 'loading';
    error.value = null;
    try {
      const data = await apiLogin(credentials);

      user.value = data.user;
      token.value = data.token;
      status.value = 'success';
      console.log('Login exitoso:', user.value);
      return true;
    } catch (err) {
      status.value = 'error';
      error.value = (err as Error).message;
      console.error('Error de login:', error.value);
      return false;
    }
  }

  async function register(credentials: UserCredentials) {
    status.value = 'loading';
    error.value = null;
    try {
      const data = await apiRegister(credentials);
      console.log("data...", data);

      user.value = data.user;
      token.value = data.token;
      status.value = 'success';
      console.log('Registro exitoso:', user.value);
      return true;
    } catch (err) {
      status.value = 'error';
      error.value = (err as Error).message;
      console.error('Error de registro:', error.value);
      return false;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    status.value = 'idle';
    console.log('Sesión cerrada.');
  }

  return { 
    user, 
    token, 
    status, 
    error, 
    isAuthenticated, 
    isLoading, 
    login, 
    register, 
    logout 
  };
}, 
{
  // Configuración de persistencia en localStorage
  // persist: {
  //   storage: typeof window !== 'undefined' ? localStorage : undefined,
  //   paths: ['user', 'token'], // Solo persistir user y token
  //   key: 'auth-store', // Nombre de la clave en localStorage
  //   beforeRestore: (context:any) => {
  //     console.log('🔄 Restaurando sesión desde localStorage...');
  //   },
  //   afterRestore: (context:any) => {
  //     const { user, token } = context.store;
  //     if (token && user) {
  //       console.log('✅ Sesión restaurada para:', user.name || user.email);
  //     }
  //   },
  // }
  persist: true
}
);
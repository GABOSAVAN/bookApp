<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { storeToRefs } from 'pinia';

// Instanciar el store
const authStore = useAuthStore();

// Usar storeToRefs para reactividad
const { isLoading, error, isAuthenticated } = storeToRefs(authStore);

// Función para manejar el inicio de sesión de usuario
const handleLogin = async (credentials: { email: string; password: string }) => {
  // Llamar a la acción de login del store
  const success = await authStore.login(credentials);
  
  // Redirigir al usuario si el inicio de sesión fue exitoso
  if (success) {
    await navigateTo('/'); // Usar navigateTo en lugar de router.push
  }
};

// Redirigir si ya está logueado (protección adicional)
watchEffect(() => {
  if (isAuthenticated.value) {
    navigateTo('/');
  }
});
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-blue p-4">
    <!-- El componente AuthForm es reutilizable.
         Aquí le pasamos el tipo 'login' y escuchamos el evento @submit. -->
    <AuthForm type="login" @submit="handleLogin" />
     
    <!-- Mostrar estado de carga o error del store -->
    <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 text-white z-50">
      <p>Cargando...</p>
    </div>
    <div v-if="error" class="text-red-500 text-center mt-4">
      <p>{{ error }}</p>
    </div>
  </div>
</template>
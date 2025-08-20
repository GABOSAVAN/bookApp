<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

// Instanciar el store y el enrutador
const authStore = useAuthStore();
const router = useRouter();

// Función para manejar el inicio de sesión de usuario
const handleLogin = async (credentials: { email: string; password: string }) => {
  // Llamar a la acción de login del store
  const success = await authStore.login(credentials);

  // Redirigir al usuario si el inicio de sesión fue exitoso
  if (success) {
    router.push('/');
  }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-blue p-4">
    <!-- El componente AuthForm es reutilizable.
         Aquí le pasamos el tipo 'login' y escuchamos el evento @submit. -->
    <AuthForm type="login" @submit="handleLogin" />

    <!-- Mostrar estado de carga o error del store -->
    <div v-if="authStore.isLoading" class="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 text-white z-50">
      <p>Cargando...</p>
    </div>
    <div v-if="authStore.error" class="text-red-500 text-center mt-4">
      <p>{{ authStore.error }}</p>
    </div>
  </div>
</template>
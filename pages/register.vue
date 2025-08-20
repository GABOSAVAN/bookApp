<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

// Instanciar el store y el enrutador
const authStore = useAuthStore();
const router = useRouter();

// Función para manejar el registro de usuario
const handleRegister = async (credentials: { email: string; password: string; name: string }) => {
  // Llamar a la acción de registro del store
  const success = await authStore.register(credentials);

  // Redirigir al usuario si el registro fue exitoso
  if (success) {
    router.push('/');
  }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-blue">
    <!-- El componente AuthForm es reutilizable.
         Aquí le pasamos el tipo 'register' y escuchamos el evento @submit. -->
    <AuthForm type="register" @submit="handleRegister" />
    
    <!-- Mostrar estado de carga o error del store -->
    <div v-if="authStore.isLoading" class="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 text-white z-50">
      <p>Cargando...</p>
    </div>
    <div v-if="authStore.error" class="text-red-500 text-center mt-4">
      <p>{{ authStore.error }}</p>
    </div>
  </div>
</template>
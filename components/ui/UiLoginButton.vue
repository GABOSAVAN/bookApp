<script setup>
import { useAuthStore } from '~/stores/auth';
import { storeToRefs } from 'pinia';

// Accede al store de autenticación
const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);

// Crea una función para manejar el evento de clic
function handleLogin() {
    navigateTo('/login');
}
</script>
<template>
    <UButton
      v-if="!isAuthenticated"
      class="w-full mt-4"
      block size="lg"
      color="primary"
      label="Iniciar Sesión"
      icon="i-heroicons-arrow-right-on-rectangle" @click="handleLogin" />
</template>
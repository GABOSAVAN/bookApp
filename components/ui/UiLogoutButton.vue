
  <script setup>
  import { useAuthStore } from '~/stores/auth';
  import { storeToRefs } from 'pinia';

  // Accede al store de autenticación
  const authStore = useAuthStore();
  const { isAuthenticated } = storeToRefs(authStore);

  // Crea una función para manejar el evento de clic
  function handleLogout() {
    authStore.logout();
    // Opcional: Redirigir al usuario a la página de inicio de sesión
    navigateTo('/login');
  }
</script>
<template>
  <div class="flex justify-end">
    <UButton 
    v-if="isAuthenticated" 
    class="w-full mt-4" block size="lg" color="primary" variant="ghost"
      label="Cerrar Sesión" icon="i-heroicons-arrow-left-on-rectangle" @click="handleLogout" />
  </div>
</template>

  <script setup>
  import { useAuthStore } from '~/stores/auth';

  const authStore = useAuthStore();

  // Crea una función para manejar el evento de clic
  function handleLogout() {
    authStore.logout();    
    navigateTo('/');
  }
</script>
<template>
    <UButton 
    class="w-min"
    block size="lg"
    color="secondary"
    variant="ghost"
    label="Cerrar Sesión"
    icon="i-heroicons-arrow-left-on-rectangle"
    @click="handleLogout" />
</template>
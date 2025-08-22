
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
  <div class="flex justify-end">
    <UButton 
    class="w-min mt-4 mr-6"
    block size="lg"
    color="secundary"
    variant="ghost"
    label="Cerrar Sesión"
    icon="i-heroicons-arrow-left-on-rectangle"
    @click="handleLogout" />
  </div>
</template>
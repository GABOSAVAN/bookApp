<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { storeToRefs } from 'pinia';

// Importa useRoute
import { useRoute } from 'vue-router';

// Accede al store de autenticación
const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);

// Accede a la ruta actual
const route = useRoute();

// Enlaces solo para usuarios autenticados
const protectedLinks = [
  { label: 'Mi Biblioteca', to: '/myLibrery' }
];

// Propiedad computada que filtra los enlaces
const visibleLinks = computed(() => {
  const currentLinks = [];

  // Si la ruta actual no es la página principal, agregamos el enlace de Inicio
  if (route.path !== '/') {
    currentLinks.unshift({ label: 'Inicio', to: '/' });
  }

  // Si el usuario SÍ está autenticado, agregamos los enlaces protegidos
  if (isAuthenticated.value) {
    currentLinks.push(...protectedLinks);
  }

  return currentLinks;
});

const isMobileMenuOpen = ref(false);
</script>

<template>
  <header class="bg-gray-800 text-white p-4">
    <div class="container mx-auto flex items-center justify-between">
      <NuxtLink to="/" class="text-2xl font-bold">Book Reviews App</NuxtLink>

      <nav class="hidden md:flex items-center space-x-4">
        <NuxtLink
          v-for="link in visibleLinks"
          :key="link.to"
          :to="link.to"
          active-class="font-bold border-b-2 border-white"
          class="hover:text-gray-300 transition-colors duration-200"
        >
          {{ link.label }}
        </NuxtLink>
        <UiThemeSwitcher /> 
        <AuthButtons />
      </nav>

      <UButton
        icon="i-heroicons-bars-3-solid"
        color="neutral"
        variant="solid"
        class="md:hidden"
        @click="isMobileMenuOpen = true"
      />
    </div>

    <div
      :class="['fixed inset-y-0 right-0 z-50 transform transition-transform duration-300 ease-in-out bg-gray-900 text-white w-64 p-6 md:hidden', { 'translate-x-0': isMobileMenuOpen, 'translate-x-full': !isMobileMenuOpen }]"
      @click.stop
    >
      <div class="flex items-center justify-between mb-8">
        <h3 class="text-xl font-bold">Menú</h3>
        <UButton
          icon="i-heroicons-x-mark"
          color="neutral"
          variant="ghost"
          @click="isMobileMenuOpen = false"
        />
      </div>
      <nav class="flex flex-col space-y-4">
        <NuxtLink
          v-for="link in visibleLinks"
          :key="link.to"
          :to="link.to"
          active-class="font-bold border-b-2 border-gray-100"
          class="text-lg text-gray-200 hover:text-white transition-colors duration-200"
          @click="isMobileMenuOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
        <div class="flex justify-center mt-2">
          <UiThemeSwitcher />          
        </div>
        <div class="flex justify-center mt-2">
          <AuthButtons />
        </div>
      </nav>
    </div>

    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 z-40 bg-black opacity-50 md:hidden"
      @click="isMobileMenuOpen = false"
    />
  </header>
</template>
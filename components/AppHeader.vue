<script setup lang="ts">
import { ref } from 'vue';
import { UButton } from '#components';

const links = ref([
  { label: 'Inicio', to: '/' },
  { label: 'Mi Biblioteca', to: '/myLibrery' },
  { label: 'Login', to: '/login' },
  { label: 'Registro', to: '/register' },
  { label: 'Libro de Ejemplo', to: '/detailBook/123' }
]);

const isMobileMenuOpen = ref(false);
</script>

<template>
  <header class="bg-gray-800 text-white p-4">
    <div class="container mx-auto flex items-center justify-between">
      <!-- Logo or Title -->
      <NuxtLink to="/" class="text-2xl font-bold">Book Reviews App</NuxtLink>

      <!-- Desktop menu -->
      <nav class="hidden md:flex items-center space-x-4">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          active-class="font-bold border-b-2 border-white"
          class="hover:text-gray-300 transition-colors duration-200"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
      <ThemeSwitcher />


      <!-- Hamburger menu button for mobile -->
      <UButton
        icon="i-heroicons-bars-3-solid"
        color="neutral"
        variant="solid"
        class="md:hidden"
        @click="isMobileMenuOpen = true"
      />
    </div>

    <!-- Mobile Menu as a slide-out aside -->
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
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          active-class="font-bold border-b-2 border-gray-100"
          class="text-lg text-gray-200 hover:text-white transition-colors duration-200"
          @click="isMobileMenuOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </div>

    <!-- Overlay para cerrar el menú al hacer clic fuera -->
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 z-40 bg-black opacity-50 md:hidden"
      @click="isMobileMenuOpen = false"
    ></div>
  </header>
</template>
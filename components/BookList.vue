<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  books: Array<{
    id: string;
    title: string;
    author: string;
    coverUrl?: string;
  }>;
}>();

// Estado de la paginación
const currentPage = ref(1);
const itemsPerPage = 10;

// Libros que se muestran en la página actual
const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return props.books.slice(start, end);
});

// Calcula el número total de páginas
const totalPages = computed(() => Math.ceil(props.books.length / itemsPerPage));

// Navegación
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};
</script>

<template>
  <div class="flex flex-col items-center gap-8 py-15">
    <!-- Grid de Tarjetas -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
      <BookCard v-for="book in paginatedBooks" :key="book.id" :book="book" />
    </div>

    <!-- Paginación -->
    <div v-if="totalPages > 1" class="flex items-center gap-4 mt-8">
      <UButton
        icon="i-heroicons-arrow-left"
        color="neutral"
        :disabled="currentPage === 1"
        @click="prevPage"
      />
      <span class="text-lg font-bold">Página {{ currentPage }} de {{ totalPages }}</span>
      <UButton
        icon="i-heroicons-arrow-right"
        color="neutral"
        :disabled="currentPage === totalPages"
        @click="nextPage"
      />
    </div>
  </div>
</template>
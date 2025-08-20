<script setup lang="ts">
import { ref, computed } from 'vue';

const books = ref([
  { id: 1, title: 'El Señor de los Anillos', author: 'J.R.R. Tolkien', year: 1954, review: 'Una obra maestra épica que cautiva desde la primera página.', rating: 5 },
  { id: 2, title: '1984', author: 'George Orwell', year: 1949, review: 'Una distopía escalofriante y relevante.', rating: 4 },
  { id: 3, title: 'Cien Años de Soledad', author: 'Gabriel García Márquez', year: 1967, review: 'Un viaje mágico y surrealista a través de la historia de una familia.', rating: 5 },
  { id: 4, title: 'El Principito', author: 'Antoine de Saint-Exupéry', year: 1943, review: '', rating: 3 },
  { id: 5, title: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', year: 1605, review: 'Un clásico de la literatura española lleno de humor y aventuras.', rating: 5 }
]);

const searchTerm = ref('');
const sortOrder = ref('asc'); // 'asc' o 'desc'
const showReviewedOnly = ref(false);

const filteredAndSortedBooks = computed(() => {
  let filteredBooks = books.value.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                        book.author.toLowerCase().includes(searchTerm.value.toLowerCase());
    const matchesReviewFilter = !showReviewedOnly.value || (showReviewedOnly.value && book.review.length > 0);
    return matchesSearch && matchesReviewFilter;
  });

  if (sortOrder.value === 'asc') {
    filteredBooks.sort((a, b) => a.rating - b.rating);
  } else {
    filteredBooks.sort((a, b) => b.rating - a.rating);
  }

  return filteredBooks;
});

const handleEditBook = (id: number, review: string, rating: number) => {
  const bookIndex = books.value.findIndex(b => b.id === id);
  if (bookIndex !== -1) {
    books.value[bookIndex].review = review;
    books.value[bookIndex].rating = rating;
  }
};

const handleDeleteBook = (id: number) => {
  books.value = books.value.filter(book => book.id !== id);
};
</script>

<template>
  <div class="p-8 bg-gray">
    <h1 class="text-4xl font-bold text-center mb-8">Mi Biblioteca</h1>

    <div class="bg-blue rounded-lg shadow-md p-6 mb-8 flex flex-col md:flex-row items-center gap-4">
      <UInput
        v-model="searchTerm"
        icon="i-heroicons-magnifying-glass"
        placeholder="Buscar por título o autor..."
        class="flex-1 w-full md:w-auto"
      />

      <div class="flex items-center gap-4">
        <USelect
          v-model="sortOrder"
          :options="[{ label: 'Calificación Asc', value: 'asc' }, { label: 'Calificación Desc', value: 'desc' }]"
          class="w-48"
        />

        <UCheckbox
          v-model="showReviewedOnly"
          label="Solo con review"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <LibreryCard
        v-for="book in filteredAndSortedBooks"
        :key="book.id"
        :book="book"
        @edit="handleEditBook"
        @delete="handleDeleteBook"
      />
      <div v-if="filteredAndSortedBooks.length === 0" class="col-span-1 lg:col-span-2 text-center text-gray-500 text-lg">
        No se encontraron libros que coincidan con la búsqueda.
      </div>
    </div>
  </div>
</template>
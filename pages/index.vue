<script setup lang="ts">
import { ref } from 'vue';
import type { ListBook } from '~/types/book';
import { useBooks } from '~/composables/useBooks';

const { searchBooks } = useBooks();

// Define las últimas 5 búsquedas como un array de strings.
const lastSearches = ref(['Backlog', 'Todo', 'In Progress', 'Done', 'Another search']);

// Define la variable que contendrá el valor del input de búsqueda.
const searchValue = ref('');

// Define si el cuadro de sugerencias está visible.
const showSuggestions = ref(false);

// Variable para el índice de la sugerencia seleccionada (para navegación con teclado).
const selectedIndex = ref(-1);

// Maneja la visibilidad del cuadro de sugerencias
const handleInputFocus = () => {
  showSuggestions.value = true;
};

const handleInputBlur = () => {
  // Retrasa el cierre para permitir el clic en las sugerencias
  setTimeout(() => {
    showSuggestions.value = false;
  }, 200);
};

const selectSuggestion = (suggestion: string) => {
  searchValue.value = suggestion;
  showSuggestions.value = false;
  handleSearch();
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault(); // Evita que la página se desplace
    selectedIndex.value = (selectedIndex.value + 1) % lastSearches.value.length;
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    selectedIndex.value = (selectedIndex.value - 1 + lastSearches.value.length) % lastSearches.value.length;
  } else if (event.key === 'Enter') {
    if (selectedIndex.value !== -1) {
      selectSuggestion(lastSearches.value[selectedIndex.value]);
    } else {
      handleSearch();
    }
  }
};

// Lógica de búsqueda
const searchResults = ref<ListBook>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const handleSearch = async () => {
  if (searchValue.value) {
    loading.value = true;
    error.value = null;
    
    try {
      console.log(`Buscando libros con el término: ${searchValue.value}`);
      searchResults.value = await searchBooks(searchValue.value);
    } catch (err: any) {
      error.value = 'Error al buscar libros';
      console.error('Error searching books:', err);
    } finally {
      loading.value = false;
    }
  }
};
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <h1 class="text-4xl font-bold mb-8">Buscar Libro</h1>

    <div class="relative w-full max-w-lg flex items-center gap-4 px-4">
      <UInput
        v-model="searchValue"
        placeholder="Buscar..."
        icon="i-lucide-search"
        size="md"
        variant="outline"
        class="flex-grow"
        @focus="handleInputFocus"
        @blur="handleInputBlur"
        @keydown="handleKeyDown"
      />

      <!-- Sección flotante de sugerencias -->
      <div v-if="showSuggestions && lastSearches.length > 0" class="absolute top-full left-0 mt-2 w-full bg-blue border-gray-200 rounded-lg shadow-lg z-10">
        <ul class="py-2">
          <li
          v-for="(suggestion, index) in lastSearches"
          :key="suggestion"
          class="px-4 py-2 cursor-pointer hover:bg-blue-100"
          :class="{ 'bg-gray-600': index === selectedIndex }"
          @mousedown="selectSuggestion(suggestion)"
          >
            {{ suggestion }}
          </li>
        </ul>
      </div>

      <!-- El botón de búsqueda se mantiene -->
      <UButton 
      :loading="loading"
      @click="handleSearch" 
      >
      Buscar
    </UButton>
    </div>

    <!-- Mostrar estado de carga -->
    <div v-if="loading" class="mt-8 text-center">
      <p>Buscando libros...</p>
    </div>

    <!-- Mostrar error si existe -->
    <div v-if="error" class="mt-8 text-center text-red-500">
      <p>{{ error }}</p>
    </div>

    <!-- Sección de resultados de búsqueda -->
    <BookList v-if="searchResults.length > 0 && !loading" :books="searchResults" class="mt-8" />
  </div>
</template>
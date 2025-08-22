<script setup lang="ts">
import { ref } from 'vue';
import { useBooks } from '~/composables/useBooks';

const store = useBooksStore();
const { 
  searchResults, 
  currentQuery, 
  loading, 
  error, 
  hasResults, 
  isEmpty 
} = storeToRefs(store);

const { searchBooks } = useBooks();
  
// Define las últimas 5 búsquedas como un array de strings.
const lastSearches = ref(['Backlog', 'Todo', 'In Progress', 'Done', 'Another search']);

// Define la variable que contendrá el valor del input de búsqueda.
const searchValue = ref('');

// Define si el cuadro de sugerencias está visible.
const showSuggestions = ref(false);

// Variable para el índice de la sugerencia seleccionada (para navegación con teclado).
const selectedIndex = ref(-1);

// Al montar el componente, restaurar el valor de búsqueda si existe
onMounted(() => {
  if (currentQuery) {
    searchValue.value = currentQuery.value;
  }
});

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

const handleSearch = async () => {
  if (searchValue.value) {
    
    try {
      // console.log(`Buscando libros con el término: ${searchValue.value}`);
      await searchBooks(searchValue.value.trim());
      
      // Agregar a las últimas búsquedas si no existe
       if (!lastSearches.value.includes(searchValue.value)) {
         lastSearches.value.unshift(searchValue.value);
        //  Mantener solo las últimas 5 búsquedas
         if (lastSearches.value.length > 5) {
           lastSearches.value = lastSearches.value.slice(0, 5);
         }
       }
    } catch (err) {
      console.error('Error searching books:', err);
    }
  }
};

const handleClearSearch = () => {
  searchValue.value = '';
  store.clearSearch();
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

      <div
       v-if="showSuggestions && lastSearches.length > 0"
        class="absolute top-full left-0 mt-2 w-full bg-blue border-gray-200 rounded-lg shadow-lg z-10">
        <ul class="py-2">
          <li
           v-for="(suggestion, index) in lastSearches" :key="suggestion"
            class="px-4 py-2 cursor-pointer hover:bg-blue-100 dark:hover:color-black"
            :class="{ 'bg-gray-600': index === selectedIndex }"
            @mousedown="selectSuggestion(suggestion)">
            {{ suggestion }}
          </li>
        </ul>
      </div>

      <UButton :loading="loading" @click="handleSearch">
        Buscar
      </UButton>
      <UButton 
          v-if="hasResults || currentQuery" 
          variant="ghost"
          size="md"
          @click="handleClearSearch" 
        >
          Limpiar
        </UButton>
    </div>


    <div v-if="loading" class="mt-8 text-center">
      <p>Buscando libros...</p>
    </div>

    <div v-if="error" class="mt-8 text-center text-red-500">
      <p>{{ error }}</p>
    </div>

    <div v-if="isEmpty" class="mt-8 text-center text-gray-500">
      <p>No se encontraron libros para "{{ currentQuery }}"</p>
    </div>

    <div v-if="searchResults.length > 0 || loading" class="mt-8">
      <h3>
        Libros encontrados {{ searchResults.length }}
      </h3>
    </div>

    <BookList
     v-if="searchResults.length > 0 
     && !loading"
     :books="searchResults" class="mt-8"
     />
  </div>
</template>
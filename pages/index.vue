<script setup lang="ts">
import { ref } from 'vue';

// Datos de referencia para el mockup de resultados
const booksData = [
	{
		"id": "OL166899W",
		"title": "Записки изъ подполья",
		"author": "Фёдор Михайлович Достоевский",
		"cover_id": 9415092,
		"publication_date": 1960,
		"coverUrl": "https://covers.openlibrary.org/b/id/9415092-M.jpg"
	},
	{
		"id": "OL1003017W",
		"title": "Memórias póstumas de Brás Cubas",
		"author": "Joaquim Maria Machado de Assis",
		"cover_id": 123152,
		"publication_date": 1881,
		"coverUrl": "https://covers.openlibrary.org/b/id/123152-M.jpg"
	},
	{
		"id": "OL7973273W",
		"title": "The Devil's Dictionary",
		"author": "Ambrose Bierce",
		"cover_id": 12671319,
		"publication_date": 1840,
		"coverUrl": "https://covers.openlibrary.org/b/id/12671319-M.jpg"
	},
	{
		"id": "OL52556W",
		"title": "Die Leiden des jungen Werthers",
		"author": "Johann Wolfgang von Goethe",
		"cover_id": 7187281,
		"publication_date": 1779,
		"coverUrl": "https://covers.openlibrary.org/b/id/7187281-M.jpg"
	},
	{
		"id": "OL19870W",
		"title": "The Jungle Book",
		"author": "Rudyard Kipling",
		"cover_id": 3344204,
		"publication_date": 1893,
		"coverUrl": "https://covers.openlibrary.org/b/id/3344204-M.jpg"
	},
	{
		"id": "OL81180W",
		"title": "Lady Chatterley's Lover",
		"author": "D. H. Lawrence",
		"cover_id": 12983362,
		"publication_date": 1900,
		"coverUrl": "https://covers.openlibrary.org/b/id/12983362-M.jpg"
	},
	{
		"id": "OL52114W",
		"title": "The War of the Worlds",
		"author": "H. G. Wells",
		"cover_id": 36314,
		"publication_date": 0,
		"coverUrl": "https://covers.openlibrary.org/b/id/36314-M.jpg"
	},
	{
		"id": "OL151411W",
		"title": "Alice's Adventures in Wonderland / Through the Looking Glass",
		"author": "Lewis Carroll",
		"cover_id": 8595966,
		"publication_date": 1889,
		"coverUrl": "https://covers.openlibrary.org/b/id/8595966-M.jpg"
	},
	{
		"id": "OL151406W",
		"title": "Through the Looking-Glass",
		"author": "Lewis Carroll",
		"cover_id": 11272464,
		"publication_date": 1865,
		"coverUrl": "https://covers.openlibrary.org/b/id/11272464-M.jpg"
	},
	{
		"id": "OL244537W",
		"title": "The Art of War",
		"author": "孙武",
		"cover_id": 4849549,
		"publication_date": 1900,
		"coverUrl": "https://covers.openlibrary.org/b/id/4849549-M.jpg"
	},
	{
		"id": "OL20600W",
		"title": "Gulliver's Travels",
		"author": "Jonathan Swift",
		"cover_id": 12717083,
		"publication_date": 1726,
		"coverUrl": "https://covers.openlibrary.org/b/id/12717083-M.jpg"
	},
	{
		"id": "OL138052W",
		"title": "Alice's Adventures in Wonderland",
		"author": "Lewis Carroll",
		"cover_id": 10527843,
		"publication_date": 1865,
		"coverUrl": "https://covers.openlibrary.org/b/id/10527843-M.jpg"
	},
	{
		"id": "OL827357W",
		"title": "Zen and the Art of Motorcycle Maintenance",
		"author": "Robert M. Pirsig",
		"cover_id": 10673266,
		"publication_date": 1974,
		"coverUrl": "https://covers.openlibrary.org/b/id/10673266-M.jpg"
	},
	{
		"id": "OL276395W",
		"title": "Washington Square",
		"author": "Henry James",
		"cover_id": 8243278,
		"publication_date": 1880,
		"coverUrl": "https://covers.openlibrary.org/b/id/8243278-M.jpg"
	},
	{
		"id": "OL15733518W",
		"title": "Speeches",
		"author": "Cicero",
		"cover_id": 8236472,
		"publication_date": 1499,
		"coverUrl": "https://covers.openlibrary.org/b/id/8236472-M.jpg"
	},
	{
		"id": "OL1445824W",
		"title": "Der Einzige und sein Eigentum",
		"author": "Max Stirner",
		"cover_id": 7261395,
		"publication_date": 1845,
		"coverUrl": "https://covers.openlibrary.org/b/id/7261395-M.jpg"
	},
	{
		"id": "OL10365273W",
		"title": "El sexto",
		"author": "José María Arguedas",
		"cover_id": 5517436,
		"publication_date": 1969,
		"coverUrl": "https://covers.openlibrary.org/b/id/5517436-M.jpg"
	},
	{
		"id": "OL11350239W",
		"title": "Laws, etc",
		"author": "England and Wales",
		"cover_id": 11761863,
		"publication_date": 1513,
		"coverUrl": "https://covers.openlibrary.org/b/id/11761863-M.jpg"
	},
	{
		"id": "OL67551W",
		"title": "De officiis",
		"author": "Cicero",
		"cover_id": 6487218,
		"publication_date": 1465,
		"coverUrl": "https://covers.openlibrary.org/b/id/6487218-M.jpg"
	},
	{
		"id": "OL1313851W",
		"title": "Elegiae",
		"author": "Sextus Propertius",
		"cover_id": 5946488,
		"publication_date": 1780,
		"coverUrl": "https://covers.openlibrary.org/b/id/5946488-M.jpg"
	},
	{
		"id": "OL20645179W",
		"title": "Shuggie Bain",
		"author": "Douglas Stuart",
		"cover_id": 9271540,
		"publication_date": 2020,
		"coverUrl": "https://covers.openlibrary.org/b/id/9271540-M.jpg"
	}]
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
const searchResults = ref([]);
const handleSearch = () => {
  if (searchValue.value) {
    console.log(`Buscando libros con el término: ${searchValue.value}`);
    // Aquí iría la lógica para llamar a una API real.
    // Por ahora, usamos el array de referencia.
    searchResults.value = booksData;
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
      <UButton @click="handleSearch">Buscar</UButton>
    </div>

    <!-- Sección de resultados de búsqueda -->
    <BookList v-if="searchResults.length > 0" :books="searchResults" class="mt-8" />
  </div>
</template>

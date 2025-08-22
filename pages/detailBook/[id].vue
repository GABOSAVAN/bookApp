<script setup lang="ts">
// Obtener el ID del libro desde la ruta
const route = useRoute()
const bookId = route.params.id as string

// Stores y composables
const store = useBookDetailStore()
const { 
  currentBook, 
  reviews, 
  loadingBook, 
  loadingReviews, 
  errorBook, 
  errorReviews,
  hasReviews,
  averageRating
} = storeToRefs(store)

const { 
  getBookById,
  getBookReviews,
  // saveReview
 } = useBookDetail()

// Variables para el review y la calificación
// const reviewText = ref('')
// const rating = ref(0)
// const savingReview = ref(false)
// const ratingOptions = [
//   { value: 1, label: '1' },
//   { value: 2, label: '2' },
//   { value: 3, label: '3' },
//   { value: 4, label: '4' },
//   { value: 5, label: '5' },
// ]

// Cargar datos al montar el componente
onMounted(async () => {
  try {
    await getBookById(bookId)
    await getBookReviews(bookId)
  } catch (err) {
    console.error('Error loading book details:', err)
  }
})

// Limpiar store al desmontar
onUnmounted(() => {
  store.clearBookDetail()
})
</script>

<template>
  <div class="flex flex-col items-center p-8 min-h-screen bg-gray relative">
   
    <UButton  
      size="lg" 
      color="secondary"
      label="Volver a resultados"
      icon="i-heroicons-arrow-left-on-rectangle"
      variant="outline"
      class="absolute top-4 left-4"
      @click="$router.back()"
    />

    <!-- Loading del libro -->
    <div v-if="loadingBook" class="text-center py-8">
      <p class="text-lg">Cargando libro...</p>
    </div>

    

    <!-- Error al cargar libro -->
    <div v-else-if="errorBook" class="text-center py-8">
      <p class="text-red-500">{{ errorBook }}</p>
      <UButton
       class="mt-4"
       @click="$router.back()"
       >
       Volver
      </UButton>
    </div>

    <!-- Contenido del libro -->
    <div v-else-if="currentBook" class="bg-blue my-8 rounded-lg shadow-lg p-6 max-w-4xl w-full">
      <!-- Información del libro -->
      <div class="flex flex-col md:flex-row gap-6 mb-8">
        <div class="flex-shrink-0 w-full md:w-1/3 flex justify-center">
          <img 
            :src="currentBook.coverUrl || 'https://via.placeholder.com/300x450.png?text=Sin+Portada'" 
            :alt="`Portada de ${currentBook.title}`"
            class="rounded-lg shadow-md max-h-96" 
          >
        </div>

        <div class="flex-grow">
          <h1 class="text-4xl font-bold mb-2">{{ currentBook.title }}</h1>
          <p class="text-xl text-gray-700 mb-1">Autor: {{ currentBook.author }}</p>
          <p class="text-lg text-gray-500 mb-4">Año: {{ currentBook.publication_date }}</p>
          
          <!-- Calificación promedio -->
          <div v-if="hasReviews" class="mb-4">
            <p class="text-lg">              
              <span class="font-semibold">Calificación promedio:</span> 
              {{ averageRating }}/5 ⭐ 
              <span class="text-gray-500">({{ reviews.length }} reseña{{ reviews.length !== 1 ? 's' : '' }})</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Reseñas existentes -->
       <div v-if="hasReviews" class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Reseñas</h2>
        <div class="space-y-4 max-h-60 overflow-y-auto">
          <div 
            v-for="review in reviews" 
            :key="review.id"
            class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
          >
            <div class="flex justify-between items-start mb-2">
              <!-- <span class="font-medium">{{ review.userName }}</span> -->
              <div class="flex items-center gap-2">
                <span>{{ review.rating }}/5 ⭐</span>
                <span class="text-sm text-gray-500">
                  {{ new Date(review.createdAt).toLocaleDateString() }}
                </span>
              </div>
            </div>
            <p class="text-gray-700 dark:text-gray-300">{{ review.description }}</p>
          </div>
        </div>
      </div> 

      <!-- Loading de reseñas -->
      <div v-if="loadingReviews" class="text-center py-4">
        <p>Cargando reseñas...</p>
      </div>

      <!-- Error de reseñas -->
      <div v-if="errorReviews" class="text-center py-4 text-red-500">
        <p>{{ errorReviews }}</p>
      </div>      
    </div>
  </div>
</template>
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
 } = useBookDetail()

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
   
    <!-- <UButton  
      size="lg" 
      color="secondary"
      label="Volver a resultados"
      icon="i-heroicons-arrow-left-on-rectangle"
      variant="outline"
      class="absolute top-4 left-4"
      @click="$router.back()"
    /> -->

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
    <div v-else-if="currentBook" class="bg-blue my-2 rounded-lg shadow-lg p-6 max-w-4xl w-full">
      <!-- Información del libro -->
      <div class="flex items-center flex-col md:flex-row gap-6">
        <div class="w-full md:w-1/3 flex justify-center">
          <img 
            v-if="currentBook.coverUrl"
            :src="currentBook.coverUrl || 'https://via.placeholder.com/300x450.png?text=Sin+Portada'" 
            :alt="`Portada de ${currentBook.title}`"
            class="rounded-lg shadow-md max-h-96" 
          >
          <img
            v-if="!currentBook.coverUrl"
            src="../../assets/images/ind.png"
            :alt="`Portada de ${currentBook.title}`"
            class="w-full h-full object-cover"
          >
        </div>

        <div class="flex-grow">
          <h1 class="text-4xl justify-self-center font-bold mb-2">{{ currentBook.title }}</h1>
          <p class="text-xl justify-self-center text-gray-700 mb-1">Autor: {{ currentBook.author }}</p>
          <p class="text-lg justify-self-center text-gray-500 mb-4">Año: {{ currentBook.publication_date }}</p>
          
          <!-- Calificación promedio -->
          <div v-if="hasReviews" class="mb-4 justify-self-center">
              <span class="font-semibold">Calificación promedio:</span>
              <div class="mt-2">
                <span v-for="n in Math.round(averageRating)" :key="n">⭐</span> 
                <span class="text-gray-500">({{ reviews.length }} reseña{{ reviews.length !== 1 ? 's' : '' }})</span>
              </div>
          </div>
          <LibraryButton/>
        </div>
      </div>      
    </div>
     
    <!-- Reseñas existentes -->
    <div class="max-w-4xl w-full">

       <!-- Loading de reseñas -->
       <div v-if="loadingReviews" class="text-center py-4">
        <p>Cargando reseñas...</p>
      </div>

      <!-- Error de reseñas -->
      <div v-if="errorReviews" class="text-center py-4 text-red-500">
        <p>{{ errorReviews }}</p>
      </div>      

      <div v-if="hasReviews" class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Reseñas</h2>
        <div class="space-y-4 max-h-60 overflow-y-auto">
          <div 
            v-for="review in reviews" 
            :key="review._id"
            class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
          >
            <div class="flex justify-between items-start mb-2">
              <!-- <span class="font-medium">{{ review.userName }}</span> -->
              <div class="flex items-center gap-2">
                <span v-for="n in Math.round(review.rating)" :key="n">     ⭐     </span>
              </div>
            </div>
            <p class="text-gray-700 dark:text-gray-300">{{ review.description }}</p>
            <span class="text-sm text-gray-500">
              {{ new Date(review.createdAt).toLocaleDateString() }}
            </span>
          </div>
        </div>
      </div> 
    </div>
  </div>
</template>
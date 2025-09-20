<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSelection } from '~/composables/useSelection'
import MyLibraryTable from '~/components/MyLibraryTable.vue'
import BookReviewModal from '~/components/BookReviewModal.vue'
import type { Selection } from '~/types/book'

const toast = useToast()

const {
  selections,
  error,
  stats,
  fetchUserLibrary,
  removeBookFromLibrary,
  refreshLibrary,
  checkAuthentication,
} = useSelection()

const isClient = ref(false)
const isFetching = ref(true)

const isReviewModalOpen = ref(false)
const selectedBookForReview = ref<Selection | null>(null)

const handleEditReview = (selection: Selection) => {
  console.log("Abriendo modal para:", selection.book_id?.title)
  selectedBookForReview.value = selection
  isReviewModalOpen.value = true
}

onMounted(async () => {
  if (checkAuthentication()) {
    isFetching.value = true
    try {
      await fetchUserLibrary()
      isClient.value = true
    } catch (err) {
      console.error('Error en onMounted:', err)
    } finally {
      isFetching.value = false
    }
  }
})

const searchQuery = ref('')
const showOnlyWithReview = ref(false)

const filteredSelections = computed(() => {
  let filtered = selections.value || []

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(selection =>
      selection.book_id?.title?.toLowerCase().includes(query) ||
      selection.book_id?.author?.toLowerCase().includes(query)
    )
  }

  if (showOnlyWithReview.value) {
    filtered = filtered.filter(selection =>
      selection.userReview &&
      selection.userReview.description &&
      selection.userReview.description.trim().length > 0
    )
  }

  return filtered
})

async function randomize() {
  if (selections.value && selections.value.length > 0) {
    try {
      await refreshLibrary()
      toast.add({
        title: 'Éxito',
        description: 'Biblioteca actualizada',
        color: 'success'
      })
    } catch (error) {
      console.error('Error al refrescar:', error)
    }
  }
}

async function handleRefresh() {
  try {
    await refreshLibrary()
  } catch (error) {
    console.error('Error al refrescar biblioteca:', error)
  }
}
</script>

<template>
  <div style="min-height: 100vh;">
    <div v-if="!isClient" class="py-8 text-center">
      <span>Cargando tu biblioteca...</span>
    </div>
    <ClientOnly @load="isClient = true">
      <div class="flex justify-center w-full min-h-screen p-4">
        <div class="w-full max-w-7xl">
          <div class="text-center mb-8">
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Mi Biblioteca
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Gestiona tu colección personal de libros
            </p>

            <div
              v-if="stats && stats.total > 0"
              class="flex justify-center gap-6 mt-4 text-sm text-gray-600 dark:text-gray-400">
              <span>Total: {{ stats.total }}</span>
              <span>Leídos: {{ stats.read }}</span>
              <span>Leyendo: {{ stats.reading }}</span>
              <span>Por leer: {{ stats.toRead }}</span>
              <span v-if="stats.averageRating > 0">Rating promedio: {{ stats.averageRating }}★</span>
            </div>
          </div>

          <div v-if="isFetching" class="text-center py-12">
            <div class="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <div class="animate-spin w-5 h-5 border-2 border-primary border-r-transparent rounded-full" />
              Cargando biblioteca...
            </div>
          </div>

          <div v-else-if="error" class="text-center py-12">
            <div class="text-red-600 dark:text-red-400 mb-4">
              Error: {{ error }}
            </div>
            <UButton color="primary" icon="i-lucide-refresh-cw" label="Reintentar" @click="handleRefresh" />
          </div>

          <template v-else>
            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6 shadow-sm">
              <div class="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <div class="flex-1 max-w-md">
                  <UInput
                    v-model="searchQuery" placeholder="Buscar por título o autor..." icon="i-lucide-search"
                    class="w-full" />
                </div>
                <div class="flex gap-2 flex-wrap items-center">
                  <UButton
                    :color="showOnlyWithReview ? 'primary' : 'neutral'"
                    :variant="showOnlyWithReview ? 'solid' : 'outline'" icon="i-lucide-message-square"
                    :label="showOnlyWithReview ? 'Con reseña' : 'Todas'" size="sm"
                    @click="showOnlyWithReview = !showOnlyWithReview" />
                  <UButton
                    color="neutral" variant="outline" icon="i-lucide-shuffle" label="Aleatorio" size="sm"
                    :disabled="!selections?.length" @click="randomize" />
                  <UButton
                    color="neutral" variant="outline" icon="i-lucide-refresh-cw" label="Refrescar" size="sm"
                    @click="handleRefresh" />
                  <UButton
                    color="primary" icon="i-lucide-plus" label="Agregar libro" size="sm"
                    class="hidden sm:inline-flex" />
                  <UButton
                    color="primary" icon="i-lucide-plus" size="sm" class="sm:hidden"
                    aria-label="Agregar libro" />
                </div>
              </div>
            </div>

            <div v-if="!selections?.length" class="text-center py-12">
              <div class="text-gray-500 dark:text-gray-400 mb-4">
                Tu biblioteca está vacía
              </div>
              <UButton color="primary" icon="i-lucide-plus" label="Agregar tu primer libro" />
            </div>

            <div v-else-if="filteredSelections.length > 0" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <MyLibraryTable
               :data="filteredSelections"
               :remove-book-from-library="removeBookFromLibrary"
               @edit-review="handleEditReview"
               />
            </div>

            <div v-else class="text-center py-12">
              <div class="text-gray-500 dark:text-gray-400 mb-4">
                {{ searchQuery || showOnlyWithReview ? 'No se encontraron libros con esos criterios' : 'No hay libros que mostrar' }}
              </div>
              <UButton
                v-if="searchQuery || showOnlyWithReview" color="neutral" icon="i-lucide-x"
                label="Limpiar filtros" @click="() => { searchQuery = ''; showOnlyWithReview = false }" />
            </div>
          </template>
        </div>
      </div>
    </ClientOnly>    

    <!-- Modal fuera del ClientOnly y del contenedor principal -->
    <BookReviewModal
      v-model="isReviewModalOpen"
      :selection-data="selectedBookForReview"
    />
  </div>
</template>
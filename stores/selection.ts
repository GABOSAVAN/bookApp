// stores/selection.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Review, Selection } from '~/types/book'

export const useSelectionStore = defineStore('selection', () => {
  // Estado
  const selections = ref<Selection[]>([])
  const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
  const error = ref<string | null>(null)

  // Getters computados
  const isLoading = computed(() => status.value === 'loading')
  const hasSelections = computed(() => selections.value.length > 0)
  const totalBooks = computed(() => selections.value.length)
  
  // Libros por estado
  const readBooks = computed(() => 
    selections.value.filter(s => s.status === 'read' || s.userReview?.rating)
  )
  
  const readingBooks = computed(() => 
    selections.value.filter(s => s.status === 'reading')
  )
  
  const toReadBooks = computed(() => 
    selections.value.filter(s => s.status === 'to-read' || (!s.status && !s.userReview))
  )

  // Estadísticas
  const stats = computed(() => ({
    total: totalBooks.value,
    read: readBooks.value.length,
    reading: readingBooks.value.length,
    toRead: toReadBooks.value.length,
    withReviews: selections.value.filter(s => s.userReview?.description).length,
    averageRating: calculateAverageRating()
  }))

  // Funciones auxiliares
  function calculateAverageRating(): number {
    const reviewedBooks = selections.value.filter(s => s.userReview?.rating)
    if (reviewedBooks.length === 0) return 0
    
    const totalRating = reviewedBooks.reduce((sum, s) => sum + (s.userReview?.rating || 0), 0)
    return Math.round((totalRating / reviewedBooks.length) * 10) / 10
  }

  // Acciones
  function setSelections(newSelections: Selection[]) {
    selections.value = newSelections
    status.value = 'success'
    error.value = null
  }

  // Añadir una nueva selección al array ---
  function addSelection(newSelection: Selection) {
    // Si el libro ya existe, lo actualizamos. Si no, lo agregamos.
    const existingIndex = selections.value.findIndex(s => s._id === newSelection._id);
    if (existingIndex > -1) {
        selections.value.splice(existingIndex, 1, newSelection);
    } else {
        selections.value.push(newSelection);
    }
  }

  function setLoading(loading: boolean) {
    status.value = loading ? 'loading' : 'idle'
  }

  function setError(errorMessage: string) {
    error.value = errorMessage
    status.value = 'error'
  }

  function clearError() {
    error.value = null
  }

  // Buscar una selección por ID del libro
  function findSelectionByBookId(bookId: string): Selection | undefined {
    return selections.value.find(s => s.book_id.id === bookId)
  }

  // Actualizar una selección específica
  function updateSelection(bookId: string, updates: Partial<Selection>) {
    const index = selections.value.findIndex(s => s.book_id.id === bookId)
    
    if (index !== -1) {
      selections.value[index] = { ...selections.value[index], ...updates }
    }
  }

  // Actualizar review de un libro específico
  function updateBookReview(bookId: string, review: Review) {
    const selection = findSelectionByBookId(bookId)
    if (selection) {
      selection.userReview = review
      
      // Actualizar estado basado en el rating
      if (review.rating > 0 && !selection.status) {
        selection.status = 'read'
      }
    }
  }

  // Remover una selección
  function removeSelection(bookId: string) {
    const index = selections.value.findIndex(s => s.book_id.id === bookId)
    
    if (index !== -1) {
      selections.value.splice(index, 1)
    }
  }

  // Limpiar todas las selecciones
  function clearSelections() {
    selections.value = []
    status.value = 'idle'
    error.value = null
  }

  // Reset completo del store
  function $reset() {
    clearSelections()
  }

  return {
    // Estado
    selections,
    status,
    error,
    
    // Getters
    isLoading,
    hasSelections,
    totalBooks,
    readBooks,
    readingBooks,
    toReadBooks,
    stats,
    
    // Acciones
    setSelections,
    addSelection,
    setLoading,
    setError,
    clearError,
    findSelectionByBookId,
    updateSelection,
    updateBookReview,
    removeSelection,
    clearSelections,
    $reset
  }
}, {
  persist: {
    // Solo persistir las selecciones, no el estado de loading/error
    pick: ['selections']
  }
})
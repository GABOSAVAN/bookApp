import type { ListBook } from '~/types/book'

export const useBooksStore = defineStore('books', () => {
  // Estado
  const searchResults = ref<ListBook>([])
  const currentQuery = ref<string>('')
  const loading = ref(false)
  const error = ref<string | null>(null)
  const hasSearched = ref(false)

  // Acciones
  const setSearchResults = (books: ListBook, query: string) => {
    searchResults.value = books
    currentQuery.value = query
    hasSearched.value = true
    error.value = null
  }

  const setLoading = (state: boolean) => {
    loading.value = state
  }

  const setError = (errorMessage: string | null) => {
    error.value = errorMessage
  }

  const clearSearch = () => {
    searchResults.value = []
    currentQuery.value = ''
    hasSearched.value = false
    error.value = null
    loading.value = false
  }

  // Getters
  const hasResults = computed(() => searchResults.value.length > 0)
  const isEmpty = computed(() => hasSearched.value && searchResults.value.length === 0 && !loading.value && !error.value)
  
  return {
    // Estado (readonly para evitar mutaciones directas)
    searchResults: readonly(searchResults),
    currentQuery: readonly(currentQuery),
    loading: readonly(loading),
    error: readonly(error),
    hasSearched: readonly(hasSearched),
    
    // Getters
    hasResults,
    isEmpty,
    
    // Acciones
    setSearchResults,
    setLoading,
    setError,
    clearSearch
  }
})
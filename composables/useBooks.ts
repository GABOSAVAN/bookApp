import type { ListBook } from '~/types/book'

export const useBooks = () => {
  const config = useRuntimeConfig()
  const store = useBooksStore()

  const searchBooks = async (query: string): Promise<void> => {
    // Si ya tenemos esta búsqueda en cache, no hacer nada
    if (store.currentQuery === query && store.hasResults) {
      return
    }

    store.setLoading(true)
    store.setError(null)

    try {
      const url = `${config.public.apiBase}books/search?q=${encodeURIComponent(query)}`
      const data = await $fetch<ListBook>(url)
      // Guardar en el store
      store.setSearchResults(data, query)
    } catch (err: unknown) {
      let errorMessage = 'Error al buscar libros'
      if (err instanceof Error) {
        errorMessage = err.message
      }
      store.setError(errorMessage)
      throw err
    } finally {
      store.setLoading(false)
    }
  }

  return {
    searchBooks
    }
}
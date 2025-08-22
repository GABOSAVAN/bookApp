import type { Book, Review } from '~/types/book'

export const useBookDetail = () => {
  const config = useRuntimeConfig()
  const store = useBookDetailStore()
  const booksStore = useBooksStore()

  const getBookById = async (bookId: string): Promise<void> => {
    // Primero intentar encontrar el libro en los resultados de búsqueda
    const searchResults = booksStore.searchResults as Book[]
    const bookFromSearch = searchResults.find(book => book.id === bookId)
    
    if (bookFromSearch) {
      store.setCurrentBook(bookFromSearch)
      return
    }

    // Si no está en los resultados de búsqueda, hacer llamada a la API
    store.setLoadingBook(true)
    store.setErrorBook(null)

    try {
      const url = `${config.public.apiBase}books/${bookId}`
      const book = await $fetch<Book>(url)
      store.setCurrentBook(book)
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al cargar el libro'
      store.setErrorBook(errorMessage)
      throw err
    } finally {
      store.setLoadingBook(false)
    }
  }

  const getBookReviews = async (bookId: string): Promise<void> => {
    store.setLoadingReviews(true)
    store.setErrorReviews(null)

    try {
      const url = `${config.public.apiBase}books/review/${bookId}`
      const reviews = await $fetch<Review[]>(url)
      store.setReviews(reviews)
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al cargar las reseñas'
      store.setErrorReviews(errorMessage)
      throw err
    } finally {
      store.setLoadingReviews(false)
    }
  }

  const saveReview = async (bookId: string, rating: number, comment: string): Promise<Review> => {
    try {
      const url = `${config.public.apiBase}books/${bookId}/reviews`
      const newReview = await $fetch<Review>(url, {
        method: 'POST',
        body: {
          rating,
          comment
        }
      })
      
      // Actualizar las reseñas agregando la nueva
      const currentReviews = store.reviews as Review[]
      const updatedReviews = [...currentReviews, newReview]
      store.setReviews(updatedReviews)
      
      return newReview
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al guardar la reseña'
      throw new Error(errorMessage)
    }
  }

  return {
    getBookById,
    getBookReviews,
    saveReview
  }
}
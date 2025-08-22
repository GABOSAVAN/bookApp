import type { Book, Review } from '~/types/book'



export const useBookDetailStore = defineStore('bookDetail', () => {
  // Estado del libro actual
  const currentBook = ref<Book | null>(null)
  const reviews = ref<Review[]>([])
  const loadingBook = ref(false)
  const loadingReviews = ref(false)
  const errorBook = ref<string | null>(null)
  const errorReviews = ref<string | null>(null)

  // Acciones
  const setCurrentBook = (book: Book) => {
    currentBook.value = book
    errorBook.value = null
  }

  const setReviews = (bookReviews: Review[]) => {
    reviews.value = bookReviews
    errorReviews.value = null
  }

  const setLoadingBook = (state: boolean) => {
    loadingBook.value = state
  }

  const setLoadingReviews = (state: boolean) => {
    loadingReviews.value = state
  }

  const setErrorBook = (error: string | null) => {
    errorBook.value = error
  }

  const setErrorReviews = (error: string | null) => {
    errorReviews.value = error
  }

  const clearBookDetail = () => {
    currentBook.value = null
    reviews.value = []
    errorBook.value = null
    errorReviews.value = null
    loadingBook.value = false
    loadingReviews.value = false
  }

  // Getters
  const hasReviews = computed(() => reviews.value.length > 0)
  const averageRating = computed(() => {
    if (reviews.value.length === 0) return 0
    const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0)
    return Math.round((sum / reviews.value.length) * 10) / 10
  })

  return {
    // Estado (readonly)
    currentBook: readonly(currentBook),
    reviews: readonly(reviews),
    loadingBook: readonly(loadingBook),
    loadingReviews: readonly(loadingReviews),
    errorBook: readonly(errorBook),
    errorReviews: readonly(errorReviews),
    
    // Getters
    hasReviews,
    averageRating,
    
    // Acciones
    setCurrentBook,
    setReviews,
    setLoadingBook,
    setLoadingReviews,
    setErrorBook,
    setErrorReviews,
    clearBookDetail
  }
})
// composables/useSelection.ts
import { useAuthStore } from '~/stores/auth'
import { useSelectionStore } from '~/stores/selection'
import type { Review, Selection, ApiSelection, ReviewUpdatePayload } from '~/types/book'
import { storeToRefs } from 'pinia'

export const useSelection = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const selectionStore = useSelectionStore()
  const toast = useToast()

  // Función para transformar datos de la API al formato interno
  const transformApiSelection = (apiSelection: ApiSelection): Selection => {
    return {
      _id: apiSelection._id,
      book_id: {
        id: apiSelection.book_id._id, // Usar el _id de la API como id de OpenLibrary
        title: apiSelection.book_id.title,
        author: apiSelection.book_id.author,
        publication_date: apiSelection.book_id.publication_date,
        coverUrl: apiSelection.book_id.coverUrl,
        // Mapear publication_date a year si existe
        year: apiSelection.book_id.publication_date || undefined
      },
      userReview: apiSelection.userReview ? {
        _id: apiSelection.userReview._id,
        rating: apiSelection.userReview.rating,
        private: apiSelection.userReview.private,
        description: apiSelection.userReview.description,
        createdAt: apiSelection.userReview.createdAt,
        updatedAt: apiSelection.userReview.updatedAt
      } : undefined,
      // Determinar estado basado en si tiene review
      status: apiSelection.userReview ? 'read' : 'to-read',
      dateAdded: apiSelection.userReview?.createdAt
    }
  }

  // Obtener headers con autorización
  const getAuthHeaders = () => {
    if (!authStore.token) {
      throw new Error('Usuario no autenticado')
    }
    
    return {
      'Authorization': `Bearer ${authStore.token}`,
      'Content-Type': 'application/json'
    }
  }

  // Obtener la biblioteca del usuario
  const fetchUserLibrary = async (): Promise<Selection[]> => {
    try {
      selectionStore.setLoading(true)
      selectionStore.clearError()

      const url = `${config.public.apiBase}books/my-library`
      
      const response = await $fetch<ApiSelection[]>(url, {
        headers: getAuthHeaders(),
        method: 'GET'
      })

      if (!Array.isArray(response)) {
        throw new Error('Formato de respuesta inválido')
      }

      // Transformar los datos de la API
      const transformedSelections = response.map(transformApiSelection)
      
      // Actualizar el store
      selectionStore.setSelections(transformedSelections)
      
      console.log('Biblioteca cargada exitosamente:', transformedSelections.length, 'libros')
      return transformedSelections

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar la biblioteca'
      console.error('Error al obtener la biblioteca:', error)
      
      selectionStore.setError(errorMessage)
      toast.add({
        title: 'Error',
        description: 'No se pudo cargar tu biblioteca',
        color: 'error',
        orientation: 'horizontal'
      })
      
      throw error
    } finally {
      selectionStore.setLoading(false)
    }
  }

  // Crear o actualizar review de un libro
  const updateBookReview = async (bookId: string, reviewData: ReviewUpdatePayload): Promise<Review> => {
    try {
      const url = `${config.public.apiBase}books/my-library/${bookId}`
      
      const response = await $fetch<{
        _id: string
        rating: number
        private: boolean
        description: string
        createdAt: string
        updatedAt: string
      }>(url, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: {
          description: reviewData.description.trim(),
          rating: reviewData.rating,
          status: reviewData.status
        }
      })

      // Crear objeto Review
      const updatedReview: Review = {
        _id: response._id,
        rating: response.rating,
        private: response.private,
        description: response.description,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt
      }

      // Actualizar el store local
      selectionStore.updateBookReview(bookId, updatedReview)

      toast.add({
        title: 'Éxito',
        description: 'Reseña actualizada correctamente',
        color: 'success',
        orientation: 'horizontal'
      })

      console.log('Review actualizada exitosamente para el libro:', bookId)
      return updatedReview

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar la reseña'
      console.error('Error al actualizar review:', error)
      
      selectionStore.setError(errorMessage)
      toast.add({
        title: 'Error',
        description: 'No se pudo actualizar la reseña',
        color: 'error',
        orientation: 'horizontal'
      })
      
      throw error
    }
  }

  // Eliminar un libro de la biblioteca (si existiera este endpoint)
  const removeBookFromLibrary = async (bookId: string): Promise<void> => {
    try {
      // Nota: Este endpoint no está especificado en los requerimientos
      // pero podría ser útil para futuras funcionalidades
      const url = `${config.public.apiBase}books/my-library/${bookId}`
      
      await $fetch(url, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      // Actualizar el store local
      selectionStore.removeSelection(bookId)

      toast.add({
        title: 'Éxito',
        description: 'Libro eliminado de tu biblioteca',
        color: 'success',
        orientation: 'horizontal'
      })

      console.log('Libro eliminado exitosamente:', bookId)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el libro'
      console.error('Error al eliminar libro:', error)
      
      selectionStore.setError(errorMessage)
      toast.add({
        title: 'Error',
        description: 'No se pudo eliminar el libro',
        color: 'error',
        orientation: 'horizontal'
      })
      
      throw error
    }
  }

  // Refrescar la biblioteca
  const refreshLibrary = async (): Promise<Selection[]> => {
    console.log('Refrescando biblioteca...')
    return await fetchUserLibrary()
  }

  // Verificar si el usuario está autenticado
  const checkAuthentication = (): boolean => {
    if (!authStore.isAuthenticated) {
      console.error('Usuario no autenticado')
      toast.add({
        title: 'Error de autenticación',
        description: 'Debes iniciar sesión para acceder a tu biblioteca',
        color: 'error',
        orientation: 'horizontal'
      })
      return false
    }
    return true
  }

  const { selections, isLoading, error, stats } = storeToRefs(selectionStore)

  return {
    // Estado del store (sin readonly, ya son reactivos)
    selections,
    isLoading,
    error,
    stats,
    
    // Métodos principales
    fetchUserLibrary,
    updateBookReview,
    removeBookFromLibrary,
    refreshLibrary,
    checkAuthentication,
    
    // Métodos del store
    findSelectionByBookId: selectionStore.findSelectionByBookId,
    clearSelections: selectionStore.clearSelections
  }
}
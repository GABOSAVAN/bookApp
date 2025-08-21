import type { ListBook } from '~/types/book'

export const useBooks = () => {
  const config = useRuntimeConfig()

  const searchBooks = async (query?: string): Promise<ListBook> => {
    const url = query 
      ? `${config.public.apiBase}books/search?q=${encodeURIComponent(query)}`
      : `${config.public.apiBase}books/search`

    const data = await $fetch<ListBook>(url)
    console.log(`Resultados de busqueda: ${data}`);
    return data
  }

  return {
    searchBooks
  }
}
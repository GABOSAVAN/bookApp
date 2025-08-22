export interface Book {
    id: string
    title: string
    author: string
    cover_id: number
    publication_date: number
    coverUrl: string
  }

  export type ListBook = Boot[]

  export interface Review {
    id: string
    bookId: string
    userId: string
    rating: number
    description: string
    createdAt: string
  }
export interface Book {
    id: string
    title: string
    author: string
    cover_id: number
    publication_date: number
    coverUrl: string
  }

  export type ListBook = Boot[]
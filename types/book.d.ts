// types/book.ts
export interface Book {
  id: string // Siempre será el ID de OpenLibrary
  title: string
  author: string
  cover_id?: number
  publication_date?: number | null
  coverUrl?: string
  
  // Campos opcionales adicionales para el componente LibraryCard
  year?: number
  genre?: string
  pages?: number
  isbn?: string
  language?: string
  publisher?: string
  dateAdded?: string | Date
  status?: 'read' | 'reading' | 'to-read'
}

export type ListBook = Book[]

// types/review.ts
export interface Review {
  _id: string // Siempre será el _id de MongoDB
  bookId?: string
  userId?: string
  rating: number
  private: boolean
  description: string
  createdAt: string
  updatedAt?: string
}

// types/selection.ts
export interface Selection {
  _id: string
  book_id: Book
  userReview?: Review
  
  // Campos opcionales adicionales
  dateAdded?: string
  status?: 'read' | 'reading' | 'to-read'
  personalNotes?: string
  isFavorite?: boolean
}

interface ReviewUpdatePayload {
  private?: boolean
  description: string
  rating: number
  status?: 'read' | 'reading' | 'to-read'
}

interface ApiSelection {
  _id: string
  book_id: {
    _id: string
    title: string
    author: string
    publication_date: number | null
    coverUrl: string
  }
  userReview?: {
    _id: string
    createdAt: string
    description: string
    private: boolean
    rating: number
    updatedAt?: string
  }
}
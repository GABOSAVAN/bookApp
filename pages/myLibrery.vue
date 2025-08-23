<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { upperFirst } from 'scule'
import type { TableColumn } from '@nuxt/ui'
import { useClipboard } from '@vueuse/core'
import type { Book } from '~/types/book'

const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()
const { copy } = useClipboard()

const books = ref<Book[]>([
  { 
    id: 1,
    title: 'El Señor de los Anillos',
    author: 'J.R.R. Tolkien',
    year: 1954,
    review: 'Una obra maestra épica que cautiva desde la primera página.',
    rating: 5,
    genre: 'Fantasía',
    pages: 1216,
    isbn: '9780544003415',
    language: 'Español',
    publisher: 'Minotauro',
    dateAdded: new Date('2024-01-15'),
    status: 'read'
  },
  { 
    id: 2,
    title: 'Cien años de soledad',
    author: 'Gabriel García Márquez',
    year: 1967,
    review: 'Una narrativa magistral del realismo mágico.',
    rating: 5,
    genre: 'Realismo mágico',
    pages: 417,
    isbn: '9780307474728',
    language: 'Español',
    publisher: 'Sudamericana',
    dateAdded: new Date('2024-02-10'),
    status: 'reading'
  },
  { 
    id: 3,
    title: '1984',
    author: 'George Orwell',
    year: 1949,
    review: 'Una distopía inquietante y relevante.',
    rating: 4,
    genre: 'Distopía',
    pages: 328,
    isbn: '9780451524935',
    language: 'Inglés',
    publisher: 'Signet Classics',
    dateAdded: new Date('2024-03-05'),
    status: 'to-read'
  }
]);

const columns: TableColumn<Book>[] = [{
  id: 'select',
  header: ({ table }) => h(UCheckbox, {
    'modelValue': table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
    'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value),
    'aria-label': 'Seleccionar todos'
  }),
  cell: ({ row }) => h(UCheckbox, {
    'modelValue': row.getIsSelected(),
    'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
    'aria-label': 'Seleccionar fila'
  }),
  enableSorting: false,
  enableHiding: false,
  size: 40
}, {
  accessorKey: 'id',
  header: '#',
  cell: ({ row }) => `#${row.getValue('id')}`,
  size: 60
}, {
  accessorKey: 'title',
  header: ({ column }) => {
    const isSorted = column.getIsSorted()
    return h(UButton, {
      color: 'neutral',
      variant: 'ghost',
      label: 'Título',
      icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
      class: '-mx-2.5 text-left justify-start',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
    })
  },
  cell: ({ row }) => h('div', { 
    class: 'font-medium text-gray-900 dark:text-gray-100 max-w-[200px] truncate',
    title: row.getValue('title') 
  }, row.getValue('title')),
  minSize: 150
}, {
  accessorKey: 'author',
  header: ({ column }) => {
    const isSorted = column.getIsSorted()
    return h(UButton, {
      color: 'neutral',
      variant: 'ghost',
      label: 'Autor',
      icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
      class: '-mx-2.5 text-left justify-start',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
    })
  },
  cell: ({ row }) => h('div', { 
    class: 'text-gray-600 dark:text-gray-400 max-w-[150px] truncate',
    title: row.getValue('author')
  }, row.getValue('author')),
  minSize: 120
}, {
  accessorKey: 'year',
  header: 'Año',
  cell: ({ row }) => h('div', { class: 'text-center' }, row.getValue('year')),
  size: 80
}, {
  accessorKey: 'rating',
  header: 'Rating',
  cell: ({ row }) => {
    const rating = row.getValue('rating') as number
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating)
    return h('div', { 
      class: 'text-yellow-500 text-center font-mono',
      title: `${rating}/5 estrellas`
    }, stars)
  },
  size: 100
}, {
  accessorKey: 'status',
  header: 'Estado',
  cell: ({ row }) => {
    const status = row.getValue('status') as string
    const statusConfig = {
      'read': { color: 'success' as const, label: 'Leído' },
      'reading': { color: 'warning' as const, label: 'Leyendo' },
      'to-read': { color: 'neutral' as const, label: 'Por leer' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'neutral' as const, label: status }
    
    return h(UBadge, { 
      variant: 'subtle', 
      color: config.color,
      class: 'text-xs'
    }, () => config.label)
  },
  size: 100
}, {
  accessorKey: 'dateAdded',
  header: 'Agregado',
  cell: ({ row }) => {
    const date = new Date(row.getValue('dateAdded'))
    return h('div', { 
      class: 'text-sm text-gray-500 dark:text-gray-400',
      title: date.toLocaleString('es-ES')
    }, date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    }))
  },
  size: 100
}, {
  id: 'actions',
  enableHiding: false,
  cell: ({ row }) => {
    const book = row.original as Book
    const items = [{
      type: 'label',
      label: 'Acciones'
    }, {
      label: 'Copiar ID',
      icon: 'i-lucide-copy',
      onSelect() {
        copy(book.id.toString())
        toast.add({
          title: 'ID copiado',
          description: 'El ID del libro se copió al portapapeles',
          color: 'success' as const,
          icon: 'i-lucide-circle-check'
        })
      }
    }, {
      label: 'Ver detalles',
      icon: 'i-lucide-eye',
      onSelect() {
        // Navegar a detalles del libro
        console.log('Ver detalles de:', book.title)
      }
    }, {
      label: row.getIsExpanded() ? 'Colapsar' : 'Expandir',
      icon: row.getIsExpanded() ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down',
      onSelect() {
        row.toggleExpanded()
      }
    }, {
      type: 'separator'
    }, {
      label: 'Editar',
      icon: 'i-lucide-edit',
      onSelect() {
        console.log('Editar libro:', book.title)
      }
    }, {
      label: 'Eliminar',
      icon: 'i-lucide-trash-2',
      class: 'text-red-600 dark:text-red-400',
      onSelect() {
        console.log('Eliminar libro:', book.title)
      }
    }]

    return h('div', { class: 'text-right' }, h(UDropdownMenu, {
      'content': {
        align: 'end'
      },
      items,
      'aria-label': 'Menú de acciones'
    }, () => h(UButton, {
      'icon': 'i-lucide-ellipsis-vertical',
      'color': 'neutral',
      'variant': 'ghost',
      'size': 'sm',
      'class': 'ml-auto',
      'aria-label': 'Menú de acciones'
    })))
  },
  size: 60
}]

const table = useTemplateRef('table')
const searchQuery = ref('')

// Filtrar libros por título o autor
const filteredBooks = computed(() => {
  if (!searchQuery.value) return books.value
  
  const query = searchQuery.value.toLowerCase()
  return books.value.filter(book => 
    book.title.toLowerCase().includes(query) ||
    book.author.toLowerCase().includes(query)
  )
})

function randomize() {
  books.value = [...books.value].sort(() => Math.random() - 0.5)
}

function clearSelection() {
  table.value?.tableApi?.resetRowSelection()
}
</script>

<template>
  <div class="flex justify-center w-full min-h-screen p-4">
    <div class="w-full max-w-7xl">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Mi Biblioteca
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Gestiona tu colección personal de libros
        </p>
      </div>

      <!-- Actions Bar -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6 shadow-sm">
        <div class="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <!-- Search Input -->
          <div class="flex-1 max-w-md">
            <UInput
              v-model="searchQuery"
              placeholder="Buscar por título o autor..."
              icon="i-lucide-search"
              class="w-full"
            />
          </div>
          
          <!-- Action Buttons -->
          <div class="flex gap-2 flex-wrap">
            <UButton 
              color="neutral" 
              variant="outline"
              icon="i-lucide-shuffle"
              label="Aleatorio" 
              @click="randomize"
              size="sm"
            />
            
            <UButton 
              color="neutral" 
              variant="outline"
              icon="i-lucide-x-circle"
              label="Limpiar selección" 
              @click="clearSelection"
              size="sm"
            />
            
            <UButton 
              color="primary"
              icon="i-lucide-plus"
              label="Agregar libro"
              size="sm"
              class="hidden sm:inline-flex"
            />
            
            <!-- Mobile add button -->
            <UButton 
              color="primary"
              icon="i-lucide-plus"
              size="sm"
              class="sm:hidden"
              aria-label="Agregar libro"
            />
          </div>
        </div>
      </div>

      <!-- Table Container -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <!-- Mobile Cards (visible only on small screens) -->
        <div class="block md:hidden">
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <div v-for="book in filteredBooks" :key="book.id" class="p-4">
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
                    {{ book.title }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ book.author }} • {{ book.year }}
                  </p>
                </div>
                <UDropdownMenu
                  :items="[
                    { type: 'label', label: 'Acciones' },
                    { label: 'Ver detalles', icon: 'i-lucide-eye' },
                    { label: 'Editar', icon: 'i-lucide-edit' },
                    { type: 'separator' },
                    { label: 'Eliminar', icon: 'i-lucide-trash-2', class: 'text-red-600' }
                  ]"
                >
                  <UButton
                    icon="i-lucide-ellipsis-vertical"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                  />
                </UDropdownMenu>
              </div>
              
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <UBadge 
                    :color="book.status === 'read' ? 'success' : book.status === 'reading' ? 'warning' : 'neutral'"
                    variant="subtle"
                    size="xs"
                  >
                    {{ book.status === 'read' ? 'Leído' : book.status === 'reading' ? 'Leyendo' : 'Por leer' }}
                  </UBadge>
                  <span class="text-yellow-500 text-sm">
                    {{ '★'.repeat(book.rating) + '☆'.repeat(5 - book.rating) }}
                  </span>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  #{{ book.id }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop Table (hidden on small screens) -->
        <div class="hidden md:block overflow-x-auto">
          <UTable 
            ref="table" 
            :data="filteredBooks" 
            :columns="columns" 
            class="w-full"
          >
            <template #expanded="{ row }">
              <div class="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span class="font-medium text-gray-700 dark:text-gray-300">Género:</span>
                    <span class="ml-2 text-gray-600 dark:text-gray-400">{{ row.original.genre }}</span>
                  </div>
                  <div>
                    <span class="font-medium text-gray-700 dark:text-gray-300">Páginas:</span>
                    <span class="ml-2 text-gray-600 dark:text-gray-400">{{ row.original.pages }}</span>
                  </div>
                  <div>
                    <span class="font-medium text-gray-700 dark:text-gray-300">ISBN:</span>
                    <span class="ml-2 text-gray-600 dark:text-gray-400 font-mono">{{ row.original.isbn }}</span>
                  </div>
                  <div>
                    <span class="font-medium text-gray-700 dark:text-gray-300">Idioma:</span>
                    <span class="ml-2 text-gray-600 dark:text-gray-400">{{ row.original.language }}</span>
                  </div>
                  <div>
                    <span class="font-medium text-gray-700 dark:text-gray-300">Editorial:</span>
                    <span class="ml-2 text-gray-600 dark:text-gray-400">{{ row.original.publisher }}</span>
                  </div>
                  <div>
                    <span class="font-medium text-gray-700 dark:text-gray-300">Agregado:</span>
                    <span class="ml-2 text-gray-600 dark:text-gray-400">{{ new Date(row.original.dateAdded).toLocaleDateString('es-ES') }}</span>
                  </div>
                </div>
                <div v-if="row.original.review" class="mt-4">
                  <span class="font-medium text-gray-700 dark:text-gray-300">Reseña:</span>
                  <p class="mt-1 text-gray-600 dark:text-gray-400 italic">{{ row.original.review }}</p>
                </div>
              </div>
            </template>
          </UTable>
        </div>

        <!-- Footer Stats -->
        <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div>
              {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} de
              {{ filteredBooks.length }} libro(s) seleccionado(s)
            </div>
            <div class="flex items-center gap-4">
              <span>Total: {{ books.length }} libros</span>
              <span>•</span>
              <span>Mostrando: {{ filteredBooks.length }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Selection } from '~/types/book'

const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UInput = resolveComponent('UInput')
const UTable = resolveComponent('UTable')

const toast = useToast()

const {
  selections,
  error,
  stats,
  fetchUserLibrary,
  removeBookFromLibrary,
  refreshLibrary,
  checkAuthentication,
} = useSelection()

// Cargar la biblioteca del usuario usando useAsyncData para Server-Side Rendering (SSR)
// Nuxt esperará a que esta función se complete antes de renderizar la página
const { pending } = await useAsyncData(
  'user-library-data',
  async () => {
    // Retornamos la data para que el estado de 'pending' funcione correctamente
    if (checkAuthentication()) {
      return await fetchUserLibrary()
    }
    return [] // Retornar un array vacío si no está autenticado
  }
)

const table = ref()
const searchQuery = ref('')
const showOnlyWithReview = ref(false)

const filteredSelections = computed(() => {
  let filtered = selections || []
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(selection => 
      selection.book_id?.title?.toLowerCase().includes(query) ||
      selection.book_id?.author?.toLowerCase().includes(query)
    )
  }
  
  if (showOnlyWithReview.value) {
    filtered = filtered.filter(selection => 
      selection.userReview && 
      selection.userReview.description && 
      selection.userReview.description.trim().length > 0
    )
  }
  
  return filtered
})

const columns: TableColumn<Selection>[] = [{
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
  accessorKey: 'title',
  accessorFn: (row: Selection) => row.book_id?.title,
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
    title: row.original.book_id?.title 
  }, row.original.book_id?.title),
  minSize: 150
}, {
  accessorKey: 'author',
  accessorFn: (row: Selection) => row.book_id?.author,
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
    title: row.original.book_id?.author
  }, row.original.book_id?.author),
  minSize: 120
}, {
  accessorKey: 'rating',
  accessorFn: (row: Selection) => row.userReview?.rating || 0,
  header: 'Rating',
  cell: ({ row }) => {
    const rating = row.original.userReview?.rating || 0
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
    const status = row.original.status || 'to-read'
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
  id: 'actions',
  enableHiding: false,
  cell: ({ row }) => {
    const selection = row.original as Selection
    const items = [{
      type: 'label',
      label: 'Acciones'
    }, {
      label: 'Ver detalles',
      icon: 'i-lucide-eye',
      onSelect() {
        console.log('Ver detalles de:', selection.book_id?.title)
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
      label: 'Editar reseña',
      icon: 'i-lucide-edit',
      onSelect() {
        console.log('Editar reseña:', selection.book_id?.title)
      }
    }, {
      label: 'Eliminar',
      icon: 'i-lucide-trash-2',
      class: 'text-red-600 dark:text-red-400',
      onSelect() {
        handleRemoveBook(selection.book_id?.id as string)
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

// Funciones de manejo
async function randomize() {
  if (selections && selections.length > 0) {
    try {
      await refreshLibrary()
      toast.add({
        title: 'Éxito',
        description: 'Biblioteca actualizada',
        color: 'success'
      })
    } catch (error) {
      console.error('Error al refrescar:', error)
    }
  }
}

function clearSelection() {
  table.value?.tableApi?.resetRowSelection()
}

async function handleRemoveBook(bookId: string) {
  try {
    await removeBookFromLibrary(bookId)
  } catch (error) {
    console.error('Error al eliminar libro:', error)
  }
}

async function handleRefresh() {
  try {
    await refreshLibrary()
  } catch (error) {
    console.error('Error al refrescar biblioteca:', error)
  }
}

function getPublicationYear(selection: Selection): number | string {
  return selection.book_id?.publication_date || selection.book_id?.year || 'N/A'
}

function getStatusLabel(status?: string): string {
  const statusMap = {
    'read': 'Leído',
    'reading': 'Leyendo',
    'to-read': 'Por leer'
  }
  return statusMap[status as keyof typeof statusMap] || 'Por leer'
}

function getStatusColor(status?: string): 'success' | 'warning' | 'neutral' {
  const colorMap = {
    'read': 'success' as const,
    'reading': 'warning' as const,
    'to-read': 'neutral' as const
  }
  return colorMap[status as keyof typeof colorMap] || 'neutral'
}

watch(selections, (newSelections) => {
  console.log('Selections actualizadas:', newSelections)
}, { deep: true })

watch(filteredSelections, (newFiltered) => {
  console.log('Filtered selections:', newFiltered)
})
</script>

<template>
  <div class="flex justify-center w-full min-h-screen p-4">
    <div class="w-full max-w-7xl">
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Mi Biblioteca
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Gestiona tu colección personal de libros
        </p>
        
        <div v-if="stats && stats.total > 0" class="flex justify-center gap-6 mt-4 text-sm text-gray-600 dark:text-gray-400">
          <span>Total: {{ stats.total }}</span>
          <span>Leídos: {{ stats.read }}</span>
          <span>Leyendo: {{ stats.reading }}</span>
          <span>Por leer: {{ stats.toRead }}</span>
          <span v-if="stats.averageRating > 0">Rating promedio: {{ stats.averageRating }}★</span>
        </div>
      </div>

      <div v-if="pending" class="text-center py-12">
        <div class="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <div class="animate-spin w-5 h-5 border-2 border-primary border-r-transparent rounded-full"/>
          Cargando biblioteca...
        </div>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-600 dark:text-red-400 mb-4">
          Error: {{ error }}
        </div>
        <UButton 
          color="primary"
          icon="i-lucide-refresh-cw"
          label="Reintentar"
          @click="handleRefresh"
        />
      </div>

      <template v-else>
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6 shadow-sm">
          <div class="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div class="flex-1 max-w-md">
              <UInput
                v-model="searchQuery"
                placeholder="Buscar por título o autor..."
                icon="i-lucide-search"
                class="w-full"
              />
            </div>
            
            <div class="flex gap-2 flex-wrap items-center">
              <UButton 
                :color="showOnlyWithReview ? 'primary' : 'neutral'" 
                :variant="showOnlyWithReview ? 'solid' : 'outline'"
                icon="i-lucide-message-square"
                :label="showOnlyWithReview ? 'Con reseña' : 'Todas'"
                size="sm"
                @click="showOnlyWithReview = !showOnlyWithReview"
              />
              
              <UButton 
                color="neutral" 
                variant="outline"
                icon="i-lucide-shuffle"
                label="Aleatorio" 
                size="sm"
                :disabled="!selections?.length"
                @click="randomize"
              />
              
              <UButton 
                color="neutral" 
                variant="outline"
                icon="i-lucide-refresh-cw"
                label="Refrescar" 
                size="sm"
                @click="handleRefresh"
              />
              
              <UButton 
                color="neutral" 
                variant="outline"
                icon="i-lucide-x-circle"
                label="Limpiar selección" 
                size="sm"
                @click="clearSelection"
              />
              
              <UButton 
                color="primary"
                icon="i-lucide-plus"
                label="Agregar libro"
                size="sm"
                class="hidden sm:inline-flex"
              />
              
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

        <div v-if="!selections?.length" class="text-center py-12">
          <div class="text-gray-500 dark:text-gray-400 mb-4">
            Tu biblioteca está vacía
          </div>
          <UButton 
            color="primary"
            icon="i-lucide-plus"
            label="Agregar tu primer libro"
          />
        </div>

        <div v-else-if="filteredSelections.length > 0" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
         
          <div class="block md:hidden">
            <div class="divide-y divide-gray-200 dark:divide-gray-700">
              <div v-for="selection in filteredSelections" :key="selection._id" class="p-4">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
                      {{ selection.book_id?.title }}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ selection.book_id?.author }}
                    </p>
                  </div>
                  <UDropdownMenu
                    :items="[
                      { type: 'label', label: 'Acciones' },
                      { label: 'Ver detalles', icon: 'i-lucide-eye' },
                      { label: 'Editar reseña', icon: 'i-lucide-edit' },
                      { type: 'separator' },
                      { label: 'Eliminar', icon: 'i-lucide-trash-2', class: 'text-red-600', onSelect: () => handleRemoveBook(selection.book_id?.id as string) }
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
                      :color="getStatusColor(selection.status)"
                      variant="subtle"
                      size="xs"
                    >
                      {{ getStatusLabel(selection.status) }}
                    </UBadge>
                    <span class="text-yellow-500 text-sm">
                      {{ '★'.repeat(selection.userReview?.rating || 0) + '☆'.repeat(5 - (selection.userReview?.rating || 0)) }}
                    </span>
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ getPublicationYear(selection) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="hidden md:block overflow-x-auto">
            <UTable 
              ref="table" 
              :data="filteredSelections" 
              :columns="columns" 
              class="w-full"
            >
              <template #expanded="{ row }">
                <div class="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span class="font-medium text-gray-700 dark:text-gray-300">Año de publicación:</span>
                      <span class="ml-2 text-gray-600 dark:text-gray-400">{{ getPublicationYear(row.original) }}</span>
                    </div>
                    
                    <div v-if="row.original.book_id?.genre">
                      <span class="font-medium text-gray-700 dark:text-gray-300">Género:</span>
                      <span class="ml-2 text-gray-600 dark:text-gray-400">{{ row.original.book_id.genre }}</span>
                    </div>
                    
                    <div v-if="row.original.book_id?.pages">
                      <span class="font-medium text-gray-700 dark:text-gray-300">Páginas:</span>
                      <span class="ml-2 text-gray-600 dark:text-gray-400">{{ row.original.book_id.pages }}</span>
                    </div>
                    
                    <div v-if="row.original.book_id?.isbn">
                      <span class="font-medium text-gray-700 dark:text-gray-300">ISBN:</span>
                      <span class="ml-2 text-gray-600 dark:text-gray-400 font-mono">{{ row.original.book_id.isbn }}</span>
                    </div>
                    
                    <div v-if="row.original.book_id?.language">
                      <span class="font-medium text-gray-700 dark:text-gray-300">Idioma:</span>
                      <span class="ml-2 text-gray-600 dark:text-gray-400">{{ row.original.book_id.language }}</span>
                    </div>
                    
                    <div v-if="row.original.book_id?.publisher">
                      <span class="font-medium text-gray-700 dark:text-gray-300">Editorial:</span>
                      <span class="ml-2 text-gray-600 dark:text-gray-400">{{ row.original.book_id.publisher }}</span>
                    </div>
                    
                    <div v-if="row.original.dateAdded">
                      <span class="font-medium text-gray-700 dark:text-gray-300">Agregado:</span>
                      <span class="ml-2 text-gray-600 dark:text-gray-400">{{ new Date(row.original.dateAdded).toLocaleDateString('es-ES') }}</span>
                    </div>
                  </div>
                  
                  <div v-if="row.original.userReview?.description && row.original.userReview.description.trim()" class="mt-4">
                    <span class="font-medium text-gray-700 dark:text-gray-300">Reseña:</span>
                    <p class="mt-1 text-gray-600 dark:text-gray-400 italic">{{ row.original.userReview.description }}</p>
                  </div>
                </div>
              </template>
            </UTable>
          </div>

          <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div>
                {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} de
                {{ filteredSelections.length }} libro(s) seleccionado(s)
              </div>
              <div class="flex items-center gap-4">
                <span>Total: {{ selections?.length || 0 }} libros</span>
                <span>•</span>
                <span>Mostrando: {{ filteredSelections.length }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <div class="text-gray-500 dark:text-gray-400 mb-4">
            {{ searchQuery || showOnlyWithReview ? 'No se encontraron libros con esos criterios' : 'No hay libros que mostrar' }}
          </div>
          <UButton 
            v-if="searchQuery || showOnlyWithReview"
            color="neutral"
            icon="i-lucide-x"
            label="Limpiar filtros"
            @click="() => { searchQuery = ''; showOnlyWithReview = false }"
          />
        </div>        
      </template>
      <h1>
        {{ selections[8] }}
      </h1>
    </div>
  </div>
</template>
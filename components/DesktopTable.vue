<script setup lang="ts">
import { h, resolveComponent, computed, ref } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Selection } from '~/types/book'
import { useRouter } from 'vue-router'

const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UTable = resolveComponent('UTable')
const router = useRouter()

const props = defineProps<{
  data: Selection[]
  removeBookFromLibrary: (bookId: string) => Promise<void>
}>()

const table = ref()
defineExpose({ tableApi: computed(() => table.value?.tableApi) })

function getPublicationYear(selection: Selection): number | string {
  return selection.book_id?.publication_date || selection.book_id?.year || 'N/A'
}

function getStatusColor(status?: string): 'success' | 'warning' | 'neutral' {
  const colorMap = {
    'read': 'success' as const,
    'reading': 'warning' as const,
    'to-read': 'neutral' as const
  }
  return colorMap[status as keyof typeof colorMap] || 'neutral'
}

function getStatusLabel(status?: string): string {
  const statusMap = {
    'read': 'Leído',
    'reading': 'Leyendo',
    'to-read': 'Por leer'
  }
  return statusMap[status as keyof typeof statusMap] || 'Por leer'
}

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
    const config = {
      'read': { color: 'success' as const, label: 'Leído' },
      'reading': { color: 'warning' as const, label: 'Leyendo' },
      'to-read': { color: 'neutral' as const, label: 'Por leer' }
    }[status] || { color: 'neutral' as const, label: status }
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
        router.push(`/detailBook/${selection.book_id?.id}`)
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
        // Lógica para editar la reseña
      }
    }, {
      label: 'Eliminar',
      icon: 'i-lucide-trash-2',
      class: 'text-red-600 dark:text-red-400',
      onSelect() {
        props.removeBookFromLibrary(selection.book_id?.id as string)
      }
    }]
    return h('div', { class: 'text-right' }, h(UDropdownMenu, {
      'content': { align: 'end' },
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
</script>

<template>
  <div class="overflow-x-auto">
    <UTable ref="table" :data="props.data" :columns="columns" class="w-full">
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
</template>
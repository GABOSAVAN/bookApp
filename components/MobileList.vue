<script setup lang="ts">
import { resolveComponent } from 'vue'
import type { Selection } from '~/types/book'
import { useRouter } from 'vue-router'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const router = useRouter()

const props = defineProps<{
  data: Selection[]
  removeBookFromLibrary: (bookId: string) => Promise<void>
}>()

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
</script>

<template>
  <div class="divide-y divide-gray-200 dark:divide-gray-700">
    <div v-for="selection in props.data" :key="selection._id" class="p-4">
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">{{ selection.book_id?.title }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ selection.book_id?.author }}</p>
        </div>
        <UDropdownMenu 
          :items="[
            { type: 'label', label: 'Acciones' },
            { label: 'Ver detalles', icon: 'i-lucide-eye', onSelect: () => router.push(`/detailBook/${selection.book_id?.id}`) },
            { label: 'Editar reseña', icon: 'i-lucide-edit', onSelect: () => console.log('Editar reseña:', selection.book_id?.title) },
            { type: 'separator' },
            { label: 'Eliminar', icon: 'i-lucide-trash-2', class: 'text-red-600', onSelect: () => props.removeBookFromLibrary(selection.book_id?.id as string) }
          ]">
          <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="sm" />
        </UDropdownMenu>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UBadge :color="getStatusColor(selection.status)" variant="subtle" size="xs">{{ getStatusLabel(selection.status) }}</UBadge>
          <span class="text-yellow-500 text-sm">{{ '★'.repeat(selection.userReview?.rating || 0) + '☆'.repeat(5 - (selection.userReview?.rating || 0)) }}</span>
        </div>
        <span class="text-xs text-gray-500 dark:text-gray-400">{{ getPublicationYear(selection) }}</span>
      </div>
    </div>
  </div>
</template>
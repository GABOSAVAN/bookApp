<script setup lang="ts">
import { computed } from 'vue'
import type { Selection } from '~/types/book'
import { useRouter } from 'vue-router'

const router = useRouter()

// 1. PROPS: Recibe los datos y la función de eliminación del padre.
const props = defineProps<{
  data: Selection[]
  // Función recibida que ejecutará la lógica de useSelection.removeBookFromLibrary
  removeBookFromLibrary: (bookId: string) => Promise<void> 
}>()

// 2. EMITS: Declara el evento para notificar al padre sobre la edición.
const emit = defineEmits(['edit-review'])

// --- Funciones de Presentación (Formato y Estilo) ---

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

const hasData = computed(() => {
  return props.data && props.data.length > 0
})

// --- Lógica de Acciones (Delegación) ---

/**
 * 💡 FUNCIÓN DE ELIMINACIÓN OPERATIVA
 * Llama a la función recibida por props, que a su vez llama a useSelection.removeBookFromLibrary.
 */
const handleRemoveBook = (bookId: string | undefined) => {
  console.log("Eliminando libro con ID:", bookId);
    if (!bookId) return;
    props.removeBookFromLibrary(bookId);
}

/**
 * 💡 FUNCIÓN DE EDICIÓN OPERATIVA
 * Emite un evento, pasando el objeto de selección completo. El componente padre
 * (donde se usa useSelection) manejará la lógica de actualización (updateBookReview).
 */
const handleEditReview = (selection: Selection) => {
    emit('edit-review', selection);
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">      

    <div v-if="!hasData" class="p-8 text-center">
      <div class="text-gray-500 dark:text-gray-400">
        <Icon name="i-lucide-book-open" class="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p class="text-lg font-medium mb-2">No hay libros para mostrar</p>
        <p class="text-sm">Los libros aparecerán aquí cuando estén disponibles.</p>
      </div>
    </div>

    <template v-else>
      <div class="hidden md:block overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Título
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Autor
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">
                Rating
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-28">
                Estado
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="selection in props.data" :key="selection._id" class="hover:bg-gray-50 dark:hover:bg-gray-900/50">
              
              <td class="px-6 py-4 whitespace-nowrap">
                <div 
                  class="font-medium text-gray-900 dark:text-gray-100 max-w-[200px] truncate" 
                  :title="selection.book_id?.title"
                >
                  {{ selection.book_id?.title || 'Sin título' }}
                </div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <div 
                  class="text-gray-600 dark:text-gray-400 max-w-[150px] truncate" 
                  :title="selection.book_id?.author"
                >
                  {{ selection.book_id?.author || 'Autor desconocido' }}
                </div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="text-yellow-500 font-mono" :title="`${selection.userReview?.rating || 0}/5 estrellas`">
                  {{ '★'.repeat(selection.userReview?.rating || 0) + '☆'.repeat(5 - (selection.userReview?.rating || 0)) }}
                </div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge
                  :color="getStatusColor(selection.status)"
                  variant="subtle"
                  size="xs"
                >
                  {{ getStatusLabel(selection.status) }}
                </UBadge>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <UDropdownMenu 
                  :items="[
                    { type: 'label', label: 'Acciones' },
                    { label: 'Ver detalles', icon: 'i-lucide-eye', onSelect: () => router.push(`/detailBook/${selection.book_id?.id}`) },
                    { type: 'separator' },
                    // Edición: Emite el evento 'edit-review' al padre.
                    { label: 'Editar reseña', icon: 'i-lucide-edit', onSelect: () => handleEditReview(selection) },
                    // Eliminación: Llama a la función del padre.
                    { label: 'Eliminar', icon: 'i-lucide-trash-2', onSelect: () => handleRemoveBook(selection.book_id?.id), class: 'text-red-600 dark:text-red-400' }
                  ]"
                >
                  <UButton
                    icon="i-lucide-more-vertical"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                  />
                </UDropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="block md:hidden divide-y divide-gray-200 dark:divide-gray-700">
        <div v-for="selection in props.data" :key="selection._id" class="p-4">
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
                {{ selection.book_id?.title || 'Sin título' }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ selection.book_id?.author || 'Autor desconocido' }}
              </p>
            </div>
            <UDropdownMenu 
              :items="[
                { type: 'label', label: 'Acciones' },
                { label: 'Ver detalles', icon: 'i-lucide-eye', onSelect: () => router.push(`/detailBook/${selection.book_id?.id}`) },
                { type: 'separator' },
                { label: 'Editar reseña', icon: 'i-lucide-edit', onSelect: () => handleEditReview(selection) },
                { label: 'Eliminar', icon: 'i-lucide-trash-2', onSelect: () => handleRemoveBook(selection.book_id?.id), class: 'text-red-600' }
              ]"
            >
              <UButton icon="i-lucide-more-vertical" color="neutral" variant="ghost" size="sm" />
            </UDropdownMenu>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UBadge :color="getStatusColor(selection.status)" variant="subtle" size="xs">
                {{ getStatusLabel(selection.status) }}
              </UBadge>
              <span class="text-yellow-500 text-sm">
                {{ '★'.repeat(selection.userReview?.rating || 0) + '☆'.repeat(5 - (selection.userReview?.rating || 0)) }}
              </span>
            </div>
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ getPublicationYear(selection) }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
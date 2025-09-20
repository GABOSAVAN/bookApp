<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Selection } from '~/types/book'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
  data: Selection[]
  removeBookFromLibrary: (bookId: string) => Promise<void>
}>()

console.log("MyLibraryTable - props data:", props.data)

const emit = defineEmits(['edit-review'])

const selectedRows = ref([])

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

// Verificar si hay data disponible
const hasData = computed(() => {
  const result = props.data && props.data.length > 0
  console.log("MyLibraryTable - hasData:", result, "length:", props.data?.length)
  return result
})

// Actions para cada libro - ELIMINADO ya que usaremos UDropdownMenu directamente
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">      

    <!-- Mostrar mensaje cuando no hay data -->
    <div v-if="!hasData" class="p-8 text-center">
      <div class="text-gray-500 dark:text-gray-400">
        <Icon name="i-lucide-book-open" class="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p class="text-lg font-medium mb-2">No hay libros para mostrar</p>
        <p class="text-sm">Los libros aparecerán aquí cuando estén disponibles.</p>
      </div>
    </div>

    <!-- Contenido principal cuando hay datos -->
    <template v-else>
      <!-- Tabla para desktop usando tabla HTML simple -->
      <div class="hidden md:block overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <!-- <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-10">
                <UCheckbox />
              </th> -->
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
              <!-- Checkbox -->
              <!-- <td class="px-6 py-4 whitespace-nowrap">
                <UCheckbox />
              </td> -->
              
              <!-- Título -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div 
                  class="font-medium text-gray-900 dark:text-gray-100 max-w-[200px] truncate" 
                  :title="selection.book_id?.title"
                >
                  {{ selection.book_id?.title || 'Sin título' }}
                </div>
              </td>
              
              <!-- Autor -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div 
                  class="text-gray-600 dark:text-gray-400 max-w-[150px] truncate" 
                  :title="selection.book_id?.author"
                >
                  {{ selection.book_id?.author || 'Autor desconocido' }}
                </div>
              </td>
              
              <!-- Rating -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="text-yellow-500 font-mono" :title="`${selection.userReview?.rating || 0}/5 estrellas`">
                  {{ '★'.repeat(selection.userReview?.rating || 0) + '☆'.repeat(5 - (selection.userReview?.rating || 0)) }}
                </div>
              </td>
              
              <!-- Estado -->
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge
                  :color="getStatusColor(selection.status)"
                  variant="subtle"
                  size="xs"
                >
                  {{ getStatusLabel(selection.status) }}
                </UBadge>
              </td>
              
              <!-- Acciones -->
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <UDropdownMenu 
                  :items="[
                    { type: 'label', label: 'Acciones' },
                    { label: 'Ver detalles', icon: 'i-lucide-eye', click: () => router.push(`/detailBook/${selection.book_id?.id}`) },
                    { type: 'separator' },
                    { label: 'Editar reseña', icon: 'i-lucide-edit', onSelect: () => emit('edit-review', selection) },
                    { label: 'Eliminar', icon: 'i-lucide-trash-2', click: () => props.removeBookFromLibrary(selection.book_id?.id as string), class: 'text-red-600 dark:text-red-400' }
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

      <!-- Vista móvil -->
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
                { label: 'Ver detalles', icon: 'i-lucide-eye', click: () => router.push(`/detailBook/${selection.book_id?.id}`) },
                { type: 'separator' },
                { label: 'Editar reseña', icon: 'i-lucide-edit', onSelect: () => emit('edit-review', selection) },
                { label: 'Eliminar', icon: 'i-lucide-trash-2', click: () => props.removeBookFromLibrary(selection.book_id?.id as string), class: 'text-red-600' }
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

      <!-- Footer con estadísticas -->
      <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div>{{ selectedRows.length }} de {{ props.data.length }} libro(s) seleccionado(s)</div>
        </div>
      </div>
    </template>
  </div>
</template>
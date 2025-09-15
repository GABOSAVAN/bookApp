<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Selection } from '~/types/book'
import DesktopTable from '~/components/DesktopTable.vue'
import MobileList from '~/components/MobileList.vue'

const props = defineProps<{
  data: Selection[]
  removeBookFromLibrary: (bookId: string) => Promise<void>
}>()

const desktopTableRef = ref()
const selectedRows = computed(() => desktopTableRef.value?.tableApi?.getFilteredSelectedRowModel().rows.length || 0)
const totalRows = computed(() => props.data.length)

// Expone las APIs necesarias para el componente padre (myLibrery.vue)
defineExpose({
  tableApi: computed(() => desktopTableRef.value?.tableApi)
})
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
    <div class="hidden md:block">
      <DesktopTable
        ref="desktopTableRef"
        :data="props.data"
        :remove-book-from-library="props.removeBookFromLibrary"
      />
    </div>

    <div class="block md:hidden">
      <MobileList
        :data="props.data"
        :remove-book-from-library="props.removeBookFromLibrary"
      />
    </div>

    <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-600 dark:text-gray-400">
        <div>{{ selectedRows }} de {{ totalRows }} libro(s) seleccionado(s)</div>
      </div>
    </div>
  </div>
</template>
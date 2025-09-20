<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useSelection } from '~/composables/useSelection';
import type { Selection } from '~/types/book';

const props = defineProps<{
  modelValue: boolean;
  selectionData?: Selection | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>();

const { updateBookReview, isLoading } = useSelection();
const toast = useToast();

const rating = ref(0);
const description = ref('');
const isPrivate = ref(false);
const status = ref('to-read'); // Nuevo campo para el status

const isEditing = computed(() => !!props.selectionData?.userReview);

// Opciones de status disponibles
const statusOptions = [
  { value: 'to-read', label: 'Por leer', color: 'neutral' },
  { value: 'reading', label: 'Leyendo', color: 'warning' },
  { value: 'read', label: 'Leído', color: 'success' }
];

// FUNCIÓN resetForm DEFINIDA ANTES DEL WATCH
const resetForm = () => {
  rating.value = 0;
  description.value = '';
  isPrivate.value = false;
  status.value = 'to-read';
};

// WATCH DESPUÉS DE DEFINIR resetForm
watch(
  () => props.selectionData,
  (newSelection) => {
    if (newSelection) {
      // Cargar datos existentes
      rating.value = newSelection.userReview?.rating || 0;
      description.value = newSelection.userReview?.description || '';
      isPrivate.value = newSelection.userReview?.private || false;
      status.value = newSelection.status || 'to-read'; // Cargar el status actual
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
  if (!props.selectionData?.book_id?.id || rating.value === 0) {
    toast.add({
      title: 'Error',
      description: 'El libro y la calificación son requeridos.',
      color: 'red'
    });
    return;
  }

  try {
    const payload = {
      description: description.value,
      rating: rating.value,
      private: isPrivate.value,
      status: status.value, // Incluir el status en el payload
    };
    
    await updateBookReview(props.selectionData.book_id.id, payload);
    
    emit('update:modelValue', false);

    toast.add({
      title: 'Éxito',
      description: `Reseña ${isEditing.value ? 'actualizada' : 'creada'} correctamente.`,
      color: 'green'
    });

  } catch (err) {
    console.error('Error submitting review:', err);
    toast.add({
      title: 'Error',
      description: 'Error al guardar la reseña. Intenta de nuevo.',
      color: 'red'
    });
  }
};

const handleStarClick = (starIndex: number) => {
  rating.value = starIndex;
};

const handleClose = () => {
  emit('update:modelValue', false);
  setTimeout(() => resetForm(), 100);
};

// Función para obtener el color del status
const getStatusColor = (statusValue: string) => {
  const statusOption = statusOptions.find(opt => opt.value === statusValue);
  return statusOption?.color || 'neutral';
};
</script>

<template>
  <!-- Overlay manual -->
  <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div 
      class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      @click="handleClose"
    ></div>
    
    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div 
        class="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {{ isEditing ? 'Editar Reseña' : 'Crear Reseña' }}
          </h3>
          <UButton
            icon="i-lucide-x"
            color="gray"
            variant="ghost"
            size="sm"
            @click="handleClose"
          />
        </div>

        <!-- Contenido -->
        <div class="p-6 space-y-6">
          <!-- Información del libro -->
          <div v-if="props.selectionData" class="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100">
              {{ props.selectionData.book_id?.title }}
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              por {{ props.selectionData.book_id?.author }}
            </p>
          </div>

          <!-- Estado del libro -->
          <div class="space-y-3">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Estado de lectura <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="option in statusOptions"
                :key="option.value"
                type="button"
                class="p-3 rounded-lg border-2 transition-all duration-150 text-sm font-medium"
                :class="status === option.value 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'"
                @click="status = option.value"
              >
                <UBadge 
                  :color="getStatusColor(option.value)" 
                  variant="subtle" 
                  size="xs"
                  class="mb-1"
                >
                  {{ option.label }}
                </UBadge>
              </button>
            </div>
          </div>

          <!-- Rating con estrellas (solo si está marcado como "leído") -->
          <div v-if="status === 'read'" class="space-y-3">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Calificación <span class="text-red-500">*</span>
            </label>
            <div class="flex items-center gap-1">
              <button
                v-for="n in 5" 
                :key="n"
                type="button"
                class="text-3xl cursor-pointer transition-all duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                :class="n <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-200'"
                @click="handleStarClick(n)"
              >
                {{ n <= rating ? '★' : '☆' }}
              </button>
              <span class="ml-3 text-sm text-gray-500 dark:text-gray-400">
                {{ rating }} de 5
              </span>
            </div>
          </div>

          <!-- Rating opcional para otros estados -->
          <div v-else class="space-y-3">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Calificación <span class="text-gray-400">(opcional)</span>
            </label>
            <div class="flex items-center gap-1">
              <button
                v-for="n in 5" 
                :key="n"
                type="button"
                class="text-2xl cursor-pointer transition-all duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded opacity-75"
                :class="n <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-200'"
                @click="handleStarClick(n)"
              >
                {{ n <= rating ? '★' : '☆' }}
              </button>
              <span class="ml-3 text-sm text-gray-500 dark:text-gray-400">
                {{ rating > 0 ? `${rating} de 5` : 'Sin calificar' }}
              </span>
            </div>
          </div>

          <!-- Descripción -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Reseña/Notas
            </label>
            <UTextarea 
              v-model="description" 
              :placeholder="status === 'read' 
                ? 'Comparte tus pensamientos sobre este libro...' 
                : status === 'reading' 
                  ? 'Anota tus impresiones mientras lees...'
                  : 'Anota por qué quieres leer este libro...'"
              :rows="4"
              class="w-full"
            />
          </div>

          <!-- Checkbox privado -->
          <div class="flex items-start space-x-3">
            <UCheckbox 
              id="private-review"
              v-model="isPrivate" 
            />
            <div class="flex flex-col">
              <label for="private-review" class="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                Marcar como privada
              </label>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Solo tú podrás ver esta información
              </p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <UButton
            color="gray"
            variant="outline"
            :disabled="isLoading"
            @click="handleClose"
          >
            Cancelar
          </UButton>
          <UButton
            color="primary"
            :loading="isLoading"
            :disabled="isLoading || (status === 'read' && rating === 0)"
            @click="handleSubmit"
          >
            {{ isEditing ? 'Guardar Cambios' : 'Guardar' }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
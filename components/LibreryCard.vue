<script setup lang="ts">
import { ref } from 'vue';
import { UModal, UTextarea, URadioGroup } from '#components';

const props = defineProps<{
  book: {
    id: number;
    title: string;
    author: string;
    year: number;
    review: string;
    rating: number;
  };
}>();

const emit = defineEmits(['edit', 'delete']);

const isEditModalOpen = ref(false);
const editedReview = ref(props.book.review);
const editedRating = ref(props.book.rating);

const ratingOptions = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
];

const saveChanges = () => {
  emit('edit', props.book.id, editedReview.value, editedRating.value);
  isEditModalOpen.value = false;
};

const handleDelete = () => {
  emit('delete', props.book.id);
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row items-center gap-6">
    <div class="flex-shrink-0">
      <img
        src="https://via.placeholder.com/150x225.png?text=Portada"
        alt="Portada del Libro"
        class="rounded-lg shadow-sm"
      />
    </div>

    <div class="flex-1 space-y-2">
      <h2 class="text-2xl font-bold">{{ book.title }}</h2>
      <p class="text-gray-600">Autor: {{ book.author }}</p>
      <p class="text-gray-600">Año: {{ book.year }}</p>
      <p class="text-lg mt-2 italic">"{{ book.review }}"</p>
      <p class="font-bold text-lg mt-1">Calificación: {{ book.rating }} / 5</p>
    </div>

    <div class="flex flex-col gap-2 w-full md:w-auto">
      <UButton
        icon="i-heroicons-pencil-square"
        color="primary"
        variant="solid"
        @click="isEditModalOpen = true"
      >
        Editar
      </UButton>
      <UButton
        icon="i-heroicons-trash"
        color="rose"
        variant="solid"
        @click="handleDelete"
      >
        Eliminar
      </UButton>
    </div>

    <UModal v-model="isEditModalOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold">Editar "{{ book.title }}"</h3>
            <UButton icon="i-heroicons-x-mark" color="gray" variant="ghost" @click="isEditModalOpen = false" />
          </div>
        </template>
        
        <div class="flex flex-col gap-4">
          <UTextarea
            v-model="editedReview"
            placeholder="Edita tu review..."
            :maxlength="500"
            :rows="5"
          />
          <div class="flex items-center gap-2">
            <span class="font-medium">Calificación:</span>
            <URadioGroup v-model="editedRating" :options="ratingOptions" class="flex gap-2" />
          </div>
          <UButton @click="saveChanges">Guardar Cambios</UButton>
        </div>
      </UCard>
    </UModal>
  </div>
</template>
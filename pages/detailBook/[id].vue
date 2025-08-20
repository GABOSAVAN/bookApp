<script setup lang="ts">
import { ref } from 'vue';

// Datos de ejemplo para el libro. En una aplicación real,
// estos datos se obtendrían de una API usando useFetch o $fetch.
const book = ref({
  id: 1,
  title: 'El Señor de los Anillos: La Comunidad del Anillo',
  author: 'J.R.R. Tolkien',
  year: 1954
});

// Variables para el review y la calificación
const reviewText = ref('');
const rating = ref(0);
const ratingOptions = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
];

// Función para guardar el review (aquí puedes enviar los datos a una API)
const saveReview = () => {
  if (reviewText.value && rating.value > 0) {
    alert(`Review guardado!\nCalificación: ${rating.value}/5\nReview: ${reviewText.value}`);
    // Aquí iría la lógica para enviar los datos a una base de datos
  } else {
    alert('Por favor, completa la calificación y el review.');
  }
};
</script>

<template>
  <div class="flex flex-col items-center p-8 bg-gray">
    <div class="bg-blue rounded-lg shadow-lg p-6 max-w-4xl w-full">

      <div class="flex flex-col md:flex-row gap-6 mb-8">

        <div class="flex-shrink-0 w-full md:w-1/3 flex justify-center">
          <img src="https://via.placeholder.com/300x450.png?text=Portada+del+Libro" alt="Portada del Libro"
            class="rounded-lg shadow-md max-h-96" />
        </div>

        <div class="flex-grow">
          <h1 class="text-4xl font-bold mb-2">{{ book.title }}</h1>
          <p class="text-xl text-gray-700 mb-1">Autor: {{ book.author }}</p>
          <p class="text-lg text-gray-500">Año: {{ book.year }}</p>
        </div>
      </div>

      <div class="flex flex-col gap-6">

        <div class="w-full">
          <label for="review" class="block text-lg font-medium mb-2">Escribe tu Review:</label>
          <UTextarea id="review" v-model="reviewText" :maxlength="500"
            placeholder="Comparte tu opinión sobre el libro..." rows=5 />
          <p class="text-sm text-gray-500 mt-1 text-right">
            {{ reviewText.length }} / 500 caracteres
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">

          <div class="flex items-center gap-2">
            <span class="text-lg font-medium">Calificación:</span>
            <URadioGroup v-model="rating" :options="ratingOptions" class="flex gap-2" />
          </div>

          <UButton icon="i-heroicons-paper-airplane" color="primary" variant="solid" size="lg" @click="saveReview">
            Guardar
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
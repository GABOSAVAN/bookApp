<template>
    <div class="max-w-[200px] rounded-lg overflow-hidden m shadow-lg transform transition-transform hover:scale-105">
      <NuxtLink :to="`/detailBook/${book.id}`">
        <div class="relative w-full h-72">
          <img
            v-if="book.coverUrl"
            :src="book.coverUrl"
            :alt="`Portada de ${book.title}`"
            class="w-full h-full object-cover"
          >
          <img
            v-if="!book.coverUrl"
            src="../assets/images/ind.png"
            :alt="`Portada de ${book.title}`"
            class="w-full h-full object-cover"
          >
          <!-- <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div> -->
        </div>
        <div class="p-4 text-center">
          <h3 class="text-md font-semibold truncate">{{ book.title }}</h3>
          <p class="text-sm truncate">{{ book.author }}</p>
        </div>
      </NuxtLink>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { Book } from '~/types/book'

const _props = defineProps<{
  book: Book;
}>();
  </script>
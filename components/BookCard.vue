<template>
    <div class="max-w-[200px] bg-white rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105">
      <NuxtLink :to="`/detailBook/${book.id}`">
        <div class="relative w-full h-72 bg-gray-200">
          <img
            :src="book.coverUrl"
            :alt="`Portada de ${book.title}`"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
        <div class="p-4 text-center">
          <h3 class="text-md font-semibold text-gray-800 truncate">{{ book.title }}</h3>
          <p class="text-sm text-gray-600 truncate">{{ book.author }}</p>
        </div>
      </NuxtLink>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    book: {
      id: string;
      title: string;
      author: string;
      coverUrl: string;
    };
  }>();
  </script>
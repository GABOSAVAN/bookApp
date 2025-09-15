  <script setup lang="ts">
  import { ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useAuthStore } from '~/stores/auth';
  import { useBookDetailStore } from '~/stores/bookDetail';
  import { useSelection } from '~/composables/useSelection'

  const authStore = useAuthStore(); 

  const toast = useToast()

  const Selection = useSelection()

  const { isAuthenticated, token } = storeToRefs(authStore);  

  const { currentBook } = storeToRefs(useBookDetailStore());  

  const loading = ref(false);    

  const config = useRuntimeConfig();  

  const addBookToLibrary = async () => {

    if (!isAuthenticated.value || !token.value || !currentBook.value) {

      console.error('User not authenticated or book data is missing.');

      return;

    }  

    loading.value = true;
    

    try {
      console.log("Agregando libro a seleccion")

      const response = await $fetch<{ message: string, status: number }>(`${config.public.apiBase}books/my-library`, {

        method: 'POST',

        body: {

          id: currentBook.value.id,

        },

        headers: {

          Authorization: `Bearer ${token.value}`,

        },

      });

      if(response.status == 201){
        Selection.fetchUserLibrary()
        toast.add({ 
                  description: 'Libro agregado a tu seleccion.',
                  color: 'success', // o el prop que uses para el tipo
                  orientation: 'horizontal'// position: 'top-right'
                  })
      }

      if(response.status == 200){
          toast.add({ 
                      description: 'Libro ya se encuentra agregado a tu seleccion.',
                      color: 'info'
                    })
      }
     

      // Opcional: Lógica para notificar al usuario, como un toast.

    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any

      console.error('Error adding book to library:', err);
      // const errorMessage = err.data?.message || 'Error al agregar el libro a la biblioteca.';
      toast.add({ 
                description: 'Error al agregar libro.',
                color: 'warning' // o 'error'
                })
      // Opcional: Lógica para mostrar un mensaje de error.

    } finally {

      loading.value = false;

    }

  };

  </script>

<template>

    <div v-if="isAuthenticated" class="justify-self-center">

      <UButton

        icon="i-heroicons-plus-circle"

        color="primary"

        :loading="loading"

        :disabled="loading"

        @click="addBookToLibrary"

      >        
        <span v-if="loading">Agregando...</span>
        <span v-else>Agregar a mi biblioteca</span>
      </UButton> 

    </div>

  </template>
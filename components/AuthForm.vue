<script setup lang="ts">
import { ref, computed } from 'vue';

// Definimos los props que recibirá el componente
const props = defineProps<{
  type: 'login' | 'register'; // Tipo de formulario (login o register)
}>();

// Definimos los eventos que emitirá el componente
const emit = defineEmits(['submit']);

// Variables reactivas para los campos del formulario
const email = ref('');
const password = ref('');

// Función que se ejecuta al enviar el formulario
const handleSubmit = () => {
  emit('submit', { email: email.value, password: password.value });
};

// Computamos el texto del botón y el título del formulario
const buttonText = computed(() => props.type === 'login' ? 'Iniciar Sesión' : 'Registrarse');
const formTitle = computed(() => props.type === 'login' ? 'Iniciar Sesión' : 'Crear una cuenta');
</script>

<template>
  <UCard class="w-full max-w-md">
    <template #header>
      <h2 class="text-3xl font-bold text-center mb-2">
        {{ formTitle }}
      </h2>
    </template>
    
    <form class="flex flex-col items-center gap-3" @submit.prevent="handleSubmit">
      <UFormGroup label="Correo Electrónico" name="email">
        <UInput
          v-model="email"
          type="email"
          placeholder="email@ejemplo.com"
          required
          size="lg"
        />
      </UFormGroup>

      <UFormGroup label="Contraseña" name="password">
        <UInput
          v-model="password"
          type="password"
          placeholder="••••••••"
          required
          size="lg"
        />
      </UFormGroup>
      
      <UButton class="w-60 mt-4" type="submit" block size="lg" color="primary">
        {{ buttonText }}
      </UButton>
    </form>
    
    <template #footer>
      <div v-if="type === 'login'" class="text-center text-gray-400 dark:text-gray-600">
        ¿No tienes una cuenta? <NuxtLink to="/register" class="text-primary hover:underline">Regístrate</NuxtLink>
      </div>
      <div v-else class="text-center text-gray-400 dark:text-gray-600">
        ¿Ya tienes una cuenta? <NuxtLink to="/login" class="text-primary hover:underline">Inicia Sesión</NuxtLink>
      </div>
    </template>
  </UCard>
</template>

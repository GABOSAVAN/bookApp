<script setup>
// Crea una función para manejar el evento de clic
function handleLogin() {
    navigateTo('/login');
}
</script>
<template>
        <UButton 
        class="w-min" 
        block size="lg"
        color="secondary"
        label="Iniciar Sesión"
        icon="i-heroicons-arrow-right-on-rectangle"
        @click="handleLogin"
        />
</template>
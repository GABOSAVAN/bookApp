<script setup>
// Crea una función para manejar el evento de clic
function handleLogin() {
    navigateTo('/login');
}
</script>
<template>
    <div class="flex justify-end">
        <UButton 
        class="w-min mt-4 mr-6" 
        block size="lg"
        color="primary"
        label="Iniciar Sesión"
        icon="i-heroicons-arrow-right-on-rectangle" @click="handleLogin"
        />
    </div>
</template>
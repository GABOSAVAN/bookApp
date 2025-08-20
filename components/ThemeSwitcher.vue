<script setup>
const colorMode = useColorMode()

const toggleTheme = () => {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <UButton
    class="text-white hover:text-red dark:text-white dark:hover:text-red"
    :icon="colorMode.preference === 'dark' ? 'i-heroicons-sun-20-solid' : 'i-heroicons-moon-20-solid'"
    @click="toggleTheme"
  />
</template>
<script setup lang="ts">

</script>


<template>
    <div>
      <AppHeader/>
      <AuthButtons/>  
      <main class="p-4">
          <slot />
      </main>
  
      <AppFooter/>
    </div>
  </template>
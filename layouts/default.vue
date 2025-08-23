<script setup lang="ts">
const Toaster = { position: 'top-right' as const}
</script>
<template>   
  <UApp :toaster="Toaster">
    <div>     
      <AppHeader />         
      <main>       
        <slot />     
      </main>     
      <AppFooter />   
    </div> 
  </UApp>
</template>
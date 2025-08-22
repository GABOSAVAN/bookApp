<script setup lang="ts">

</script>


<template>
    <div class="box-border">
      <AppHeader/>
      <AuthButtons/>  
      <main>
          <slot />
      </main>
  
      <AppFooter/>
    </div>
  </template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);
</script>

<template>
  <template v-if="isAuthenticated">
    <UiLogoutButton />
  </template>
  <template v-else>
    <UiLoginButton />
  </template>
</template>
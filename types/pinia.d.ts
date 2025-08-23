import type { Pinia } from 'pinia';

declare module '#app' {
  interface NuxtApp {
    $pinia: Pinia;
  }
}

interface ApiResponseError {
  data?: {
    message: string;
  };
}
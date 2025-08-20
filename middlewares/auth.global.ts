// middleware/auth.global.ts
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to) => {
  // Solo ejecutar en el cliente para evitar problemas de hidratación
  if (import.meta.client) {
    const authStore = useAuthStore();
    
    // Rutas que requieren autenticación
    const protectedRoutes = ['/myLibrery'];
    
    // Rutas solo para invitados (no autenticados)
    const guestOnlyRoutes = ['/login', '/register'];
    
    const isProtectedRoute = protectedRoutes.includes(to.path);
    const isGuestOnlyRoute = guestOnlyRoutes.includes(to.path);
    
    // Si está autenticado y trata de acceder a rutas de invitado
    if (authStore.isAuthenticated && isGuestOnlyRoute) {
      return navigateTo('/');
    }
    
    // Si NO está autenticado y trata de acceder a rutas protegidas
    if (!authStore.isAuthenticated && isProtectedRoute) {
      return navigateTo('/login');
    }
  }
});
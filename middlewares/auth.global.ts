// // middleware/auth.global.ts
// import { useAuthStore } from '~/stores/auth';

// export default defineNuxtRouteMiddleware((to) => {
//   // Solo ejecutar en el cliente para evitar problemas de hidratación
//   if (import.meta.client) {
//     const authStore = useAuthStore();
    
//     // Rutas que requieren autenticación
//     const protectedRoutes = ['/myLibrery'];
    
//     // Rutas solo para invitados (no autenticados)
//     const guestOnlyRoutes = ['/login', '/register'];
    
//     const isProtectedRoute = protectedRoutes.includes(to.path);
//     const isGuestOnlyRoute = guestOnlyRoutes.includes(to.path);
    
//     // Si está autenticado y trata de acceder a rutas de invitado
//     if (authStore.isAuthenticated && isGuestOnlyRoute) {
//       return navigateTo('/');
//     }
    
//     // Si NO está autenticado y trata de acceder a rutas protegidas
//     if (!authStore.isAuthenticated && isProtectedRoute) {
//       return navigateTo('/login');
//     }
//   }
// });

// import { useAuthStore } from '~/stores/auth';

// export default defineNuxtRouteMiddleware(async (to, from) => {
//   // Aseguramos que la lógica solo se ejecute en el cliente para
//   // que el store de Pinia tenga tiempo de rehidratar su estado.
//   if (import.meta.server) {
//     return; // Si estamos en el servidor, no hacemos nada.
//   }

//   const authStore = useAuthStore();
  
//   const protectedRoutes = ['/myLibrery'];
//   const isProtectedRoute = protectedRoutes.includes(to.path);
  
//   // Espera a que la hidratación del store termine para tener el estado correcto.
//   await authStore.$persistedState.isReady();

//   // Si NO está autenticado y trata de acceder a rutas protegidas
//   if (!authStore.isAuthenticated && isProtectedRoute) {
//     console.log('Usuario no autenticado, redirigiendo a /login');
//     return navigateTo('/login');
//   }
  
//   // Si está autenticado y trata de acceder a la página de login
//   if (authStore.isAuthenticated && to.path === '/login') {
//     console.log('Usuario autenticado, redirigiendo a /');
//     return navigateTo('/');
//   }
// });

// middleware/auth.global.ts

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  const protectedRoutes = ['/myLibrery'];
  const guestOnlyRoutes = ['/login', '/register'];

  const isProtectedRoute = protectedRoutes.includes(to.path);
  const isGuestOnlyRoute = guestOnlyRoutes.includes(to.path);

  // Redirige si el usuario está logueado y va a una ruta de invitado.
  // Esto se ejecuta en el cliente después de la hidratación.
  if (authStore.isAuthenticated && isGuestOnlyRoute) {
    return navigateTo('/');
  }

  // Redirige si el usuario no está logueado y va a una ruta protegida.
  // Esto también espera a la hidratación para ser preciso.
  if (!authStore.isAuthenticated && isProtectedRoute) {
    return navigateTo('/login');
  }
});
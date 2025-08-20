
<template>
    <div>
      <AppHeader/>
      <UiLoginButton/>
      <UiLogoutButton/>
  
      <main class="p-4">
          <slot />
      </main>
  
      <AppFooter/>
    </div>
  </template>
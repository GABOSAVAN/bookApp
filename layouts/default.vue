
<template>
    <div>
      <AppHeader/>
      <UiLoginButtom/>
      <UiLogoutButton/>
  
      <main class="p-4">
          <slot />
      </main>
  
      <AppFooter/>
    </div>
  </template>
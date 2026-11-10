<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div class="min-h-screen bg-[#030f0e] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-white flex flex-col justify-between overflow-x-hidden">
   <AppHeader v-if="route.path !== '/auth'" />

    <SocialSidebar v-if="!['/contact', '/auth'].includes(route.path)" />

    <CartDrawer />

    <main class="flex-grow">
      <slot />
    </main>
    
    <AppFooter v-if="route.path !== '/auth'" />
  </div>
</template>
<template>
  <div class="min-h-screen bg-[#030f0e] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-white flex flex-col justify-between overflow-x-hidden">
    <!-- Persistent Header -->
    <AppHeader />

    <!-- Persistent Floating Social Icons -->
    <SocialSidebar />

    <!-- Page Content Slot -->
    <main class="flex-grow">
      <NuxtPage />
    </main>

    <!-- Persistent Footer -->
    <AppFooter />
  </div>
</template>
<script setup lang="ts">
const route = useRoute()
const { fetchUser } = useAuth()

// Fetch the current user on app start or page reload (SSR-safe)
await fetchUser()

const isAdmin = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <main class="flex-grow">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </main>
</template>
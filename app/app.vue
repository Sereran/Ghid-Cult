<script setup lang="ts">
const route = useRoute()

const isAdmin = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <main class="flex-grow">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </main>
</template>
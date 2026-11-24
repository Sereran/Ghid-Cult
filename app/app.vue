<script setup lang="ts">
const route = useRoute()
const { fetchUser } = useAuth()
const { t, locale } = useI18n()

// Fetch the current user on app start or page reload (SSR-safe)
await fetchUser()

const isAdmin = computed(() => route.path.startsWith('/admin'))

useHead({
  htmlAttrs: {
    lang: () => locale.value,
  },
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Ghid Cult',
        alternateName: ['GhidCult', 'GhidCult Iași'],
        url: 'https://ghidcult.com',
        sameAs: [
          'https://www.linkedin.com/in/ghid-cult/',
          'https://www.tiktok.com/@adrianilade',
          'https://www.youtube.com/@adrianilade',
          'https://www.facebook.com/adrian.ilade',
        ],
      }),
    },
  ],
})

useSeoMeta({
  title: () => t('meta.title'),
  description: () => t('meta.description'),
  ogSiteName: 'Ghid Cult',
  ogType: 'website',
  ogTitle: () => t('meta.title'),
  ogDescription: () => t('meta.description'),
  ogImage: 'https://ghidcult.com/images/background-image.jpeg',
})
</script>

<template>
  <main class="flex-grow">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </main>
</template>
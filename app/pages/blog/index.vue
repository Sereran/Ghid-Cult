<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowRight, Clock, Loader2 } from '@lucide/vue'

const { t, locale, te } = useI18n()
const localePath = useLocalePath()

useHead({
  title: computed(() => t('blogPage.metaTitle')),
})

const activeCategory = ref('All')

// Fetch public articles
const { data, pending } = await useFetch<{
  success: boolean
  categories: string[]
  articles: any[]
}>('/api/blog', {
  query: computed(() => ({
    category: activeCategory.value !== 'All' ? activeCategory.value : undefined,
  })),
  watch: [activeCategory],
})

const articles = computed(() => data.value?.articles || [])
const availableCategories = computed(() => data.value?.categories || ['All'])

// Featured Post
const featuredPost = computed(() => {
  if (activeCategory.value !== 'All') return null
  return articles.value.find((p: any) => p.isFeatured) || articles.value[0] || null
})

const regularPosts = computed(() => {
  if (!featuredPost.value) return articles.value
  return articles.value.filter((p: any) => p.id !== featuredPost.value.id)
})

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString(locale.value === 'ro' ? 'ro-RO' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const getCategoryLabel = (cat: string) => {
  const translationKey = `categories.${cat}`
  return te(translationKey) ? t(translationKey) : cat
}
</script>

<template>
  <div class="pt-[72px] min-h-screen">

    <!-- Header -->
    <div class="border-b border-white/10">
      <div class="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 py-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 class="text-4xl sm:text-6xl font-extrabold text-white leading-[0.95] tracking-tight">
            {{ $t('blogPage.title') }}
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-slate-400 max-w-[380px] leading-relaxed">
          {{ $t('blogPage.subtitle') }}
        </p>
      </div>
    </div>

    <!-- Featured Post -->
    <div v-if="featuredPost" class="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 py-14 border-b border-white/10">
      <p class="text-[10px] tracking-[0.3em] uppercase text-emerald-400 font-semibold mb-6 font-mono">
        {{ $t('blogPage.featuredLabel') }}
      </p>

      <NuxtLink 
        :to="localePath(`/blog/${featuredPost.slug || featuredPost.id}`)" 
        class="group grid grid-cols-1 md:grid-cols-[1fr_480px] gap-0 border border-white/10 hover:border-white/25 rounded-2xl bg-neutral-900/40 transition-all duration-300 overflow-hidden shadow-xl"
      >
        <div class="relative h-[280px] md:h-auto overflow-hidden bg-black/40">
          <img
            :src="featuredPost.imageUrl"
            :alt="featuredPost.title"
            class="w-full h-full object-cover opacity-75 group-hover:scale-[1.03] group-hover:opacity-95 transition-all duration-700"
            @error="(e: any) => e.target.style.display = 'none'"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-transparent to-[#030f0e] hidden md:block" />
          <div class="absolute inset-0 bg-gradient-to-t from-[#030f0e] to-transparent md:hidden" />

          <span class="absolute top-5 left-5 text-[10px] tracking-[0.2em] uppercase border border-white/40 text-white backdrop-blur-md bg-black/40 px-3 py-1.5 rounded-md font-mono">
            {{ getCategoryLabel(featuredPost.category) }}
          </span>
        </div>

        <div class="flex flex-col justify-between p-8 sm:p-10 md:p-12">
          <div>
            <div class="flex items-center gap-3 text-slate-400 text-xs mb-4 font-mono">
              <span>{{ formatDate(featuredPost.publishedAt || featuredPost.createdAt) }}</span>
              <span class="w-1 h-1 rounded-full bg-white/20" />
              <span class="flex items-center gap-1.5"><Clock :size="12" />{{ featuredPost.readTime }}</span>
            </div>

            <h2 class="text-2xl sm:text-3xl font-bold text-white leading-tight mb-4 group-hover:text-emerald-400 transition-colors">
              {{ featuredPost.title }}
            </h2>

            <p class="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3">
              {{ featuredPost.shortDescription }}
            </p>
          </div>

          <div class="flex items-center gap-2 text-xs sm:text-sm text-slate-300 group-hover:text-white transition-colors mt-8 font-semibold">
            {{ $t('blogPage.readArticle') }} <ArrowRight :size="14" />
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Articles Grid Section -->
    <div class="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 py-14">

      <!-- Category Filter Buttons -->
      <div class="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div class="flex flex-wrap gap-2.5">
          <button
            v-for="cat in availableCategories"
            :key="cat"
            type="button"
            @click="activeCategory = cat"
            :class="[
              'text-[11px] font-semibold tracking-widest uppercase px-4 py-2 rounded-lg border transition-all duration-200',
              activeCategory === cat
                ? 'border-white bg-white text-neutral-950 shadow-md font-bold'
                : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white bg-neutral-900/40'
            ]"
          >
            {{ getCategoryLabel(cat) }}
          </button>
        </div>

        <p class="text-xs text-slate-400 font-mono">
          {{ $t('blogPage.postsCount', { count: regularPosts.length + (featuredPost ? 1 : 0) }) }}
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="pending && articles.length === 0" class="text-white/40 py-24 text-center">
        <Loader2 :size="24" class="animate-spin inline mr-2 text-emerald-400" />
        {{ $t('blogPage.loading') }}
      </div>

      <!-- Empty State -->
      <div v-else-if="regularPosts.length === 0 && !featuredPost" class="text-slate-500 text-center py-20 text-sm">
        {{ $t('blogPage.empty') }}
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <NuxtLink
          v-for="post in regularPosts"
          :key="post.id"
          :to="localePath(`/blog/${post.slug || post.id}`)"
          class="group flex flex-col border border-white/10 hover:border-white/20 bg-neutral-900/60 rounded-2xl overflow-hidden transition-all duration-300 shadow-xl"
        >
          <div class="relative overflow-hidden h-48 sm:h-52 bg-black/40">
            <img
              :src="post.imageUrl"
              :alt="post.title"
              class="w-full h-full object-cover opacity-70 group-hover:scale-[1.04] group-hover:opacity-95 transition-all duration-500"
              @error="(e: any) => e.target.style.display = 'none'"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[#030f0e]/60 to-transparent" />
            <span class="absolute top-4 left-4 text-[10px] tracking-[0.2em] uppercase border border-white/30 text-white backdrop-blur-md bg-black/40 px-2.5 py-1 rounded-md font-mono">
              {{ getCategoryLabel(post.category) }}
            </span>
          </div>

          <div class="flex flex-col flex-1 p-6">
            <div class="flex items-center gap-3 text-slate-400 text-xs mb-3 font-mono">
              <span>{{ formatDate(post.publishedAt || post.createdAt) }}</span>
              <span class="w-1 h-1 rounded-full bg-white/20" />
              <span class="flex items-center gap-1"><Clock :size="11" />{{ post.readTime }}</span>
            </div>

            <h3 class="text-base sm:text-lg font-bold text-white leading-snug mb-2 group-hover:text-emerald-400 transition-colors">
              {{ post.title }}
            </h3>

            <p class="text-xs text-slate-400 leading-relaxed line-clamp-3 flex-1">
              {{ post.shortDescription }}
            </p>

            <div class="flex items-center gap-1.5 text-xs text-slate-400 group-hover:text-white transition-colors mt-6 font-semibold">
              {{ $t('blogPage.read') }} <ArrowRight :size="12" />
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Newsletter -->
    <!-- <div class="border-t border-white/10 bg-neutral-950/40 mt-8">
      <div class="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <p class="text-[11px] tracking-[0.25em] uppercase text-emerald-400 font-semibold mb-2">{{ $t('blogPage.newsletter.tagline') }}</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">{{ $t('blogPage.newsletter.title') }}</h2>
        </div>

        <form @submit.prevent class="flex flex-col sm:flex-row items-stretch gap-2 w-full md:w-auto">
          <input
            type="email"
            :placeholder="t('blogPage.newsletter.placeholder')"
            class="bg-neutral-900 border border-white/15 text-sm text-white placeholder:text-slate-500 px-5 py-3.5 rounded-full sm:rounded-r-none outline-none focus:border-emerald-400 transition-colors w-full sm:w-[280px]"
          />
          <button
            type="submit"
            class="bg-white hover:bg-neutral-100 text-neutral-900 text-sm font-bold px-6 py-3.5 rounded-full sm:rounded-l-none transition-all duration-200 shadow-md whitespace-nowrap"
          >
            {{ $t('blogPage.newsletter.subscribe') }}
          </button>
        </form>
      </div>
    </div> -->

  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { 
  Clock, 
  ArrowRight, 
  Loader2,
  Landmark,
  BookOpen,
  Scroll,
  Hammer,
  Church,
} from '@lucide/vue'
import type { ArticleRecord } from '~/data/blog'

const { t, te, locale, d } = useI18n()
const localePath = useLocalePath()

useHead({
  title: computed(() => t('meta.title')),
  meta: [
    {
      name: 'description',
      content: computed(() => t('meta.description')),
    },
  ],
})

// Fetch published articles
const { data, pending } = await useFetch<{
  success: boolean
  categories: string[]
  articles: ArticleRecord[]
}>('/api/blog')

const articles = computed(() => data.value?.articles || [])

// Featured Article
const featuredArticle = computed(() => {
  return articles.value.find((a) => a.isFeatured) || articles.value[0] || null
})

// Recent Chronicles (Next 3 published articles)
const recentChronicles = computed(() => {
  if (!featuredArticle.value) return articles.value.slice(0, 3)
  return articles.value.filter((a) => a.id !== featuredArticle.value?.id).slice(0, 3)
})

// Cultural Focus Pillars of Iași
const pillars = computed(() => [
  {
    id: 'discover',
    title: t('pillars.items.discover.title'),
    description: t('pillars.items.discover.description'),
    icon: Scroll,
    image: 'images/stema-iasi.jpg',
  },
  {
    id: 'symbols',
    title: t('pillars.items.symbols.title'),
    description: t('pillars.items.symbols.description'),
    icon: Hammer,
    image: 'images/posta-iasi.png',
  },
  {
    id: 'knowledge',
    title: t('pillars.items.knowledge.title'),
    description: t('pillars.items.knowledge.description'),
    icon: BookOpen,
    image: 'images/bcu.jpg',
  },
  {
    id: 'church',
    title: t('pillars.items.church.title'),
    description: t('pillars.items.church.description'),
    icon: Church,
    image: 'images/mitropolia-iasi.jpg',
  },
])

const getCategoryLabel = (cat: string) => {
  if (!cat) return ''
  const translationKey = `categories.${cat}`
  return te(translationKey) ? t(translationKey) : cat
}

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString(locale.value === 'ro' ? 'ro-RO' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="w-full text-slate-100 selection:bg-emerald-500 selection:text-white">
    
    <!-- Hero Section -->
    <section class="relative w-full min-h-[85vh] flex flex-col justify-end overflow-hidden pb-20 pt-36">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <img
          src="/images/background-image.jpeg"
          alt="Historic Iași City Panorama"
          class="w-full h-full object-cover object-center opacity-65"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[#020b0a] via-[#020b0a]/70 to-black/50" />
      </div>

      <!-- Main Headline & Mission -->
      <div class="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 w-full">
        <div class="flex flex-col items-start gap-6 max-w-3xl">

          <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] text-white tracking-tight">
            {{ $t('hero.title') }}
          </h1>

          <p class="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-light">
            {{ $t('hero.subtitle') }}
          </p>

          <div class="flex flex-wrap items-center gap-4 pt-2">
            <NuxtLink 
              :to="localePath('/blog')" 
              class="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-sm sm:text-base font-bold px-8 py-3.5 rounded-full transition-all duration-200 shadow-xl shadow-emerald-500/10 hover:scale-105 active:scale-95"
            >
              <span>{{ $t('hero.cta') }}</span>
              <ArrowRight :size="16" />
            </NuxtLink>

            <NuxtLink 
              :to="localePath('/about')" 
              class="inline-flex items-center gap-2 border border-white/20 bg-white/5 hover:bg-white/10 text-white text-sm sm:text-base font-medium px-7 py-3.5 rounded-full backdrop-blur-md transition-all"
            >
              {{ $t('hero.aboutCta') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Cultural Pillars of the City -->
    <section class="py-24 px-6 sm:px-12 lg:px-16 max-w-[1440px] mx-auto border-t border-white/10 text-slate-100">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
        <div>
          <p class="text-[11px] font-mono tracking-[0.25em] uppercase text-emerald-400 mb-2 font-semibold">
            {{ $t('pillars.archiveTagline') }}
          </p>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {{ $t('pillars.title') }}
          </h2>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="p in pillars"
          :key="p.id"
          class="relative overflow-hidden h-[500px] rounded-2xl block border border-white/15 bg-neutral-900/80 shadow-2xl"
        >
          <!-- Card Background Image -->
          <img
            :src="p.image"
            :alt="p.title"
            class="w-full h-full object-cover opacity-50 select-none"
            @error="(e: any) => e.target.style.display = 'none'"
          />

          <div class="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[#020b0a] via-[#020b0a]/95 to-transparent" />

          <!-- Content Grid Layout -->
          <div class="absolute inset-0 p-6 sm:p-7 flex flex-col justify-between z-10">
            <div class="w-11 h-11 rounded-xl bg-black/75 border border-white/20 backdrop-blur-md flex items-center justify-center text-emerald-400 shadow-lg">
              <component :is="p.icon" :size="22" />
            </div>

            <!-- Bottom Content Box -->
            <div class="flex flex-col justify-end">
              <div class="h-12 flex items-end mb-3">
                <h3 class="text-white font-bold text-xl sm:text-2xl leading-tight tracking-tight">
                  {{ p.title }}
                </h3>
              </div>

              <!-- Description Text -->
              <p class="text-slate-200 text-xs sm:text-sm leading-relaxed font-light">
                {{ p.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Lead Article -->
    <section v-if="featuredArticle" class="py-20 px-6 sm:px-12 lg:px-16 max-w-[1440px] mx-auto border-t border-white/10">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-amber-400" />
          <p class="text-[11px] font-mono tracking-[0.25em] uppercase text-amber-300 font-semibold">{{ $t('featured.label') }}</p>
        </div>
        <NuxtLink :to="localePath('/blog')" class="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors">
          {{ $t('featured.browseAll') }} <ArrowRight :size="13" />
        </NuxtLink>
      </div>

      <NuxtLink
        :to="localePath(`/blog/${featuredArticle.slug || featuredArticle.id}`)"
        class="group grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] border border-white/10 hover:border-white/20 bg-neutral-900/40 rounded-3xl overflow-hidden transition-all duration-300 shadow-2xl"
      >
        <div class="relative min-h-[340px] lg:min-h-[460px] overflow-hidden bg-black/50">
          <img
            :src="featuredArticle.imageUrl"
            :alt="featuredArticle.title"
            class="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
            @error="(e: any) => e.target.style.display = 'none'"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-[#020b0a]/90 via-transparent to-transparent lg:hidden" />
          
          <span class="absolute top-6 left-6 text-[10px] font-mono tracking-widest uppercase border border-white/25 backdrop-blur-md bg-black/60 text-white px-3 py-1 rounded-md">
            {{ getCategoryLabel(featuredArticle.category) }}
          </span>
        </div>

        <div class="p-8 sm:p-12 lg:p-14 flex flex-col justify-between">
          <div class="space-y-4">
            <div class="flex items-center gap-3 text-slate-400 text-xs font-mono">
              <span>{{ formatDate(featuredArticle.publishedAt || featuredArticle.createdAt) }}</span>
              <span class="w-1 h-1 rounded-full bg-white/20" />
              <span class="flex items-center gap-1"><Clock :size="12" /> {{ featuredArticle.readTime }}</span>
            </div>

            <h3 class="text-2xl sm:text-4xl font-extrabold text-white leading-tight group-hover:text-emerald-400 transition-colors">
              {{ featuredArticle.title }}
            </h3>

            <p class="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-4 font-light">
              {{ featuredArticle.shortDescription }}
            </p>
          </div>

          <div class="pt-8 mt-6 border-t border-white/10 flex items-center justify-between">
            <span class="text-xs font-mono text-emerald-400 group-hover:underline flex items-center gap-1.5 font-bold">
              {{ $t('featured.readFull') }} <ArrowRight :size="13" />
            </span>

            <span v-if="featuredArticle.author" class="text-xs text-slate-400 font-mono">
              {{ $t('featured.by', { author: featuredArticle.author.fullName }) }}
            </span>
          </div>
        </div>
      </NuxtLink>
    </section>

    <!-- Recent Published Articles -->
    <section class="py-20 px-6 sm:px-12 lg:px-16 max-w-[1440px] mx-auto border-t border-white/10">
      <div class="flex items-end justify-between mb-12">
        <div>
          <p class="text-[11px] font-mono tracking-[0.25em] uppercase text-emerald-400 mb-2 font-semibold">{{ $t('recent.label') }}</p>
          <h2 class="text-3xl sm:text-4xl font-bold text-white tracking-tight">{{ $t('recent.title') }}</h2>
        </div>
        <NuxtLink :to="localePath('/blog')" class="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors">
          {{ $t('recent.viewAll') }} <ArrowRight :size="13" />
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="pending && articles.length === 0" class="text-center py-20 text-white/40 text-xs">
        <Loader2 :size="20" class="animate-spin inline mr-2 text-emerald-400" />
        {{ $t('recent.loading') }}
      </div>

      <!-- Empty State -->
      <div v-else-if="recentChronicles.length === 0" class="text-center py-20 text-white/30 text-xs">
        {{ $t('recent.empty') }}
      </div>

      <!-- Articles Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <NuxtLink
          v-for="article in recentChronicles"
          :key="article.id"
          :to="localePath(`/blog/${article.slug || article.id}`)"
          class="group flex flex-col bg-neutral-900/40 border border-white/10 hover:border-white/25 rounded-2xl overflow-hidden transition-all duration-300 shadow-xl"
        >
          <div class="relative h-56 overflow-hidden bg-black/40">
            <img
              :src="article.imageUrl"
              :alt="article.title"
              class="w-full h-full object-cover opacity-75 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500"
              @error="(e: any) => e.target.style.display = 'none'"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[#020b0a] via-transparent to-transparent" />
            
            <span class="absolute top-4 left-4 text-[10px] font-mono tracking-widest uppercase border border-white/30 backdrop-blur-md bg-black/50 text-white px-2.5 py-1 rounded-md">
              {{ getCategoryLabel(article.category) }}
            </span>
          </div>

          <div class="p-6 flex flex-col flex-1 justify-between gap-4">
            <div>
              <div class="flex items-center gap-3 text-slate-400 text-xs font-mono mb-3">
                <span>{{ formatDate(article.publishedAt || article.createdAt) }}</span>
                <span class="w-1 h-1 rounded-full bg-white/20" />
                <span class="flex items-center gap-1"><Clock :size="11" />{{ article.readTime }}</span>
              </div>

              <h3 class="text-white text-lg font-bold leading-snug mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                {{ article.title }}
              </h3>

              <p class="text-slate-400 text-xs leading-relaxed line-clamp-3">
                {{ article.shortDescription }}
              </p>
            </div>

            <div class="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span class="text-emerald-400 group-hover:underline flex items-center gap-1 font-semibold">
                {{ $t('recent.readEntry') }} <ArrowRight :size="12" />
              </span>
              <span v-if="article.author" class="text-slate-500 truncate max-w-[120px]">
                {{ article.author.fullName }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>

  </div>
</template>
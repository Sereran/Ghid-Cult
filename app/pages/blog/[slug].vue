<script setup lang="ts">
import { computed } from 'vue'
import { ArrowLeft, Clock, ArrowRight, MapPin, Loader2 } from '@lucide/vue'

const { t, locale, te } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const slug = computed(() => route.params.slug as string)

// Fetch article and suggestions from API
const { data, pending } = await useFetch<{
  success: boolean
  article: any
  suggestions: any[]
}>(() => `/api/blog/${slug.value}`)

const currentPost = computed(() => data.value?.article)
const suggestions = computed(() => data.value?.suggestions || [])

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString(locale.value === 'ro' ? 'ro-RO' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const getCategoryLabel = (cat: string) => {
  if (!cat) return ''
  const translationKey = `categories.${cat}`
  return te(translationKey) ? t(translationKey) : cat
}

useHead({
  title: computed(() => currentPost.value ? `${currentPost.value.title} | GhidCult Blog` : t('articlePage.notFound')),
})
</script>

<template>
  <div class="pt-[72px] min-h-screen text-slate-100 selection:bg-emerald-500 selection:text-white">

    <!-- Loading State -->
    <div v-if="pending" class="flex items-center justify-center min-h-[60vh]">
      <Loader2 :size="32" class="animate-spin text-emerald-400" />
    </div>

    <!-- 404 State -->
    <div v-else-if="!currentPost" class="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-6 text-center">
      <p class="text-slate-400 text-lg font-mono">{{ $t('articlePage.notFound') }}</p>
      <NuxtLink :to="localePath('/blog')" class="text-white hover:text-emerald-400 underline text-sm transition-colors">
        {{ $t('articlePage.backToBlog') }}
      </NuxtLink>
    </div>

    <!-- Article View -->
    <div v-else>
      <!-- Hero Banner -->
      <div class="relative h-[440px] sm:h-[520px] overflow-hidden bg-[#030f0e]">
        <img
          :src="currentPost.imageUrl"
          :alt="currentPost.title"
          class="w-full h-full object-cover opacity-60"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[#030f0e] via-[#030f0e]/30 to-black/40" />

        <div class="absolute top-8 left-6 sm:left-12 lg:left-16 z-10">
          <NuxtLink
            :to="localePath('/blog')"
            class="inline-flex items-center gap-2 text-white/80 hover:text-white text-xs font-semibold uppercase tracking-wider bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 transition-colors"
          >
            <ArrowLeft :size="13" /> {{ $t('articlePage.allPosts') }}
          </NuxtLink>
        </div>

        <div class="absolute top-8 right-6 sm:right-12 lg:right-16">
          <span class="text-[10px] font-semibold tracking-widest uppercase border border-white/30 backdrop-blur-md bg-black/40 text-white px-3.5 py-1.5 rounded-md font-mono">
            {{ getCategoryLabel(currentPost.category) }}
          </span>
        </div>
      </div>

      <!-- Article Content Wrapper -->
      <div class="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16">

        <!-- Metadata Header -->
        <div class="max-w-[760px] pt-14 pb-10 border-b border-white/10">
          <div class="flex items-center gap-3 text-slate-400 text-xs mb-6 font-mono">
            <span>{{ formatDate(currentPost.publishedAt || currentPost.createdAt) }}</span>
            <span class="w-1 h-1 rounded-full bg-white/20" />
            <span class="flex items-center gap-1.5"><Clock :size="12" />{{ currentPost.readTime }}</span>
            <template v-if="currentPost.author">
              <span class="w-1 h-1 rounded-full bg-white/20" />
              <span class="text-white font-medium">{{ currentPost.author.fullName }}</span>
            </template>
          </div>

          <h1 class="text-3xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
            {{ currentPost.title }}
          </h1>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-20 py-14">

          <!-- Main Article -->
          <article>
            <!-- Lead Excerpt -->
            <p class="text-slate-200 text-lg sm:text-xl leading-relaxed border-l-4 border-emerald-400 pl-6 mb-10 italic">
              {{ currentPost.shortDescription }}
            </p>

            <!-- Rendered HTML -->
            <div 
              class="prose prose-invert prose-emerald max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-6 prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight prose-a:text-emerald-400 hover:prose-a:text-emerald-300 prose-blockquote:border-l-2 prose-blockquote:border-emerald-400/80 prose-blockquote:text-white prose-blockquote:italic"
              v-html="currentPost.content" 
            />

            <!-- Author Box -->
            <div v-if="currentPost.author" class="border-t border-white/10 pt-8 mt-12 flex items-center gap-5">
              <div class="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 text-sm font-bold shrink-0 font-mono overflow-hidden">
                <img 
                  v-if="currentPost.author.avatarUrl" 
                  :src="currentPost.author.avatarUrl" 
                  :alt="currentPost.author.fullName" 
                  class="w-full h-full object-cover"
                  @error="(e: any) => e.target.style.display = 'none'"
                />
                <span v-else>{{ currentPost.author.fullName.charAt(0) }}</span>
              </div>
              <div>
                <p class="text-white text-sm font-bold">{{ currentPost.author.fullName }}</p>
                <p class="text-slate-400 text-xs leading-relaxed font-light">
                  {{ $t('articlePage.authorBio') }}
                </p>
              </div>
            </div>
          </article>

          <!-- Sidebar -->
          <aside class="flex flex-col gap-6 lg:sticky lg:top-[92px] self-start">
            <!-- Article Meta -->
            <div class="border border-white/10 bg-neutral-900/50 rounded-2xl p-6 shadow-md">
              <p class="text-[10px] tracking-[0.2em] uppercase text-emerald-400 font-semibold mb-3 font-mono">
                {{ $t('articlePage.sidebar.category') }}
              </p>
              <span class="inline-block text-[11px] font-semibold tracking-widest uppercase border border-white/20 bg-white/5 text-slate-200 px-3 py-1 rounded-md font-mono">
                {{ getCategoryLabel(currentPost.category) }}
              </span>

              <div class="mt-5 pt-5 border-t border-white/10">
                <p class="text-[10px] tracking-[0.2em] uppercase text-emerald-400 font-semibold mb-1 font-mono">
                  {{ $t('articlePage.sidebar.published') }}
                </p>
                <p class="text-xs text-slate-300 font-mono">{{ formatDate(currentPost.publishedAt || currentPost.createdAt) }}</p>
              </div>

              <div class="mt-4 pt-4 border-t border-white/10">
                <p class="text-[10px] tracking-[0.2em] uppercase text-emerald-400 font-semibold mb-1 font-mono">
                  {{ $t('articlePage.sidebar.readingTime') }}
                </p>
                <p class="text-xs text-slate-300 font-mono flex items-center gap-1.5">
                  <Clock :size="12" class="text-emerald-400" />{{ currentPost.readTime }}
                </p>
              </div>
            </div>

            <!-- Linked Tour -->
            <!-- <div v-if="currentPost.tour" class="border border-emerald-500/30 bg-[#021311] rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
              <div class="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider font-mono">
                <MapPin :size="14" />
                <span>{{ $t('articlePage.sidebar.featuredTour') }}</span>
              </div>
              <h4 class="text-white text-base font-bold leading-snug">{{ currentPost.tour.title }}</h4>
              <p class="text-xs text-slate-300 line-clamp-3 leading-relaxed font-light">
                {{ currentPost.tour.shortDescription }}
              </p>
              <NuxtLink
                :to="localePath(`/tours/${currentPost.tour.slug || currentPost.tour.id}`)"
                class="flex items-center justify-between text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 px-4 py-3 rounded-xl transition-all shadow-md active:scale-95"
              >
                {{ $t('articlePage.sidebar.bookTour', { price: currentPost.tour.price }) }} <ArrowRight :size="14" />
              </NuxtLink>
            </div> -->

            <!-- Tour Promotion -->
            <!-- <div v-else class="border border-white/10 bg-neutral-900/80 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
              <p class="text-xs text-slate-300 leading-relaxed font-light">
                {{ $t('articlePage.sidebar.tourPromoText') }}
              </p>
              <NuxtLink
                :to="localePath('/tours')"
                class="flex items-center justify-between text-xs font-bold text-neutral-900 bg-white hover:bg-neutral-100 px-4 py-3 rounded-xl transition-all shadow-md active:scale-95"
              >
                {{ $t('articlePage.sidebar.exploreTours') }} <ArrowRight :size="14" />
              </NuxtLink>
            </div> -->
          </aside>
        </div>

        <!-- Suggestions Grid -->
        <div v-if="suggestions.length > 0" class="border-t border-white/10 py-16">
          <p class="text-[11px] tracking-[0.2em] uppercase text-emerald-400 font-semibold mb-2 font-mono">
            {{ $t('articlePage.suggestions.tagline') }}
          </p>
          <h2 class="text-2xl sm:text-3xl font-bold text-white mb-8 tracking-tight">
            {{ $t('articlePage.suggestions.title') }}
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NuxtLink
              v-for="p in suggestions"
              :key="p.slug"
              :to="localePath(`/blog/${p.slug || p.id}`)"
              class="group flex gap-4 border border-white/10 hover:border-white/20 bg-neutral-900/50 rounded-xl overflow-hidden transition-all duration-300 shadow-md"
            >
              <div class="w-32 sm:w-36 h-28 shrink-0 overflow-hidden bg-black/40">
                <img
                  :src="p.imageUrl"
                  :alt="p.title"
                  class="w-full h-full object-cover opacity-75 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500"
                  @error="(e: any) => e.target.style.display = 'none'"
                />
              </div>
              <div class="flex flex-col justify-center py-3 pr-4">
                <span class="text-[10px] tracking-widest uppercase text-emerald-400 font-semibold mb-1 font-mono">
                  {{ getCategoryLabel(p.category) }}
                </span>
                <p class="text-white text-xs sm:text-sm font-bold leading-snug group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {{ p.title }}
                </p>
                <p class="text-slate-400 text-[11px] font-mono mt-2">{{ p.readTime }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
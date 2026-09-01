<script setup lang="ts">
import { computed } from 'vue'
import { ArrowLeft, Clock, ArrowRight } from 'lucide-vue-next'
import { posts } from '~/data/blog'

const route = useRoute()

// Find post matching the route param id
const currentPost = computed(() => {
  return posts.find((p) => p.id === route.params.id)
})

// Suggestions
const suggestions = computed(() => {
  if (!currentPost.value) return []
  const sameCategory = posts.filter((p) => p.id !== currentPost.value?.id && p.category === currentPost.value?.category).slice(0, 2)
  if (sameCategory.length > 0) return sameCategory
  return posts.filter((p) => p.id !== currentPost.value?.id).slice(0, 2)
})

useHead({
  title: computed(() => currentPost.value ? `${currentPost.value.title} | GhidCult Blog` : 'Post Not Found')
})
</script>

<template>
  <div class="pt-[72px] min-h-screen">

    <!-- 404 Content -->
    <div v-if="!currentPost" class="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-6 text-center">
      <p class="text-slate-400 text-lg">Post not found.</p>
      <NuxtLink to="/blog" class="text-white hover:text-emerald-400 underline text-sm transition-colors">
        Back to blog
      </NuxtLink>
    </div>

    <!-- Article View -->
    <div v-else>
      <!-- Banner -->
      <div class="relative h-[440px] sm:h-[520px] overflow-hidden bg-[#030f0e]">
        <img
          :src="currentPost.img"
          :alt="currentPost.title"
          class="w-full h-full object-cover opacity-60"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[#030f0e] via-[#030f0e]/30 to-black/40" />

        <div class="absolute top-8 left-6 sm:left-12 lg:left-16 z-10">
          <NuxtLink
            to="/blog"
            class="inline-flex items-center gap-2 text-white/80 hover:text-white text-xs font-semibold uppercase tracking-wider bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 transition-colors"
          >
            <ArrowLeft :size="13" /> All posts
          </NuxtLink>
        </div>

        <div class="absolute top-8 right-6 sm:right-12 lg:right-16">
          <span class="text-[10px] font-semibold tracking-widest uppercase border border-white/30 backdrop-blur-md bg-black/40 text-white px-3.5 py-1.5 rounded-md">
            {{ currentPost.category }}
          </span>
        </div>
      </div>

      <!-- Article Content Wrapper -->
      <div class="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16">

        <!-- Title Block -->
        <div class="max-w-[760px] pt-14 pb-10 border-b border-white/10">
          <div class="flex items-center gap-3 text-slate-400 text-xs mb-6">
            <span>{{ currentPost.date }}</span>
            <span class="w-1 h-1 rounded-full bg-white/20" />
            <span class="flex items-center gap-1.5"><Clock :size="12" />{{ currentPost.readTime }}</span>
            <span class="w-1 h-1 rounded-full bg-white/20" />
            <span class="text-white font-medium">Adrian Ilade</span>
          </div>

          <h1 class="text-3xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
            {{ currentPost.title }}
          </h1>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 lg:gap-20 py-14">

          <!-- Article -->
          <article>
            <!-- Lead Excerpt -->
            <p class="text-slate-200 text-lg sm:text-xl leading-relaxed border-l-4 border-emerald-400 pl-6 mb-10 italic">
              {{ currentPost.excerpt }}
            </p>

            <!-- Paragraphs -->
            <div class="text-slate-300 text-sm sm:text-base leading-relaxed space-y-6">
              <p v-for="(para, i) in currentPost.body" :key="i">
                {{ para }}
              </p>

              <blockquote class="border-l-2 border-emerald-400/80 pl-6 py-2 my-8">
                <p class="text-lg sm:text-xl font-bold text-white italic">
                  "To walk a city slowly is to understand it at the speed it was built."
                </p>
              </blockquote>
            </div>

            <!-- Author -->
            <div class="border-t border-white/10 pt-8 mt-12 flex items-center gap-5">
              <div class="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 text-sm font-bold shrink-0">
                AI
              </div>
              <div>
                <p class="text-white text-sm font-bold">Adrian Ilade</p>
                <p class="text-slate-400 text-xs leading-relaxed">
                  Lead guide &amp; founder of GhidCult. Writing about Iași since 2014.
                </p>
              </div>
            </div>
          </article>

          <!-- Sidebar -->
          <aside class="flex flex-col gap-6 lg:sticky lg:top-[92px] self-start">
            <!-- Details -->
            <div class="border border-white/10 bg-neutral-900/50 rounded-2xl p-6 shadow-md">
              <p class="text-[10px] tracking-[0.2em] uppercase text-emerald-400 font-semibold mb-3">Filed under</p>
              <span class="inline-block text-[11px] font-semibold tracking-widest uppercase border border-white/20 bg-white/5 text-slate-200 px-3 py-1 rounded-md">
                {{ currentPost.category }}
              </span>

              <div class="mt-5 pt-5 border-t border-white/10">
                <p class="text-[10px] tracking-[0.2em] uppercase text-emerald-400 font-semibold mb-1">Published</p>
                <p class="text-xs text-slate-300 font-mono">{{ currentPost.date }}</p>
              </div>

              <div class="mt-4 pt-4 border-t border-white/10">
                <p class="text-[10px] tracking-[0.2em] uppercase text-emerald-400 font-semibold mb-1">Reading time</p>
                <p class="text-xs text-slate-300 font-mono flex items-center gap-1.5">
                  <Clock :size="12" class="text-emerald-400" />{{ currentPost.readTime }}
                </p>
              </div>
            </div>

            <!-- Tour Promo -->
            <div class="border border-white/10 bg-neutral-900/80 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
              <p class="text-xs text-slate-300 leading-relaxed">
                Want to see these places in person? Adrian runs small-group tours every week.
              </p>
              <NuxtLink
                to="/tours"
                class="flex items-center justify-between text-xs font-bold text-neutral-900 bg-white hover:bg-neutral-100 px-4 py-3 rounded-xl transition-all shadow-md active:scale-95"
              >
                Browse tours <ArrowRight :size="14" />
              </NuxtLink>
            </div>
          </aside>
        </div>

        <!-- Posts Suggestions -->
        <div v-if="suggestions.length > 0" class="border-t border-white/10 py-16">
          <p class="text-[11px] tracking-[0.2em] uppercase text-emerald-400 font-semibold mb-2">More reading</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-white mb-8 tracking-tight">You might like</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NuxtLink
              v-for="p in suggestions"
              :key="p.id"
              :to="`/blog/${p.id}`"
              class="group flex gap-4 border border-white/10 hover:border-white/20 bg-neutral-900/50 rounded-xl overflow-hidden transition-all duration-300 shadow-md"
            >
              <div class="w-32 sm:w-36 h-28 shrink-0 overflow-hidden">
                <img
                  :src="p.img"
                  :alt="p.title"
                  class="w-full h-full object-cover opacity-75 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500"
                />
              </div>
              <div class="flex flex-col justify-center py-3 pr-4">
                <span class="text-[10px] tracking-widest uppercase text-emerald-400 font-semibold mb-1">{{ p.category }}</span>
                <p class="text-white text-xs sm:text-sm font-bold leading-snug group-hover:text-emerald-400 transition-colors line-clamp-2">{{ p.title }}</p>
                <p class="text-slate-400 text-[11px] font-mono mt-2">{{ p.readTime }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowRight, Clock } from 'lucide-vue-next'
import { posts, categories } from '~/data/blog'

const activeCategory = ref('All')

// Separate featured and normal posts
const featuredPost = computed(() => posts.find((p) => p.featured) || posts[0])
const regularPosts = computed(() => posts.filter((p) => p.id !== featuredPost.value?.id))

// Filter regular posts by category
const filteredPosts = computed(() => {
  if (activeCategory.value === 'All') return regularPosts.value
  return regularPosts.value.filter((p) => p.category === activeCategory.value)
})

useHead({
  title: 'The Blog | GhidCult'
})
</script>

<template>
  <div class="pt-[72px] min-h-screen">

    <!-- Header -->
    <div class="border-b border-white/10">
      <div class="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 py-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p class="text-[11px] tracking-[0.25em] uppercase text-emerald-400 font-semibold mb-3">
            Notes from the field
          </p>
          <h1 class="text-4xl sm:text-6xl font-extrabold text-white leading-[0.95] tracking-tight">
            The Blog
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-slate-400 max-w-[380px] leading-relaxed">
          Thoughts on Iași, on guiding, on history, and on what it means to really know a place. Written by Adrian Ilade.
        </p>
      </div>
    </div>

    <!-- Featured Post -->
    <div v-if="featuredPost" class="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 py-14 border-b border-white/10">
      <p class="text-[10px] tracking-[0.3em] uppercase text-emerald-400 font-semibold mb-6">
        Latest post
      </p>

      <NuxtLink 
        :to="`/blog/${featuredPost.id}`" 
        class="group grid grid-cols-1 md:grid-cols-[1fr_480px] gap-0 border border-white/10 hover:border-white/25 rounded-2xl bg-neutral-900/40 transition-all duration-300 overflow-hidden shadow-xl"
      >
        <div class="relative h-[280px] md:h-auto overflow-hidden">
          <img
            :src="featuredPost.img"
            :alt="featuredPost.title"
            class="w-full h-full object-cover opacity-75 group-hover:scale-[1.03] group-hover:opacity-95 transition-all duration-700"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-transparent to-[#030f0e] hidden md:block" />
          <div class="absolute inset-0 bg-gradient-to-t from-[#030f0e] to-transparent md:hidden" />

          <span class="absolute top-5 left-5 text-[10px] tracking-[0.2em] uppercase border border-white/40 text-white backdrop-blur-md bg-black/40 px-3 py-1.5 rounded-md">
            {{ featuredPost.category }}
          </span>
        </div>

        <!-- Text Block -->
        <div class="flex flex-col justify-between p-8 sm:p-10 md:p-12">
          <div>
            <div class="flex items-center gap-3 text-slate-400 text-xs mb-4">
              <span>{{ featuredPost.date }}</span>
              <span class="w-1 h-1 rounded-full bg-white/20" />
              <span class="flex items-center gap-1.5"><Clock :size="12" />{{ featuredPost.readTime }}</span>
            </div>

            <h2 class="text-2xl sm:text-3xl font-bold text-white leading-tight mb-4 group-hover:text-emerald-400 transition-colors">
              {{ featuredPost.title }}
            </h2>

            <p class="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3">
              {{ featuredPost.excerpt }}
            </p>
          </div>

          <div class="flex items-center gap-2 text-xs sm:text-sm text-slate-300 group-hover:text-white transition-colors mt-8">
            Read article <ArrowRight :size="14" />
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- All Posts -->
    <div class="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 py-14">

      <!-- Category Filter Buttons -->
      <div class="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div class="flex flex-wrap gap-2.5">
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            @click="activeCategory = cat"
            :class="[
              'text-[11px] font-semibold tracking-widest uppercase px-4 py-2 rounded-lg border transition-all duration-200',
              activeCategory === cat
                ? 'border-white bg-white text-neutral-950 shadow-md'
                : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white bg-neutral-900/40'
            ]"
          >
            {{ cat }}
          </button>
        </div>

        <p class="text-xs text-slate-400 font-mono">
          {{ filteredPosts.length }} {{ filteredPosts.length === 1 ? 'post' : 'posts' }}
        </p>
      </div>

      <div v-if="filteredPosts.length === 0" class="text-slate-500 text-center py-20 text-sm">
        No posts in this category yet.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <NuxtLink
          v-for="post in filteredPosts"
          :key="post.id"
          :to="`/blog/${post.id}`"
          class="group flex flex-col border border-white/10 hover:border-white/20 bg-neutral-900/60 rounded-2xl overflow-hidden transition-all duration-300 shadow-xl"
        >
          <div class="relative overflow-hidden h-48 sm:h-52">
            <img
              :src="post.img"
              :alt="post.title"
              class="w-full h-full object-cover opacity-70 group-hover:scale-[1.04] group-hover:opacity-95 transition-all duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[#030f0e]/60 to-transparent" />
            <span class="absolute top-4 left-4 text-[10px] tracking-[0.2em] uppercase border border-white/30 text-white backdrop-blur-md bg-black/40 px-2.5 py-1 rounded-md">
              {{ post.category }}
            </span>
          </div>

          <div class="flex flex-col flex-1 p-6">
            <div class="flex items-center gap-3 text-slate-400 text-xs mb-3">
              <span>{{ post.date }}</span>
              <span class="w-1 h-1 rounded-full bg-white/20" />
              <span class="flex items-center gap-1"><Clock :size="11" />{{ post.readTime }}</span>
            </div>

            <h3 class="text-base sm:text-lg font-bold text-white leading-snug mb-2 group-hover:text-emerald-400 transition-colors">
              {{ post.title }}
            </h3>

            <p class="text-xs text-slate-400 leading-relaxed line-clamp-3 flex-1">
              {{ post.excerpt }}
            </p>

            <div class="flex items-center gap-1.5 text-xs text-slate-400 group-hover:text-white transition-colors mt-6">
              Read <ArrowRight :size="12" />
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Newsletter -->
    <div class="border-t border-white/10 bg-neutral-950/40 mt-8">
      <div class="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <p class="text-[11px] tracking-[0.25em] uppercase text-emerald-400 font-semibold mb-2">Never miss a post</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">Get new writing by email</h2>
        </div>

        <form @submit.prevent class="flex flex-col sm:flex-row items-stretch gap-2 w-full md:w-auto">
          <input
            type="email"
            placeholder="your@email.com"
            class="bg-neutral-900 border border-white/15 text-sm text-white placeholder:text-slate-500 px-5 py-3.5 rounded-full sm:rounded-r-none outline-none focus:border-emerald-400 transition-colors w-full sm:w-[280px]"
          />
          <button
            type="submit"
            class="bg-white hover:bg-neutral-100 text-neutral-900 text-sm font-bold px-6 py-3.5 rounded-full sm:rounded-l-none transition-all duration-200 shadow-md whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>

  </div>
</template>
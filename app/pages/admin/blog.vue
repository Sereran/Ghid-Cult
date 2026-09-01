<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Plus, Pencil, Trash2, Eye } from 'lucide-vue-next'
import { posts } from '~/data/blog'

definePageMeta({
  layout: 'admin'
})

const query = ref('')
const published = ref<Record<string, boolean>>(
  Object.fromEntries(posts.map((p) => [p.id, true]))
)

const filtered = computed(() => {
  const q = query.value.toLowerCase().trim()
  if (!q) return posts
  return posts.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  )
})

const togglePublished = (id: string) => {
  published.value[id] = !published.value[id]
}

useHead({
  title: 'Manage Blog Posts | Admin'
})
</script>

<template>
  <div class="flex flex-col gap-6 max-w-[1200px]">

    <!-- Header -->
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <p class="text-[11px] tracking-[0.2em] uppercase text-white/30 mb-1">Manage</p>
        <h1 class="text-3xl font-extrabold text-white tracking-tight">Blog posts</h1>
      </div>
      <button 
        type="button" 
        class="flex items-center gap-2 bg-white hover:bg-neutral-100 text-neutral-950 text-xs font-bold px-5 py-2.5 rounded-full transition-all shadow-md active:scale-95"
      >
        <Plus :size="14" />
        New post
      </button>
    </div>

    <!-- Search Input -->
    <div class="flex items-center gap-2 border border-white/10 rounded-xl px-4 py-3 w-full max-w-[360px] bg-white/[0.02] focus-within:border-emerald-400/50 transition-colors">
      <Search :size="14" class="text-white/30 shrink-0" />
      <input
        v-model="query"
        type="text"
        placeholder="Search posts…"
        class="bg-transparent flex-1 text-xs text-white placeholder:text-white/20 outline-none"
      />
    </div>

    <!-- Table -->
    <div class="border border-white/10 rounded-xl bg-white/[0.01] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-white/5 bg-white/[0.02]">
              <th 
                v-for="h in ['Post', 'Category', 'Date', 'Read time', 'Published', 'Actions']" 
                :key="h" 
                class="px-5 py-3 text-[10px] tracking-widest uppercase text-white/30 font-semibold whitespace-nowrap"
              >
                {{ h }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr
              v-for="post in filtered"
              :key="post.id"
              class="hover:bg-white/[0.02] transition-colors group text-xs"
            >
              <!-- Post Info -->
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 shrink-0 overflow-hidden rounded-lg border border-white/10">
                    <img :src="post.img" :alt="post.title" class="w-full h-full object-cover opacity-60" />
                  </div>
                  <p class="font-bold text-white/80 leading-snug max-w-[280px] line-clamp-2">{{ post.title }}</p>
                </div>
              </td>

              <!-- Category -->
              <td class="px-5 py-3.5">
                <span class="text-[10px] tracking-widest uppercase border border-white/10 rounded px-2 py-1 text-white/50">
                  {{ post.category }}
                </span>
              </td>

              <!-- Date -->
              <td class="px-5 py-3.5 text-white/40 whitespace-nowrap">{{ post.date }}</td>

              <!-- Read Time -->
              <td class="px-5 py-3.5 text-white/40 whitespace-nowrap">{{ post.readTime }}</td>

              <!-- Published Toggle Switch -->
              <td class="px-5 py-3.5">
                <button
                  type="button"
                  @click="togglePublished(post.id)"
                  :class="[
                    'relative w-9 h-5 rounded-full transition-colors',
                    published[post.id] ? 'bg-emerald-500/30' : 'bg-white/10'
                  ]"
                >
                  <span
                    :class="[
                      'absolute top-0.5 w-4 h-4 rounded-full transition-all',
                      published[post.id] ? 'left-4 bg-emerald-400 shadow-sm' : 'left-0.5 bg-white/30'
                    ]"
                  />
                </button>
              </td>

              <!-- Action Buttons -->
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <NuxtLink
                    :to="`/blog/${post.id}`"
                    class="w-7 h-7 rounded flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                    title="View public post"
                  >
                    <Eye :size="14" />
                  </NuxtLink>
                  <button 
                    type="button" 
                    class="w-7 h-7 rounded flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                    title="Edit post"
                  >
                    <Pencil :size="13" />
                  </button>
                  <button 
                    type="button" 
                    class="w-7 h-7 rounded flex items-center justify-center text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete post"
                  >
                    <Trash2 :size="13" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="filtered.length === 0" class="text-white/30 text-xs text-center py-12">
        No posts match your search.
      </p>
    </div>

    <p class="text-[11px] text-white/30 font-mono">{{ filtered.length }} of {{ posts.length }} posts</p>
  </div>
</template>
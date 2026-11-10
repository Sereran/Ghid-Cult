<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Plus, Pencil, Trash2, Eye, Loader2, Star } from '@lucide/vue'
import type { ArticleRecord, ArticleStatus } from '~/data/blog'

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Manage Blog Posts | Admin',
})

const query = ref('')
const activeStatus = ref<ArticleStatus | ''>('')
const actionLoadingId = ref<string | null>(null)

// Fetch articles from database
const { data, pending, refresh } = await useFetch<{ success: boolean; total: number; articles: ArticleRecord[] }>(
  '/api/admin/blog',
  {
    query: computed(() => ({
      search: query.value.trim() || undefined,
      status: activeStatus.value || undefined,
    })),
    watch: [query, activeStatus],
  }
)

const articles = computed(() => data.value?.articles || [])

// Toggle Article Published Status
const togglePublished = async (post: ArticleRecord) => {
  actionLoadingId.value = post.id
  const nextStatus: ArticleStatus = post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'

  try {
    await $fetch(`/api/admin/blog/${post.id}`, {
      method: 'PATCH',
      body: { status: nextStatus },
    })
    post.status = nextStatus
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to update post status.')
  } finally {
    actionLoadingId.value = null
  }
}

// Toggle Featured State
const toggleFeatured = async (post: ArticleRecord) => {
  actionLoadingId.value = post.id
  const nextFeatured = !post.isFeatured

  try {
    await $fetch(`/api/admin/blog/${post.id}`, {
      method: 'PATCH',
      body: { isFeatured: nextFeatured },
    })
    post.isFeatured = nextFeatured
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to update featured state.')
  } finally {
    actionLoadingId.value = null
  }
}

// Delete Post
const deleteArticle = async (post: ArticleRecord) => {
  const confirmed = confirm(`Are you sure you want to delete "${post.title}"?`)
  if (!confirmed) return

  actionLoadingId.value = post.id
  try {
    await $fetch(`/api/admin/blog/${post.id}`, {
      method: 'DELETE',
    })
    await refresh()
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to delete article.')
  } finally {
    actionLoadingId.value = null
  }
}

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return 'Draft'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="flex flex-col gap-6 max-w-[1200px]">

    <!-- Header -->
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <p class="text-[11px] tracking-[0.2em] uppercase text-white/30 mb-1">Manage</p>
        <h1 class="text-3xl font-extrabold text-white tracking-tight">Blog posts</h1>
      </div>
      <NuxtLink 
        to="/admin/blog/create"
        class="flex items-center gap-2 bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
      >
        <Plus :size="14" />
        New post
      </NuxtLink>
    </div>

    <!-- Filters Bar -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2 border border-white/10 rounded-xl px-4 py-2.5 w-full sm:w-[320px] bg-white/[0.02] focus-within:border-emerald-400/50 transition-colors">
        <Search :size="14" class="text-white/30 shrink-0" />
        <input
          v-model="query"
          type="text"
          placeholder="Search posts…"
          class="bg-transparent flex-1 text-xs text-white placeholder:text-white/20 outline-none"
        />
      </div>

      <div class="flex items-center gap-1 border border-white/10 rounded-xl p-1 bg-white/[0.02] text-xs">
        <button
          type="button"
          :class="['px-3 py-1.5 rounded-lg transition-colors', !activeStatus ? 'bg-white/10 text-white font-semibold' : 'text-white/40 hover:text-white']"
          @click="activeStatus = ''"
        >
          All
        </button>
        <button
          type="button"
          :class="['px-3 py-1.5 rounded-lg transition-colors', activeStatus === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-400 font-semibold' : 'text-white/40 hover:text-white']"
          @click="activeStatus = 'PUBLISHED'"
        >
          Published
        </button>
        <button
          type="button"
          :class="['px-3 py-1.5 rounded-lg transition-colors', activeStatus === 'DRAFT' ? 'bg-white/10 text-white font-semibold' : 'text-white/40 hover:text-white']"
          @click="activeStatus = 'DRAFT'"
        >
          Drafts
        </button>
      </div>
    </div>

    <!-- Articles Table -->
    <div class="border border-white/10 rounded-xl bg-white/[0.01] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-white/5 bg-white/[0.02]">
              <th 
                v-for="h in ['Post', 'Category', 'Date', 'Read time', 'Featured', 'Published', 'Actions']" 
                :key="h" 
                class="px-5 py-3 text-[10px] tracking-widest uppercase text-white/30 font-semibold whitespace-nowrap"
              >
                {{ h }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr v-if="pending && articles.length === 0">
              <td colspan="7" class="px-5 py-12 text-center text-white/40 text-xs">
                <Loader2 :size="18" class="animate-spin inline mr-2 text-emerald-400" />
                Loading blog posts…
              </td>
            </tr>

            <tr
              v-for="post in articles"
              :key="post.id"
              class="hover:bg-white/[0.02] transition-colors group text-xs"
            >
              <!-- Post Info -->
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                    <img 
                      :src="post.imageUrl" 
                      :alt="post.title" 
                      class="w-full h-full object-cover opacity-80" 
                      @error="(e: any) => e.target.style.display = 'none'"
                    />
                  </div>
                  <div class="min-w-0">
                    <p class="font-bold text-white/90 leading-snug line-clamp-1 max-w-[280px]">{{ post.title }}</p>
                    <p v-if="post.tour" class="text-[10px] text-emerald-400/80 truncate">
                      Linked: {{ post.tour.title }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Category -->
              <td class="px-5 py-3.5">
                <span class="text-[10px] tracking-widest uppercase border border-white/10 rounded px-2 py-0.5 text-white/50 font-mono">
                  {{ post.category }}
                </span>
              </td>

              <!-- Date -->
              <td class="px-5 py-3.5 text-white/40 whitespace-nowrap">
                {{ formatDate(post.publishedAt || post.createdAt) }}
              </td>

              <!-- Read Time -->
              <td class="px-5 py-3.5 text-white/40 whitespace-nowrap font-mono">
                {{ post.readTime }}
              </td>

              <!-- Featured Toggle -->
              <td class="px-5 py-3.5">
                <button
                  type="button"
                  :disabled="actionLoadingId === post.id"
                  @click="toggleFeatured(post)"
                  :class="[
                    'p-1.5 rounded-lg border transition-all',
                    post.isFeatured
                      ? 'bg-amber-400/15 border-amber-400/40 text-amber-300'
                      : 'border-white/10 text-white/20 hover:text-white/60 hover:border-white/20'
                  ]"
                  :title="post.isFeatured ? 'Featured on hero banner (click to unfeature)' : 'Mark as featured'"
                >
                  <Star :size="14" :class="post.isFeatured ? 'fill-amber-400' : ''" />
                </button>
              </td>

              <!-- Status Switch -->
              <td class="px-5 py-3.5">
                <button
                  type="button"
                  :disabled="actionLoadingId === post.id"
                  @click="togglePublished(post)"
                  :class="[
                    'relative w-9 h-5 rounded-full transition-colors',
                    post.status === 'PUBLISHED' ? 'bg-emerald-500/30' : 'bg-white/10'
                  ]"
                >
                  <span
                    :class="[
                      'absolute top-0.5 w-4 h-4 rounded-full transition-all',
                      post.status === 'PUBLISHED' ? 'left-4 bg-emerald-400 shadow-sm' : 'left-0.5 bg-white/30'
                    ]"
                  />
                </button>
              </td>

              <!-- Actions -->
              <td class="px-5 py-3.5 whitespace-nowrap">
                <div class="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  <NuxtLink
                    :to="`/blog/${post.slug}`"
                    target="_blank"
                    class="w-7 h-7 rounded flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                    title="View public post"
                  >
                    <Eye :size="14" />
                  </NuxtLink>

                  <NuxtLink 
                    :to="`/admin/blog/${post.id}`"
                    class="w-7 h-7 rounded flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                    title="Edit post"
                  >
                    <Pencil :size="13" />
                  </NuxtLink>

                  <button 
                    type="button" 
                    :disabled="actionLoadingId === post.id"
                    class="w-7 h-7 rounded flex items-center justify-center text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete post"
                    @click="deleteArticle(post)"
                  >
                    <Trash2 :size="13" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="!pending && articles.length === 0" class="text-white/30 text-xs text-center py-12">
        No articles found.
      </p>
    </div>

    <p class="text-[11px] text-white/30 font-mono">Showing {{ articles.length }} post(s)</p>
  </div>
</template>
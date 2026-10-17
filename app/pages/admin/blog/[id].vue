<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, Loader2 } from '@lucide/vue'
import { BLOG_CATEGORIES, type ArticleRecord } from '~/data/blog'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Edit Article | Admin' })

const route = useRoute()
const articleId = route.params.id as string

const { data: toursData } = await useFetch<{ success: boolean; tours: any[] }>('/api/admin/tours?isActive=true')
const availableTours = computed(() => toursData.value?.tours || [])

const { data: articleData, pending } = await useFetch<{ success: boolean; article: ArticleRecord }>(`/api/admin/blog/${articleId}`)

const submitting = ref(false)
const article = computed(() => articleData.value?.article)

const form = ref({
  title: article.value?.title || '',
  category: article.value?.category || 'History',
  imageUrl: article.value?.imageUrl || '',
  tourId: article.value?.tourId || '',
  shortDescription: article.value?.shortDescription || '',
  quotes: article.value?.quotes || '',
  content: article.value?.content || '',
  status: article.value?.status || 'PUBLISHED',
})

watch(article, (val) => {
  if (val) {
    form.value = {
      title: val.title,
      category: val.category,
      imageUrl: val.imageUrl,
      tourId: val.tourId || '',
      shortDescription: val.shortDescription,
      quotes: val.quotes || '',
      content: val.content,
      status: val.status,
    }
  }
}, { immediate: true })

const updateArticle = async () => {
  submitting.value = true
  try {
    await $fetch(`/api/admin/blog/${articleId}`, {
      method: 'PATCH',
      body: {
        ...form.value,
        tourId: form.value.tourId || null,
      },
    })
    return navigateTo('/admin/blog')
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to update article.')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div v-if="!pending && article" class="max-w-4xl space-y-6 text-white pb-16">
    <div class="flex items-center justify-between border-b border-white/5 pb-4">
      <div class="flex items-center gap-3">
        <NuxtLink to="/admin/blog" class="p-2 rounded-lg border border-white/10 text-white/50 hover:text-white transition-colors">
          <ArrowLeft :size="16" />
        </NuxtLink>
        <div>
          <p class="text-[10px] tracking-widest uppercase text-white/30">Edit Article</p>
          <h1 class="text-2xl font-bold truncate max-w-md">{{ form.title }}</h1>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <select v-model="form.status" class="bg-[#18181b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none">
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
        </select>
        <button 
          @click="updateArticle" 
          :disabled="submitting"
          class="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-5 py-2 rounded-xl text-xs transition-colors disabled:opacity-50"
        >
          <Loader2 v-if="submitting" :size="14" class="animate-spin" />
          {{ submitting ? 'Updating…' : 'Save Changes' }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-xs uppercase tracking-wider text-white/40 mb-1.5 font-semibold">Title *</label>
        <input v-model="form.title" type="text" class="w-full bg-white/[0.02] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-400" />
      </div>
      <div>
        <label class="block text-xs uppercase tracking-wider text-white/40 mb-1.5 font-semibold">Category *</label>
        <select v-model="form.category" class="w-full bg-[#18181b] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-400">
          <option v-for="cat in BLOG_CATEGORIES" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-xs uppercase tracking-wider text-white/40 mb-1.5 font-semibold">Image URL *</label>
        <input v-model="form.imageUrl" type="text" class="w-full bg-white/[0.02] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-400" />
      </div>
      <div>
        <label class="block text-xs uppercase tracking-wider text-white/40 mb-1.5 font-semibold">Linked Tour</label>
        <select v-model="form.tourId" class="w-full bg-[#18181b] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-400">
          <option value="">-- No Tour Linked --</option>
          <option v-for="t in availableTours" :key="t.id" :value="t.id">{{ t.title }}</option>
        </select>
      </div>
    </div>

    <div>
      <label class="block text-xs uppercase tracking-wider text-white/40 mb-1.5 font-semibold">Short Description *</label>
      <textarea v-model="form.shortDescription" rows="2" class="w-full bg-white/[0.02] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-400 resize-none" />
    </div>

    <div>
      <label class="block text-xs uppercase tracking-wider text-white/40 mb-1.5 font-semibold">Pull Quote</label>
      <input v-model="form.quotes" type="text" class="w-full bg-white/[0.02] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-400" />
    </div>

    <div>
      <label class="block text-xs uppercase tracking-wider text-white/40 mb-2 font-semibold">Content (Tiptap)</label>
      <div class="border border-white/10 rounded-xl overflow-hidden bg-white/[0.01]">
        <RichTextEditor v-model="form.content" />
      </div>
    </div>
  </div>
</template>
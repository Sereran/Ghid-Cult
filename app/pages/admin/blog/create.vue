<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { ArrowLeft, Loader2, ChevronDown, ChevronUp, Upload, X } from '@lucide/vue'
import { BLOG_CATEGORIES } from '~/data/blog'

definePageMeta({ layout: 'admin' })

useHead({ title: 'New Article | Admin' })

// Fetch active tours to link a tour
const { data: toursData } = await useFetch<{ success: boolean; tours: any[] }>('/api/admin/tours?isActive=true')
const availableTours = computed(() => toursData.value?.tours || [])

const submitting = ref(false)
const uploading = ref(false)
const showMetaSettings = ref(true)
const fileInputRef = ref<HTMLInputElement | null>(null)

const form = reactive({
  title: '',
  slug: '',
  category: 'Symbolic Iași',
  imageUrl: '',
  shortDescription: '',
  tourId: '',
  quotes: '',
  content: '<p>Start typing your document here...</p>',
  isFeatured: false,
  status: 'PUBLISHED' as 'PUBLISHED' | 'DRAFT',
})

// Handle file selection and upload
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  uploading.value = true
  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await $fetch<{ success: boolean; url: string }>('/api/admin/upload', {
      method: 'POST',
      body: formData,
    })
    form.imageUrl = res.url
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to upload image.')
  } finally {
    uploading.value = false
    target.value = ''
  }
}

const saveArticle = async () => {
  if (!form.title || !form.imageUrl || !form.shortDescription || !form.content) {
    alert('Please complete the title, image URL, short description, and content.')
    return
  }

  submitting.value = true
  try {
    await $fetch('/api/admin/blog', {
      method: 'POST',
      body: {
        ...form,
        tourId: form.tourId || undefined,
      },
    })
    return navigateTo('/admin/blog')
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to publish article.')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-[1400px] mx-auto text-white pb-32">
    <!-- Top Action Bar -->
    <div class="sticky top-0 z-30 bg-[#020b0a]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 -mx-8 mb-8">
      <div class="flex items-center gap-3 min-w-0">
        <NuxtLink 
          to="/admin/blog" 
          class="p-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-colors shrink-0"
        >
          <ArrowLeft :size="16" />
        </NuxtLink>
        <div class="min-w-0">
          <p class="text-[10px] tracking-widest uppercase text-white/30 font-mono">Blog Document</p>
          <h1 class="text-base sm:text-lg font-bold truncate text-white">
            {{ form.title || 'Untitled Article' }}
          </h1>
        </div>
      </div>

      <div class="flex items-center gap-2.5 shrink-0">
        <!-- Article Info toggle -->
        <button
          type="button"
          @click="showMetaSettings = !showMetaSettings"
          class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs border border-white/10 hover:border-white/20 text-white/70 hover:text-white transition-colors"
        >
          <span>Article Info</span>
          <ChevronUp v-if="showMetaSettings" :size="14" />
          <ChevronDown v-else :size="14" />
        </button>

        <!-- Featured Toggle Button -->
        <button
          type="button"
          @click="form.isFeatured = !form.isFeatured"
          :class="[
            'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs border transition-colors cursor-pointer',
            form.isFeatured
              ? 'bg-amber-400/15 border-amber-400/40 text-amber-300 font-semibold'
              : 'border-white/10 bg-white/5 text-white/40 hover:text-white'
          ]"
          title="Feature this post on hero banner"
        >
          <span>★</span>
          <span>{{ form.isFeatured ? 'Featured' : 'Regular' }}</span>
        </button>

        <!-- Status Select -->
        <select 
          v-model="form.status" 
          class="bg-[#141416] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
        >
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
        </select>

        <!-- Submit -->
        <button 
          @click="saveArticle" 
          :disabled="submitting"
          class="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-5 py-2 rounded-xl text-xs transition-colors shadow-lg shadow-emerald-500/10 disabled:opacity-50"
        >
          <Loader2 v-if="submitting" :size="14" class="animate-spin" />
          {{ submitting ? 'Saving…' : 'Save Document' }}
        </button>
      </div>
    </div>

    <!-- Collapsible Metadata Box -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 -translate-y-2 max-h-0 overflow-hidden"
      enter-to-class="opacity-100 translate-y-0 max-h-[1000px]"
      leave-from-class="opacity-100 translate-y-0 max-h-[1000px]"
      leave-to-class="opacity-0 -translate-y-2 max-h-0 overflow-hidden"
    >
      <div v-if="showMetaSettings" class="bg-white/[0.02] border border-white/10 rounded-2xl p-6 mb-8 space-y-4">
        <!-- Title and Category -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-2">
            <label class="block text-xs uppercase tracking-wider text-white/40 mb-1.5 font-semibold">Title *</label>
            <input 
              v-model="form.title" 
              type="text" 
              required 
              placeholder="e.g. Echoes of the Copou Lindens"
              class="w-full bg-[#121214] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-400 transition-colors"
            />
          </div>

          <div>
            <label class="block text-xs uppercase tracking-wider text-white/40 mb-1.5 font-semibold">Category *</label>
            <select 
              v-model="form.category" 
              class="w-full bg-[#121214] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-400 transition-colors"
            >
              <option v-for="cat in BLOG_CATEGORIES" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
        </div>

        <!-- Header Image Upload and Tour Link -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs uppercase tracking-wider text-white/40 mb-1.5 font-semibold">Header Image *</label>
            
            <input
              ref="fileInputRef"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFileUpload"
            />

            <div class="flex items-center gap-2">
              <button
                type="button"
                :disabled="uploading"
                @click="fileInputRef?.click()"
                class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white whitespace-nowrap transition-colors disabled:opacity-50"
              >
                <Loader2 v-if="uploading" :size="14" class="animate-spin text-emerald-400" />
                <Upload v-else :size="14" class="text-emerald-400" />
                {{ uploading ? 'Uploading…' : 'Upload from Device' }}
              </button>

              <span class="text-xs text-white/30 font-mono">or URL:</span>

              <input 
                v-model="form.imageUrl" 
                type="text" 
                required 
                placeholder="/uploads/... or https://..."
                class="flex-1 min-w-0 bg-[#121214] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-400 transition-colors font-mono"
              />
            </div>

            <!-- Preview thumbnail -->
            <div v-if="form.imageUrl" class="mt-3 relative w-36 h-20 rounded-xl overflow-hidden border border-white/15 bg-black/40">
              <img :src="form.imageUrl" alt="Header Preview" class="w-full h-full object-cover" />
              <button
                type="button"
                @click="form.imageUrl = ''"
                class="absolute top-1 right-1 p-1 rounded-full bg-black/70 hover:bg-rose-500 text-white transition-colors"
                title="Remove image"
              >
                <X :size="12" />
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs uppercase tracking-wider text-white/40 mb-1.5 font-semibold">Link to Tour (Optional)</label>
            <select 
              v-model="form.tourId" 
              class="w-full bg-[#121214] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-400 transition-colors"
            >
              <option value="">-- No Tour Linked --</option>
              <option v-for="t in availableTours" :key="t.id" :value="t.id">{{ t.title }}</option>
            </select>
          </div>
        </div>

        <!-- Short Excerpt and Pull Quote -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs uppercase tracking-wider text-white/40 mb-1.5 font-semibold">Short Excerpt *</label>
            <textarea 
              v-model="form.shortDescription" 
              rows="2" 
              required 
              placeholder="Brief 1-2 sentence hook shown on cards..."
              class="w-full bg-[#121214] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-400 transition-colors resize-none"
            />
          </div>

          <div>
            <label class="block text-xs uppercase tracking-wider text-white/40 mb-1.5 font-semibold">Pull Quote (Optional)</label>
            <textarea 
              v-model="form.quotes" 
              rows="2" 
              placeholder="A memorable statement from the piece..."
              class="w-full bg-[#121214] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-400 transition-colors resize-none"
            />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Document Canvas -->
    <div class="flex justify-center">
      <div class="w-full max-w-[960px] min-h-[900px] bg-[#0d1413] border border-white/10 rounded-2xl shadow-2xl flex flex-col">
        <RichTextEditor v-model="form.content" />
      </div>
    </div>
  </div>
</template>
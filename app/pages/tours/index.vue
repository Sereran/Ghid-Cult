<script setup lang="ts">
import { ref, computed } from 'vue'
import { MapPin, Clock, Users, Star, Search, Loader2 } from '@lucide/vue'

useHead({
  title: 'All Guided Tours | GhidCult',
})

const activeTag = ref('All')
const query = ref('')

// Fetch public tours
const { data, pending } = await useFetch<{
  success: boolean
  tags: string[]
  tours: any[]
}>('/api/tours', {
  query: computed(() => ({
    search: query.value.trim() || undefined,
    tag: activeTag.value !== 'All' ? activeTag.value : undefined,
  })),
  watch: [query, activeTag],
})

const tours = computed(() => data.value?.tours || [])
const availableTags = computed(() => data.value?.tags || ['All'])
</script>

<template>
  <div class="pt-[72px] min-h-screen">
    <!-- Header -->
    <div class="py-16 md:py-20 px-6 sm:px-12 lg:px-16 max-w-[1440px] mx-auto border-b border-white/10">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p class="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-2 font-mono">Curated Experiences</p>
          <h1 class="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
            All tours
          </h1>
        </div>

        <!-- Search Bar -->
        <div class="flex items-center gap-3 bg-neutral-900/80 border border-white/10 rounded-2xl px-5 py-3.5 w-full md:w-[360px] focus-within:border-emerald-400/50 transition-colors shadow-inner">
          <Search :size="16" class="text-white/40 shrink-0" />
          <input
            v-model="query"
            type="text"
            placeholder="Search tours or locations…"
            class="bg-transparent flex-1 text-sm text-white placeholder:text-white/30 outline-none"
          />
        </div>
      </div>

      <!-- Tag Filters -->
      <div class="flex flex-wrap gap-2.5 mt-8">
        <button
          v-for="tag in availableTags"
          :key="tag"
          type="button"
          @click="activeTag = tag"
          :class="[
            'text-[11px] font-semibold tracking-widest uppercase px-4 py-2 rounded-lg border transition-all duration-200',
            activeTag === tag
              ? 'border-white bg-white text-neutral-950 shadow-md font-bold'
              : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white bg-neutral-900/40'
          ]"
        >
          {{ tag }}
        </button>
      </div>
    </div>

    <!-- Tours Grid -->
    <div class="py-16 px-6 sm:px-12 lg:px-16 max-w-[1440px] mx-auto">
      <div v-if="pending && tours.length === 0" class="text-white/40 py-24 text-center">
        <Loader2 :size="24" class="animate-spin inline mr-2 text-emerald-400" />
        Loading guided tours…
      </div>

      <div v-else-if="tours.length === 0" class="text-white/40 text-base py-24 text-center">
        No tours match your search criteria.
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="tour in tours"
          :key="tour.id"
          class="group relative overflow-hidden bg-neutral-900/60 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl flex flex-col"
        >
          <NuxtLink :to="`/tours/${tour.slug || tour.id}`" class="block flex-1 flex flex-col">
            <div class="h-48 overflow-hidden relative bg-black/40">
              <img
                :src="tour.imageUrl"
                :alt="tour.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                @error="(e: any) => e.target.style.display = 'none'"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent" />
              
              <!-- Tag Badge -->
              <span class="absolute top-3 left-3 text-[10px] font-semibold tracking-widest uppercase border border-white/30 backdrop-blur-md bg-black/50 text-white px-2.5 py-1 rounded-md font-mono">
                {{ tour.mainTag || (tour.tags?.[0] || 'Tour') }}
              </span>
            </div>

            <div class="p-5 flex flex-col gap-3 flex-1">
              <h3 class="text-white text-base font-bold leading-snug group-hover:text-emerald-400 transition-colors">
                {{ tour.title }}
              </h3>
              
              <p class="text-slate-400 text-xs leading-relaxed line-clamp-2">
                {{ tour.shortDescription }}
              </p>

              <!-- Specifications -->
              <div class="flex flex-wrap gap-x-4 gap-y-1 text-slate-400 text-xs mt-auto pt-2 font-mono">
                <span class="flex items-center gap-1"><MapPin :size="12" />{{ tour.location }}</span>
                <span class="flex items-center gap-1"><Clock :size="12" />{{ tour.duration }}</span>
                <span class="flex items-center gap-1"><Users :size="12" />Up to {{ tour.maxPersons }}</span>
              </div>
            </div>
          </NuxtLink>

          <!-- Price and Actions -->
          <div class="px-5 pb-5 flex items-center justify-between border-t border-white/5 pt-4">
            <div>
              <p class="text-slate-500 text-[10px] uppercase tracking-wider font-semibold font-mono">from</p>
              <p class="text-white font-bold text-lg font-mono leading-none mt-0.5">{{ tour.price }} Lei</p>
            </div>

            <div class="flex items-center gap-3">
              <span class="flex items-center gap-1 text-slate-300 text-xs font-semibold font-mono">
                <Star :size="12" class="fill-amber-400 text-amber-400" />{{ tour.rating }}
              </span>
              
              <NuxtLink
                :to="`/tours/${tour.slug || tour.id}`"
                class="bg-white hover:bg-neutral-100 text-neutral-900 text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 shadow-sm active:scale-95 whitespace-nowrap"
              >
                Book tour
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
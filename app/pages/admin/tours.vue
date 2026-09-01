<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Plus, Pencil, Trash2, Eye, Star } from 'lucide-vue-next'
import { tours } from '~/data/tours'

definePageMeta({
  layout: 'admin'
})

const query = ref('')
const active = ref<Record<string, boolean>>(
  Object.fromEntries(tours.map((t) => [t.id, true]))
)

const filtered = computed(() => {
  const q = query.value.toLowerCase().trim()
  if (!q) return tours
  return tours.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.tag.toLowerCase().includes(q)
  )
})

const toggleActive = (id: string) => {
  active.value[id] = !active.value[id]
}

useHead({
  title: 'Manage Tours | Admin'
})
</script>

<template>
  <div class="flex flex-col gap-6 max-w-[1200px]">

    <!-- Header -->
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <p class="text-[11px] tracking-[0.2em] uppercase text-white/30 mb-1">Manage</p>
        <h1 class="text-3xl font-extrabold text-white tracking-tight">Tours</h1>
      </div>
      <button 
        type="button" 
        class="flex items-center gap-2 bg-white hover:bg-neutral-100 text-neutral-950 text-xs font-bold px-5 py-2.5 rounded-full transition-all shadow-md active:scale-95"
      >
        <Plus :size="14" />
        Add tour
      </button>
    </div>

    <!-- Search Input -->
    <div class="flex items-center gap-2 border border-white/10 rounded-xl px-4 py-3 w-full max-w-[360px] bg-white/[0.02] focus-within:border-emerald-400/50 transition-colors">
      <Search :size="14" class="text-white/30 shrink-0" />
      <input
        v-model="query"
        type="text"
        placeholder="Search tours…"
        class="bg-transparent flex-1 text-xs text-white placeholder:text-white/20 outline-none"
      />
    </div>

    <!-- Tours -->
    <div class="border border-white/10 rounded-xl bg-white/[0.01] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-white/5 bg-white/[0.02]">
              <th 
                v-for="h in ['Tour', 'Tag', 'Duration', 'Rating', 'Price', 'Status', 'Actions']" 
                :key="h" 
                class="px-5 py-3 text-[10px] tracking-widest uppercase text-white/30 font-semibold whitespace-nowrap"
              >
                {{ h }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr
              v-for="tour in filtered"
              :key="tour.id"
              class="hover:bg-white/[0.02] transition-colors group text-xs"
            >
              <!-- Tour Info -->
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 shrink-0 overflow-hidden rounded-lg border border-white/10">
                    <img :src="tour.img" :alt="tour.title" class="w-full h-full object-cover opacity-70" />
                  </div>
                  <div class="min-w-0">
                    <p class="font-bold text-white/80 leading-snug line-clamp-1">{{ tour.title }}</p>
                    <p class="text-[11px] text-white/30">{{ tour.location }}</p>
                  </div>
                </div>
              </td>

              <!-- Tag -->
              <td class="px-5 py-3.5">
                <span class="text-[10px] tracking-widest uppercase border border-white/10 rounded px-2 py-1 text-white/50">
                  {{ tour.tag }}
                </span>
              </td>

              <!-- Duration -->
              <td class="px-5 py-3.5 text-white/50 whitespace-nowrap">{{ tour.duration }}</td>

              <!-- Rating -->
              <td class="px-5 py-3.5">
                <span class="flex items-center gap-1 text-white/70">
                  <Star :size="11" class="fill-amber-400 text-amber-400" />
                  {{ tour.rating }}
                  <span class="text-white/30">({{ tour.reviews }})</span>
                </span>
              </td>

              <!-- Price -->
              <td class="px-5 py-3.5 font-bold text-white font-mono">${{ tour.price }}</td>

              <!-- Status Toggle Switch -->
              <td class="px-5 py-3.5">
                <button
                  type="button"
                  @click="toggleActive(tour.id)"
                  :class="[
                    'relative w-9 h-5 rounded-full transition-colors',
                    active[tour.id] ? 'bg-emerald-500/30' : 'bg-white/10'
                  ]"
                >
                  <span
                    :class="[
                      'absolute top-0.5 w-4 h-4 rounded-full transition-all',
                      active[tour.id] ? 'left-4 bg-emerald-400 shadow-sm' : 'left-0.5 bg-white/30'
                    ]"
                  />
                </button>
              </td>

              <!-- Action Buttons -->
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <NuxtLink
                    :to="`/tours/${tour.id}`"
                    class="w-7 h-7 rounded flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                    title="View public tour"
                  >
                    <Eye :size="14" />
                  </NuxtLink>
                  <button 
                    type="button" 
                    class="w-7 h-7 rounded flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                    title="Edit tour"
                  >
                    <Pencil :size="13" />
                  </button>
                  <button 
                    type="button" 
                    class="w-7 h-7 rounded flex items-center justify-center text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete tour"
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
        No tours match your search.
      </p>
    </div>

    <p class="text-[11px] text-white/30 font-mono">{{ filtered.length }} of {{ tours.length }} tours</p>
  </div>
</template>
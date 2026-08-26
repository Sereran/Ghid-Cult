<script setup lang="ts">
import { tours } from '~/data/tours'
import { computed } from 'vue'
import { MapPin, Clock, Users, Star, ArrowLeft, Check, X } from 'lucide-vue-next'

const route = useRoute()

const currentTour = computed(() => tours.find((t) => t.id === route.params.id))

// Related tours
const relatedTours = computed(() => tours.filter((t) => t.id !== route.params.id).slice(0, 3))

// Dynamic head tags
useHead({
  title: computed(() => currentTour.value ? `${currentTour.value.title} | GhidCultural` : 'Tour Not Found | GhidCultural')
})
</script>

<template>
  <div class="pt-[72px] min-h-screen">

    <!-- 404 Page -->
    <div v-if="!currentTour" class="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-6 text-center">
      <p class="text-slate-400 text-lg">Tour not found.</p>
      <NuxtLink to="/tours" class="text-white hover:text-emerald-400 underline text-sm transition-colors">
        Back to all tours
      </NuxtLink>
    </div>

    <!-- Tour Details -->
    <div v-else>
      <div class="relative h-[480px] overflow-hidden bg-[#030f0e]">
        <img 
          :src="currentTour.img" 
          :alt="currentTour.title" 
          class="w-full h-full object-cover opacity-60" 
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[#030f0e] via-[#030f0e]/50 to-black/40" />

        <!-- Back Button -->
        <div class="absolute top-8 left-6 sm:left-12 lg:left-16 z-10">
          <NuxtLink 
            to="/tours" 
            class="inline-flex items-center gap-2 text-white/80 hover:text-white text-xs font-semibold uppercase tracking-wider bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 transition-colors"
          >
            <ArrowLeft :size="14" /> All tours
          </NuxtLink>
        </div>

        <!-- Tag Badge -->
        <div class="absolute top-8 right-6 sm:right-12 lg:right-16">
          <span class="text-[11px] font-semibold tracking-widest uppercase border border-white/30 backdrop-blur-md bg-black/40 text-white px-3.5 py-1.5 rounded-md">
            {{ currentTour.tag }}
          </span>
        </div>

        <!-- Title & Info -->
        <div class="absolute bottom-0 inset-x-0 px-6 sm:px-12 lg:px-16 pb-12">
          <div class="max-w-[1440px] mx-auto">
            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 tracking-tight">
              {{ currentTour.title }}
            </h1>
            <div class="flex flex-wrap items-center gap-6 text-slate-300 text-xs sm:text-sm">
              <span class="flex items-center gap-1.5"><MapPin :size="14" class="text-emerald-400" />{{ currentTour.location }}</span>
              <span class="flex items-center gap-1.5"><Clock :size="14" />{{ currentTour.duration }}</span>
              <span class="flex items-center gap-1.5"><Users :size="14" />{{ currentTour.groupSize }}</span>
              <span class="flex items-center gap-1.5">
                <Star :size="14" class="fill-amber-400 text-amber-400" />
                {{ currentTour.rating }} ({{ currentTour.reviews }} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Layout Body -->
      <div class="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 py-16">
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 items-start">

          <!-- Overview & Content -->
          <div class="flex flex-col gap-12">
            
            <!-- Short description -->
            <p class="text-slate-200 text-lg sm:text-xl leading-relaxed border-l-4 border-emerald-400 pl-6 italic">
              {{ currentTour.shortDescription }}
            </p>

            <!-- Full Description -->
            <div v-if="currentTour.fullDescription">
              <p class="text-[11px] tracking-[0.2em] uppercase text-emerald-400 font-semibold mb-4">About this tour</p>
              <div class="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                <p v-for="(para, idx) in currentTour.fullDescription.split('\n\n')" :key="idx">
                  {{ para }}
                </p>
              </div>
            </div>

            <!-- Highlights -->
            <div>
              <p class="text-[11px] tracking-[0.2em] uppercase text-emerald-400 font-semibold mb-5">Highlights</p>
              <ul class="space-y-3">
                <li v-for="h in currentTour.highlights" :key="h" class="flex items-start gap-3 text-sm text-slate-200">
                  <span class="text-emerald-400 shrink-0 font-bold">—</span>
                  <span>{{ h }}</span>
                </li>
              </ul>
            </div>

            <!-- Inclusions & Exclusions -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-white/10 pt-10">
              <div>
                <p class="text-[11px] tracking-[0.2em] uppercase text-emerald-400 font-semibold mb-4">Included</p>
                <ul class="space-y-3">
                  <li v-for="item in currentTour.included" :key="item" class="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <Check :size="15" class="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
              <div>
                <p class="text-[11px] tracking-[0.2em] uppercase text-rose-400 font-semibold mb-4">Not included</p>
                <ul class="space-y-3">
                  <li v-for="item in currentTour.notIncluded" :key="item" class="flex items-start gap-2.5 text-xs sm:text-sm text-slate-400">
                    <X :size="15" class="text-rose-400/70 shrink-0 mt-0.5" />
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Meeting Point -->
            <div class="border-t border-white/10 pt-8">
              <p class="text-[11px] tracking-[0.2em] uppercase text-emerald-400 font-semibold mb-3">Meeting point</p>
              <p class="flex items-start gap-2 text-sm text-slate-300">
                <MapPin :size="16" class="shrink-0 mt-0.5 text-emerald-400" />
                <span>{{ currentTour.meetingPoint }}</span>
              </p>
            </div>

            <!-- Languages -->
            <div>
              <p class="text-[11px] tracking-[0.2em] uppercase text-emerald-400 font-semibold mb-3">Languages</p>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="lang in currentTour.languages" 
                  :key="lang" 
                  class="text-xs text-slate-300 border border-white/15 bg-neutral-900/60 px-3 py-1 rounded-md"
                >
                  {{ lang }}
                </span>
              </div>
            </div>
          </div>

          <!-- Sticky Booking Card -->
          <div class="lg:sticky lg:top-[92px]">
            <div class="bg-neutral-900/80 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl backdrop-blur-xl">
              <div>
                <p class="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Price per person</p>
                <p class="text-white font-bold text-4xl sm:text-5xl font-mono leading-none">${{ currentTour.price }}</p>
              </div>

              <!-- Quick Specs -->
              <div class="flex flex-col gap-3.5 text-xs sm:text-sm text-slate-300 border-t border-white/10 pt-5">
                <div class="flex items-center justify-between">
                  <span class="flex items-center gap-2 text-slate-400"><Clock :size="14" />Duration</span>
                  <span class="font-medium text-white">{{ currentTour.duration }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="flex items-center gap-2 text-slate-400"><Users :size="14" />Group size</span>
                  <span class="font-medium text-white">{{ currentTour.groupSize }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="flex items-center gap-2 text-slate-400"><Star :size="14" />Rating</span>
                  <span class="font-medium text-white">{{ currentTour.rating }} ({{ currentTour.reviews }})</span>
                </div>
              </div>

              <button 
                type="button" 
                class="w-full bg-white hover:bg-neutral-100 text-neutral-900 text-sm sm:text-base font-bold py-4 rounded-full transition-all duration-200 shadow-xl hover:scale-[1.02] active:scale-95"
              >
                Book this tour
              </button>

              <p class="text-slate-400 text-[11px] text-center leading-relaxed">
                Free cancellation up to 48 hrs before departure. Instant confirmation & secure payment.
              </p>
            </div>
          </div>

        </div>

        <!-- Related Tours -->
        <div v-if="relatedTours.length > 0" class="mt-24 border-t border-white/10 pt-16">
          <p class="text-[11px] tracking-[0.2em] uppercase text-emerald-400 font-semibold mb-3">You might also like</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-white mb-8 tracking-tight">More tours in Iași</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NuxtLink 
              v-for="t in relatedTours" 
              :key="t.id" 
              :to="`/tours/${t.id}`" 
              class="group block bg-neutral-900/60 rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 shadow-lg"
            >
              <div class="h-40 overflow-hidden relative">
                <img 
                  :src="t.img" 
                  :alt="t.title" 
                  class="w-full h-full object-cover opacity-75 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500" 
                />
                <div class="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent" />
              </div>
              <div class="p-4">
                <p class="text-white font-bold text-sm mb-2 group-hover:text-emerald-400 transition-colors line-clamp-1">{{ t.title }}</p>
                <div class="flex items-center justify-between text-xs text-slate-400">
                  <span class="flex items-center gap-1"><Clock :size="12" />{{ t.duration }}</span>
                  <span class="text-white font-bold font-mono text-sm">from ${{ t.price }}</span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
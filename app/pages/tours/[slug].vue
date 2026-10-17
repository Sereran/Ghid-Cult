<script setup lang="ts">
import { ref, computed } from 'vue'
import { MapPin, Clock, Users, Star, ArrowLeft, Check, X, Minus, Plus, ShoppingBag, Loader2 } from '@lucide/vue'

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const { addToCart, items } = useCart()

// Fetch tour from API
const { data, pending } = await useFetch<{
  success: boolean
  tour: any
  relatedTours: any[]
}>(() => `/api/tours/${slug.value}`)

const currentTour = computed(() => data.value?.tour)
const relatedTours = computed(() => data.value?.relatedTours || [])

const persons = ref(1)
const added = ref(false)

const inCart = computed(() => {
  if (!currentTour.value) return false
  return items.value?.some((i: any) => i.tourId === currentTour.value.id || i.tourId === currentTour.value.slug)
})

const handleAdd = () => {
  if (!currentTour.value) return
  addToCart(currentTour.value.id, persons.value)
  added.value = true
  setTimeout(() => {
    added.value = false
  }, 2000)
}

useHead({
  title: computed(() => currentTour.value ? `${currentTour.value.title} | GhidCult` : 'Tour Details'),
})
</script>

<template>
  <div class="pt-[72px] min-h-screen">
    <!-- Loading -->
    <div v-if="pending" class="flex items-center justify-center min-h-[60vh]">
      <Loader2 :size="32" class="animate-spin text-emerald-400" />
    </div>

    <!-- 404 Status -->
    <div v-else-if="!currentTour" class="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-6 text-center">
      <p class="text-slate-400 text-lg font-mono">Tour not found or is currently not available.</p>
      <NuxtLink to="/tours" class="text-white hover:text-emerald-400 underline text-sm transition-colors">
        Back to all tours
      </NuxtLink>
    </div>

    <!-- Tour Details -->
    <div v-else>
      <div class="relative h-[480px] overflow-hidden bg-[#030f0e]">
        <img
          :src="currentTour.imageUrl"
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
          <span class="text-[11px] font-semibold tracking-widest uppercase border border-white/30 backdrop-blur-md bg-black/40 text-white px-3.5 py-1.5 rounded-md font-mono">
            {{ currentTour.mainTag || 'Tour' }}
          </span>
        </div>

        <div class="absolute bottom-0 inset-x-0 px-6 sm:px-12 lg:px-16 pb-12">
          <div class="max-w-[1440px] mx-auto">
            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 tracking-tight">
              {{ currentTour.title }}
            </h1>
            <div class="flex flex-wrap items-center gap-6 text-slate-300 text-xs sm:text-sm font-mono">
              <span class="flex items-center gap-1.5"><MapPin :size="14" class="text-emerald-400" />{{ currentTour.location }}</span>
              <span class="flex items-center gap-1.5"><Clock :size="14" />{{ currentTour.duration }}</span>
              <span class="flex items-center gap-1.5"><Users :size="14" />Up to {{ currentTour.maxPersons }} guests</span>
              <span class="flex items-center gap-1.5">
                <Star :size="14" class="fill-amber-400 text-amber-400" />
                {{ currentTour.rating }} ({{ currentTour.reviewsCount || 0 }} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 py-16">
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 items-start">
          <!-- Overview and Content -->
          <div class="flex flex-col gap-12">
            <p class="text-slate-200 text-lg sm:text-xl leading-relaxed border-l-4 border-emerald-400 pl-6 italic">
              {{ currentTour.shortDescription }}
            </p>

            <div v-if="currentTour.fullDescription">
              <p class="text-[11px] tracking-[0.2em] uppercase text-emerald-400 font-semibold mb-4">About this tour</p>
              <div
                class="prose prose-invert prose-emerald max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 prose-headings:text-white prose-headings:font-bold prose-blockquote:border-l-2 prose-blockquote:border-emerald-400/80 prose-blockquote:text-white prose-blockquote:italic"
                v-html="currentTour.fullDescription"
              />
            </div>

            <!-- Highlights -->
            <div v-if="currentTour.highlights?.length">
              <p class="text-[11px] tracking-[0.2em] uppercase text-emerald-400 font-semibold mb-5">Highlights</p>
              <ul class="space-y-3">
                <li v-for="h in currentTour.highlights" :key="h" class="flex items-start gap-3 text-sm text-slate-200">
                  <span class="text-emerald-400 shrink-0 font-bold">—</span>
                  <span>{{ h }}</span>
                </li>
              </ul>
            </div>

            <!-- Inclusions & Exclusions -->
            <div v-if="currentTour.inclusions?.length || currentTour.exclusions?.length" class="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-white/10 pt-10">
              <div v-if="currentTour.inclusions?.length">
                <p class="text-[11px] tracking-[0.2em] uppercase text-emerald-400 font-semibold mb-4">Included</p>
                <ul class="space-y-3">
                  <li v-for="item in currentTour.inclusions" :key="item" class="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <Check :size="15" class="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
              <div v-if="currentTour.exclusions?.length">
                <p class="text-[11px] tracking-[0.2em] uppercase text-rose-400 font-semibold mb-4">Not included</p>
                <ul class="space-y-3">
                  <li v-for="item in currentTour.exclusions" :key="item" class="flex items-start gap-2.5 text-xs sm:text-sm text-slate-400">
                    <X :size="15" class="text-rose-400/70 shrink-0 mt-0.5" />
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Meeting Point -->
            <div v-if="currentTour.meetingPlace" class="border-t border-white/10 pt-8">
              <p class="text-[11px] tracking-[0.2em] uppercase text-emerald-400 font-semibold mb-3">Meeting point</p>
              <p class="flex items-start gap-2 text-sm text-slate-300">
                <MapPin :size="16" class="shrink-0 mt-0.5 text-emerald-400" />
                <span>{{ currentTour.meetingPlace }} (Departure: {{ currentTour.departureTime }})</span>
              </p>
            </div>

            <!-- Languages -->
            <div v-if="currentTour.languages?.length">
              <p class="text-[11px] tracking-[0.2em] uppercase text-emerald-400 font-semibold mb-3">Languages</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="lang in currentTour.languages"
                  :key="lang"
                  class="text-xs text-slate-300 border border-white/15 bg-neutral-900/60 px-3 py-1 rounded-md font-mono"
                >
                  {{ lang }}
                </span>
              </div>
            </div>
          </div>

          <!-- Booking Box -->
          <div class="lg:sticky lg:top-[92px]">
            <div class="bg-neutral-900/80 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl backdrop-blur-xl">
              <div>
                <p class="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1 font-mono">Price per person</p>
                <p class="text-white font-bold text-4xl sm:text-5xl font-mono leading-none">{{ currentTour.price }} Lei</p>
              </div>

              <!-- Specs -->
              <div class="flex flex-col gap-3.5 text-xs sm:text-sm text-slate-300 border-t border-white/10 pt-5 font-mono">
                <div class="flex items-center justify-between">
                  <span class="flex items-center gap-2 text-slate-400"><Clock :size="14" />Duration</span>
                  <span class="font-medium text-white">{{ currentTour.duration }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="flex items-center gap-2 text-slate-400"><Users :size="14" />Group size</span>
                  <span class="font-medium text-white">Up to {{ currentTour.maxPersons }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="flex items-center gap-2 text-slate-400"><Star :size="14" />Rating</span>
                  <span class="font-medium text-white">{{ currentTour.rating }} ({{ currentTour.reviewsCount || 0 }})</span>
                </div>
              </div>

              <!-- Persons selector -->
              <div class="border-t border-white/10 pt-5">
                <p class="text-[11px] tracking-wider uppercase text-slate-400 font-semibold mb-3 font-mono">Persons</p>
                <div class="flex items-center border border-white/15 rounded-xl w-fit overflow-hidden bg-white/5">
                  <button
                    type="button"
                    @click="persons = Math.max(1, persons - 1)"
                    :disabled="persons <= 1"
                    class="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-20 transition-colors"
                  >
                    <Minus :size="14" />
                  </button>
                  <span class="w-10 h-10 flex items-center justify-center text-sm font-bold font-mono text-white border-x border-white/15">
                    {{ persons }}
                  </span>
                  <button
                    type="button"
                    @click="persons = Math.min(Number(currentTour.maxPersons || 12), persons + 1)"
                    class="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  >
                    <Plus :size="14" />
                  </button>
                </div>
                <p class="text-xs text-emerald-400 font-mono font-semibold mt-2.5">
                  Total: {{ Number(currentTour.price) * persons }} Lei
                </p>
              </div>

              <!-- Cart Button -->
              <button
                type="button"
                @click="handleAdd"
                :disabled="added"
                :class="[
                  'w-full flex items-center justify-center gap-2 text-sm sm:text-base font-bold py-4 rounded-full transition-all duration-200 shadow-xl',
                  added
                    ? 'bg-emerald-500 text-white cursor-default'
                    : inCart
                    ? 'bg-neutral-800 text-white border border-white/30 hover:bg-neutral-700'
                    : 'bg-white hover:bg-neutral-100 text-neutral-900 active:scale-95'
                ]"
              >
                <ShoppingBag :size="16" />
                <span>{{ added ? 'Added to cart!' : inCart ? 'Update cart' : 'Add to cart' }}</span>
              </button>

              <p class="text-slate-400 text-[11px] text-center leading-relaxed font-mono">
                Free cancellation up to 48 hrs before departure. Instant confirmation & secure booking.
              </p>
            </div>
          </div>
        </div>

        <!-- Related Tours Section -->
        <div v-if="relatedTours.length > 0" class="mt-24 border-t border-white/10 pt-16">
          <p class="text-[11px] tracking-[0.2em] uppercase text-emerald-400 font-semibold mb-3">You might also like</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-white mb-8 tracking-tight">More tours in Iași</h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NuxtLink
              v-for="t in relatedTours"
              :key="t.slug || t.id"
              :to="`/tours/${t.slug || t.id}`"
              class="group block bg-neutral-900/60 rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 shadow-lg"
            >
              <div class="h-40 overflow-hidden relative">
                <img
                  :src="t.imageUrl"
                  :alt="t.title"
                  class="w-full h-full object-cover opacity-75 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent" />
              </div>
              <div class="p-4">
                <p class="text-white font-bold text-sm mb-2 group-hover:text-emerald-400 transition-colors line-clamp-1">{{ t.title }}</p>
                <div class="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span class="flex items-center gap-1"><Clock :size="12" />{{ t.duration }}</span>
                  <span class="text-white font-bold text-sm">{{ t.price }} Lei</span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
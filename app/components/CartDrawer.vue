<script setup lang="ts">
import { computed } from 'vue'
import { ShoppingBag, X, Trash2, Minus, Plus } from '@lucide/vue'

const { items, isOpen, closeCart, updatePersons, removeFromCart } = useCart()

// Fetch published tours from database
const { data: toursData } = await useFetch<{ success: boolean; tours: any[] }>('/api/tours')
const allTours = computed(() => toursData.value?.tours || [])

// Map cart items with tour metadata
const cartDetails = computed(() => {
  return items.value
    .map((item) => {
      const tour = allTours.value.find((t: any) => t.id === item.tourId || t.slug === item.tourId)
      return {
        ...item,
        tour,
      }
    })
    .filter((entry) => entry.tour !== undefined)
})

// Calculate subtotal
const subtotal = computed(() => {
  return cartDetails.value.reduce((sum, entry) => {
    return sum + Number(entry.tour?.price || 0) * entry.persons
  }, 0)
})
</script>

<template>
  <div>
    <!-- Backdrop Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isOpen" 
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        @click="closeCart"
      />
    </Transition>

    <!-- Drawer -->
    <Transition
      enter-active-class="transform transition duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transform transition duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <aside 
        v-if="isOpen"
        class="fixed top-0 right-0 bottom-0 w-full sm:w-[460px] bg-[#020b0a] border-l border-white/10 z-50 flex flex-col justify-between shadow-2xl text-slate-100"
      >
        <!-- Header -->
        <div class="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <ShoppingBag :size="18" class="text-white" />
            <h2 class="font-mono font-bold text-sm tracking-wide text-white uppercase">Your selection</h2>
            <span class="text-[11px] font-mono border border-white/20 text-slate-400 px-2 py-0.5 rounded">
              {{ items.length }} {{ items.length === 1 ? 'tour' : 'tours' }}
            </span>
          </div>
          <button 
            type="button" 
            @click="closeCart"
            class="text-slate-400 hover:text-white transition-colors p-1"
            aria-label="Close cart"
          >
            <X :size="18" />
          </button>
        </div>

        <!-- Items List -->
        <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-6 divide-y divide-white/5">
          <!-- Empty State -->
          <div v-if="cartDetails.length === 0" class="flex-1 flex flex-col items-center justify-center text-center py-20 gap-3">
            <ShoppingBag :size="36" class="text-slate-600" />
            <p class="font-mono text-xs uppercase tracking-wider text-slate-400">Your cart is empty</p>
          </div>

          <!-- Item Card -->
          <div 
            v-for="item in cartDetails" 
            :key="item.tourId"
            class="pt-5 first:pt-0 flex gap-4 items-start"
          >
            <!-- Tour Thumbnail -->
            <img 
              :src="item.tour?.imageUrl" 
              :alt="item.tour?.title" 
              class="w-16 h-16 rounded object-cover shrink-0 border border-white/10 bg-white/5"
              @error="(e: any) => e.target.style.display = 'none'"
            />

            <div class="flex-1 min-w-0">
              <!-- Title and Remove -->
              <div class="flex items-start justify-between gap-2">
                <p class="font-mono font-bold text-xs sm:text-sm text-white leading-tight truncate">
                  {{ item.tour?.title }}
                </p>
                <button 
                  type="button" 
                  @click="removeFromCart(item.tourId)"
                  class="text-slate-500 hover:text-rose-400 transition-colors p-0.5"
                  title="Remove tour"
                >
                  <Trash2 :size="14" />
                </button>
              </div>

              <!-- Location / Duration -->
              <p class="font-mono text-[11px] text-slate-400 mt-1">
                {{ item.tour?.duration }} · {{ item.tour?.location || 'Iași, Romania' }}
              </p>

              <!-- Counter and Price Calculation -->
              <div class="flex items-center justify-between mt-3">
                <div class="flex items-center border border-white/15 bg-white/5 rounded">
                  <button 
                    type="button" 
                    @click="updatePersons(item.tourId, item.persons - 1)" 
                    :disabled="item.persons <= 1"
                    class="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-25 transition-colors"
                  >
                    <Minus :size="11" />
                  </button>
                  <span class="w-7 h-7 flex items-center justify-center font-mono font-bold text-xs text-white border-x border-white/15">
                    {{ item.persons }}
                  </span>
                  <button 
                    type="button" 
                    @click="updatePersons(item.tourId, item.persons + 1)" 
                    class="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  >
                    <Plus :size="11" />
                  </button>
                </div>

                <!-- Price Breakdown -->
                <div class="text-right">
                  <p class="font-mono text-[10px] text-slate-400">
                    {{ item.tour?.price }} Lei × {{ item.persons }}
                  </p>
                  <p class="font-mono font-bold text-sm text-white">
                    {{ Number(item.tour?.price || 0) * item.persons }} Lei
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Checkout -->
        <div class="p-6 border-t border-white/10 bg-[#020b0a]/90 space-y-4">
          <div class="flex justify-between items-baseline font-mono">
            <span class="text-xs uppercase tracking-wider text-slate-400 font-semibold">Subtotal</span>
            <span class="text-2xl font-bold text-white">{{ subtotal }} Lei</span>
          </div>

          <p class="font-mono text-[10px] text-slate-400 leading-tight">
            Taxes and fees calculated at checkout · Free cancellation 48h before
          </p>

          <NuxtLink
            to="/checkout"
            :disabled="cartDetails.length === 0"
            @click="closeCart"
            class="block text-center w-full bg-white hover:bg-neutral-100 disabled:opacity-30 text-neutral-900 font-mono font-bold text-xs uppercase tracking-wider py-3.5 rounded-full transition-all duration-200 shadow-md active:scale-98"
          >
            Proceed to checkout
          </NuxtLink>

          <button 
            type="button" 
            @click="closeCart"
            class="w-full text-center font-mono text-xs text-slate-400 hover:text-white transition-colors pt-1"
          >
            Continue browsing
          </button>
        </div>
      </aside>
    </Transition>
  </div>
</template>
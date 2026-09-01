<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { MapPin, Menu, X, ShoppingBag } from 'lucide-vue-next'

const isScrolled = ref(false)
const navOpen = ref(false)

// Global cart count
const { totalItems, openCart } = useCart()

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const navLinks = [
  { name: 'Guided Tours', path: '/tours' },
  { name: 'About', path: '/about' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' }
]
</script>

<template>
  <header 
    :class="[
      'fixed top-0 inset-x-0 z-50 transition-all duration-300',
      isScrolled 
        ? 'bg-[#030f0e]/85 backdrop-blur-md border-b border-white/10 shadow-2xl py-0' 
        : 'bg-gradient-to-b from-black/70 via-black/30 to-transparent border-transparent py-2'
    ]"
  >
    <div class="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 h-[72px] flex items-center justify-between">
      
      <!-- Brand Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <MapPin :size="20" class="text-emerald-400 group-hover:scale-110 transition-transform" />
        <span class="text-white text-lg font-bold tracking-tight">GhidCult</span>
      </NuxtLink>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
        <NuxtLink 
          v-for="item in navLinks" 
          :key="item.name" 
          :to="item.path" 
          class="hover:text-white transition-colors"
          active-class="text-emerald-400 font-bold"
        >
          {{ item.name }}
        </NuxtLink>
      </nav>

      <!-- Right-side Actions -->
      <div class="flex items-center gap-3 sm:gap-4">
        <!-- Cart Button -->
        <button
          type="button"
          @click="openCart"
          class="relative p-2 text-slate-300 hover:text-white transition-colors flex items-center justify-center rounded-full hover:bg-white/5"
          aria-label="Open cart"
        >
          <ShoppingBag :size="20" />
          <span 
            v-if="totalItems > 0"
            class="absolute -top-0.5 -right-0.5 bg-emerald-500 text-neutral-950 font-mono font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-lg animate-pulse"
          >
            {{ totalItems }}
          </span>
        </button>

        <!-- Desktop-only Actions -->
        <NuxtLink to="/auth" class="hidden md:inline-block text-sm font-medium text-slate-300 hover:text-white transition-colors">
          Sign in
        </NuxtLink>

        <NuxtLink 
          to="/tours" 
          class="hidden md:inline-block bg-white hover:bg-neutral-100 text-neutral-900 text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 shadow-md hover:scale-105 active:scale-95"
        >
          Book a tour
        </NuxtLink>

        <span class="hidden md:inline-block text-xs font-mono text-slate-400 ml-1">
          <span class="underline font-bold text-white">en</span>/ro
        </span>

        <!-- Mobile Menu Button -->
        <button 
          type="button" 
          class="md:hidden text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors" 
          @click="navOpen = !navOpen"
          aria-label="Toggle mobile menu"
        >
          <X v-if="navOpen" :size="22" />
          <Menu v-else :size="22" />
        </button>
      </div>
    </div>

    <!-- Mobile Dropdown Menu -->
    <div 
      v-if="navOpen" 
      class="md:hidden bg-[#030f0e]/95 backdrop-blur-2xl border-b border-white/10 px-8 py-6 flex flex-col gap-4 text-sm"
    >
      <NuxtLink 
        v-for="item in navLinks" 
        :key="item.name" 
        :to="item.path" 
        class="text-slate-300 hover:text-white py-1 transition-colors"
        @click="navOpen = false"
      >
        {{ item.name }}
      </NuxtLink>

      <div class="pt-4 mt-2 border-t border-white/10 flex flex-col gap-3">
        <NuxtLink 
          to="/auth" 
          class="text-slate-300 hover:text-white py-1 text-center font-medium transition-colors"
          @click="navOpen = false"
        >
          Sign in
        </NuxtLink>

        <NuxtLink 
          to="/tours" 
          class="w-full text-center bg-white hover:bg-neutral-100 text-neutral-900 font-semibold px-6 py-3 rounded-full transition-all"
          @click="navOpen = false"
        >
          Book a tour
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
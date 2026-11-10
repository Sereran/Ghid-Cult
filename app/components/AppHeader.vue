<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { MapPin, Menu, X } from '@lucide/vue'

const isScrolled = ref(false)
const navOpen = ref(false)

const { locale, t } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Labels for navigation links
const navLinks = computed(() => [
  { name: t('nav.articles'), path: localePath('/blog') },
  { name: t('nav.about'), path: localePath('/about') },
  { name: t('nav.contact'), path: localePath('/contact') }
])
</script>

<template>
  <header 
    :class="[
      'fixed top-0 inset-x-0 z-50 transition-all duration-300',
      isScrolled 
        ? 'bg-[#030f0e]/90 backdrop-blur-md border-b border-white/10 shadow-2xl py-0' 
        : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent border-transparent py-2'
    ]"
  >
    <div class="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 h-[72px] flex items-center justify-between">
      
      <!-- Brand Logo -->
      <NuxtLink :to="localePath('/')" class="flex items-center gap-2 group">
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

      <!-- Right Side Actions -->
      <div class="flex items-center gap-4">
        <div class="text-xs font-mono text-slate-400 flex items-center gap-1">
          <NuxtLink 
            :to="switchLocalePath('ro')" 
            :class="[
              'transition-colors hover:text-white',
              locale === 'ro' ? 'underline font-bold text-white' : 'opacity-70'
            ]"
          >
            ro
          </NuxtLink>
          <span>/</span>
          <NuxtLink 
            :to="switchLocalePath('en')" 
            :class="[
              'transition-colors hover:text-white',
              locale === 'en' ? 'underline font-bold text-white' : 'opacity-70'
            ]"
          >
            en
          </NuxtLink>
        </div>

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
    </div>
  </header>
</template>
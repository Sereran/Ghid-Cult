<script setup lang="ts">
import { MapPin } from '@lucide/vue'

const footerSections = [
  { section: 'Explore', links: [{ label: 'Blog', path: '/blog' }] },
  { section: 'Info', links: [{ label: 'About', path: '/about' }] },
  { section: 'Support', links: [{ label: 'Contact', path: '/contact' }] },
]
</script>

<template>
  <footer class="border-t border-white/10 px-6 sm:px-12 lg:px-16 py-12 max-w-[1440px] w-full mx-auto flex flex-col md:flex-row justify-between gap-10">
    <div>
      <NuxtLink to="/" class="flex items-center gap-2 mb-3">
        <MapPin :size="16" class="text-emerald-400" />
        <span class="font-bold text-white text-base">GhidCult</span>
      </NuxtLink>
    </div>

    <div class="flex flex-wrap gap-12 sm:gap-20 text-xs">
      <div v-for="item in footerSections" :key="item.section">
        <p class="tracking-widest uppercase text-white/30 mb-3 font-semibold">{{ item.section }}</p>
        <NuxtLink 
          v-for="link in item.links" 
          :key="link.label" 
          :to="link.path" 
          class="block text-white/50 hover:text-white transition-colors mb-2"
        >
          {{ link.label }}
        </NuxtLink>
      </div>
    </div>

    <div class="self-start md:self-end text-xs text-white/30">
      © 2026 GhidCult. All rights reserved.
    </div>
  </footer>
</template>
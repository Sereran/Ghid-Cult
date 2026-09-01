<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  LayoutGrid,
  Map,
  CalendarDays,
  FileText,
  Users,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ArrowUpRight,
  Settings,
  LogOut
} from 'lucide-vue-next'

const route = useRoute()
const collapsed = ref(false)

const nav = [
  { label: 'Dashboard', to: '/admin', icon: LayoutGrid },
  { label: 'Tours', to: '/admin/tours', icon: Map },
  { label: 'Bookings', to: '/admin/bookings', icon: CalendarDays },
  { label: 'Blog', to: '/admin/blog', icon: FileText },
  { label: 'Users', to: '/admin/users', icon: Users },
]

const currentSectionLabel = computed(() => {
  const matched = nav.find((n) => route.path === n.to || (n.to !== '/admin' && route.path.startsWith(n.to)))
  return matched?.label ?? 'Dashboard'
})
</script>

<template>
  <div class="min-h-screen flex bg-[#020d0c] font-mono text-slate-100 selection:bg-emerald-500 selection:text-white">
    
    <!-- Sidebar -->
    <aside
      :class="[
        'h-screen sticky top-0 flex flex-col shrink-0 border-r border-white/10 transition-all duration-300 bg-[#020b0a] z-30',
        collapsed ? 'w-[64px]' : 'w-[230px]'
      ]"
    >
      <!-- Brand Logo -->
      <div class="flex items-center h-[60px] border-b border-white/10 px-4 gap-2.5 overflow-hidden shrink-0">
        <MapPin :size="18" class="text-emerald-400 shrink-0" />
        <span v-if="!collapsed" class="text-white text-sm font-bold tracking-tight whitespace-nowrap">
          GhidCult
        </span>
      </div>

      <!-- Navigation Links -->
      <nav class="flex flex-col gap-1 p-2 flex-1 overflow-y-auto custom-scrollbar">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          :title="collapsed ? item.label : undefined"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group shrink-0',
            route.path === item.to || (item.to !== '/admin' && route.path.startsWith(item.to))
              ? 'bg-white/10 text-white font-semibold'
              : 'text-white/40 hover:text-white hover:bg-white/5'
          ]"
        >
          <component :is="item.icon" :size="16" class="shrink-0" />
          <span v-if="!collapsed" class="text-xs tracking-wider uppercase whitespace-nowrap">
            {{ item.label }}
          </span>
          <div 
            v-if="!collapsed && (route.path === item.to || (item.to !== '/admin' && route.path.startsWith(item.to)))" 
            class="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" 
          />
        </NuxtLink>
      </nav>

      <!-- Bottom Actions -->
      <div class="p-2 border-t border-white/10 flex flex-col gap-1 shrink-0 mt-auto bg-[#020b0a]">
        <!-- Public Site -->
        <NuxtLink
          to="/"
          :title="collapsed ? 'View site' : undefined"
          class="flex items-center gap-3 px-3 py-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-xs"
        >
          <ArrowUpRight :size="15" class="shrink-0" />
          <span v-if="!collapsed" class="whitespace-nowrap">View site</span>
        </NuxtLink>

        <!-- Settings -->
        <button
          type="button"
          :title="collapsed ? 'Settings' : undefined"
          class="flex items-center gap-3 px-3 py-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors w-full text-left text-xs"
        >
          <Settings :size="15" class="shrink-0" />
          <span v-if="!collapsed" class="whitespace-nowrap">Settings</span>
        </button>

        <!-- Sign Out -->
        <button
          type="button"
          :title="collapsed ? 'Sign out' : undefined"
          class="flex items-center gap-3 px-3 py-2 text-white/40 hover:text-rose-400 hover:bg-rose-500/5 rounded-lg transition-colors w-full text-left text-xs"
        >
          <LogOut :size="15" class="shrink-0" />
          <span v-if="!collapsed" class="whitespace-nowrap">Sign out</span>
        </button>

        <!-- Collapse Toggle -->
        <button
          type="button"
          @click="collapsed = !collapsed"
          class="flex items-center gap-3 px-3 py-2 text-white/25 hover:text-white hover:bg-white/5 rounded-lg transition-colors w-full text-left mt-1 border-t border-white/5 text-xs"
        >
          <ChevronRight v-if="collapsed" :size="15" class="shrink-0" />
          <ChevronLeft v-else :size="15" class="shrink-0" />
          <span v-if="!collapsed" class="whitespace-nowrap">Collapse</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Header -->
      <header class="h-[60px] border-b border-white/10 flex items-center justify-between px-8 shrink-0 bg-[#020b0a]/80 backdrop-blur-md sticky top-0 z-20">
        <p class="text-xs text-white/30">
          Admin Panel
          <span class="text-white/15 mx-2">/</span>
          <span class="text-emerald-400 font-semibold uppercase tracking-wider">
            {{ currentSectionLabel }}
          </span>
        </p>

        <!-- Profile Badge -->
        <div class="flex items-center gap-3">
          <div class="w-7 h-7 rounded-full border border-emerald-400/40 bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-[11px] font-bold">
            AI
          </div>
          <span class="text-xs text-white/50">Adrian I.</span>
        </div>
      </header>

      <!-- Content Area -->
      <main class="flex-1 p-8">
        <slot />
      </main>
    </div>

  </div>
</template>
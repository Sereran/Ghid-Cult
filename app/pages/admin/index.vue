<script setup lang="ts">
import { 
  TrendingUp, 
  Users, 
  Map, 
  FileText, 
  ArrowRight, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-vue-next'
import { tours } from '~/data/tours'
import { posts } from '~/data/blog'
import { allBookings, topTours } from '~/data/admin'

// Apply the admin layout
definePageMeta({
  layout: 'admin'
})

const stats = [
  {
    label: 'Revenue this month',
    value: '$12,480',
    delta: '+18%',
    up: true,
    icon: TrendingUp,
    sub: 'vs. last month',
  },
  {
    label: 'Bookings',
    value: '94',
    delta: '+12%',
    up: true,
    icon: Users,
    sub: 'this month',
  },
  {
    label: 'Active tours',
    value: String(tours.length),
    delta: '0%',
    up: true,
    icon: Map,
    sub: 'currently listed',
  },
  {
    label: 'Blog posts',
    value: String(posts.length),
    delta: '+2',
    up: true,
    icon: FileText,
    sub: 'published',
  },
]

const maxBookings = topTours[0]?.bookings ?? 1

const statusStyle: Record<string, string> = {
  confirmed: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  pending: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  cancelled: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
}

useHead({
  title: 'Admin Dashboard | GhidCult'
})
</script>

<template>
  <div class="flex flex-col gap-8 max-w-[1200px]">

    <!-- Header -->
    <div>
      <p class="text-[11px] tracking-[0.2em] uppercase text-white/30 mb-1">Welcome back</p>
      <h1 class="text-3xl font-extrabold text-white tracking-tight">Dashboard</h1>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div 
        v-for="s in stats" 
        :key="s.label" 
        class="border border-white/10 rounded-xl p-5 flex flex-col gap-4 bg-white/[0.02]"
      >
        <div class="flex items-center justify-between">
          <p class="text-[11px] tracking-widest uppercase text-white/40 font-semibold">{{ s.label }}</p>
          <component :is="s.icon" :size="16" class="text-white/30" />
        </div>
        <div>
          <p class="text-3xl sm:text-4xl font-bold text-white leading-none mb-2 font-mono">{{ s.value }}</p>
          <div class="flex items-center gap-1.5 text-xs">
            <ArrowUpRight v-if="s.up" :size="13" class="text-emerald-400" />
            <ArrowDownRight v-else :size="13" class="text-rose-400" />
            <span :class="s.up ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'">{{ s.delta }}</span>
            <span class="text-white/30">{{ s.sub }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 items-start">

      <!-- Recent Bookings -->
      <div class="border border-white/10 rounded-xl bg-white/[0.01] overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <p class="text-sm font-bold text-white tracking-wide">Recent bookings</p>
          <NuxtLink to="/admin/bookings" class="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors">
            View all <ArrowRight :size="12" />
          </NuxtLink>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-white/5 bg-white/[0.02]">
                <th 
                  v-for="h in ['ID', 'Tour', 'Customer', 'Date', 'Persons', 'Total', 'Status']" 
                  :key="h" 
                  class="px-6 py-3 text-[10px] tracking-widest uppercase text-white/30 font-semibold whitespace-nowrap"
                >
                  {{ h }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr
                v-for="b in allBookings"
                :key="b.id"
                class="hover:bg-white/[0.02] transition-colors text-xs"
              >
                <td class="px-6 py-3.5 text-white/40 font-mono">{{ b.id }}</td>
                <td class="px-6 py-3.5 text-white/80 font-medium whitespace-nowrap max-w-[180px] truncate">{{ b.tour }}</td>
                <td class="px-6 py-3.5 text-white/60 whitespace-nowrap">{{ b.customer }}</td>
                <td class="px-6 py-3.5 text-white/40 whitespace-nowrap">{{ b.date }}</td>
                <td class="px-6 py-3.5 text-white/60 text-center">{{ b.persons }}</td>
                <td class="px-6 py-3.5 text-white font-bold font-mono">${{ b.total }}</td>
                <td class="px-6 py-3.5">
                  <span :class="['text-[10px] tracking-wider uppercase border px-2 py-0.5 rounded', statusStyle[b.status]]">
                    {{ b.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Top Performing Tours -->
      <div class="border border-white/10 rounded-xl bg-white/[0.01] overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <p class="text-sm font-bold text-white tracking-wide">Top tours</p>
          <NuxtLink to="/admin/tours" class="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors">
            Manage <ArrowRight :size="12" />
          </NuxtLink>
        </div>

        <div class="flex flex-col divide-y divide-white/5">
          <div v-for="t in topTours" :key="t.title" class="px-6 py-4 flex flex-col gap-2">
            <div class="flex items-start justify-between gap-3 text-xs">
              <p class="text-white/80 font-medium leading-snug">{{ t.title }}</p>
              <p class="font-bold text-white font-mono shrink-0">${{ t.revenue }}</p>
            </div>
            
            <div class="flex items-center gap-3">
              <div class="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  class="h-full bg-emerald-400 rounded-full transition-all duration-500"
                  :style="{ width: `${(t.bookings / maxBookings) * 100}%` }"
                />
              </div>
              <span class="text-[11px] text-white/30 shrink-0 font-mono">{{ t.bookings }} bookings</span>
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>
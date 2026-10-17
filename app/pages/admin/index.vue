<script setup lang="ts">
import { computed } from 'vue'
import { 
  TrendingUp, 
  Users, 
  Map, 
  FileText, 
  ArrowRight, 
  ArrowUpRight 
} from '@lucide/vue'
import type { BookingRecord, BookingStatus } from '~/data/admin'

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Admin Dashboard | GhidCult',
})

// Fetch data from API
const [{ data: bookingsData }, { data: toursData }, { data: articlesData }] = await Promise.all([
  useFetch<{ success: boolean; bookings: BookingRecord[] }>('/api/admin/bookings'),
  useFetch<{ success: boolean; total: number; tours: any[] }>('/api/admin/tours'),
  useFetch<{ success: boolean; total: number; articles: any[] }>('/api/admin/blog'),
])

const recentBookings = computed(() => (bookingsData.value?.bookings || []).slice(0, 10))
const totalTours = computed(() => toursData.value?.tours?.length ?? 0)
const totalArticles = computed(() => articlesData.value?.articles?.length ?? 0)

// Calculate total revenue from confirmed or paid bookings
const totalRevenue = computed(() => {
  const bookings = bookingsData.value?.bookings || []
  return bookings
    .filter((b) => b.bookingStatus === 'CONFIRMED' || b.paymentStatus === 'PAID')
    .reduce((sum, b) => sum + Number(b.totalPrice || 0), 0)
})

const stats = computed(() => [
  {
    label: 'Total Revenue',
    value: `${totalRevenue.value.toLocaleString()} Lei`,
    delta: 'Live',
    up: true,
    icon: TrendingUp,
    sub: 'confirmed bookings',
  },
  {
    label: 'Total Bookings',
    value: String(bookingsData.value?.bookings?.length ?? 0),
    delta: 'Live',
    up: true,
    icon: Users,
    sub: 'all time reservations',
  },
  {
    label: 'Active tours',
    value: String(totalTours.value),
    delta: 'Live',
    up: true,
    icon: Map,
    sub: 'currently listed',
  },
  {
    label: 'Blog posts',
    value: String(totalArticles.value),
    delta: 'Live',
    up: true,
    icon: FileText,
    sub: 'published',
  },
])

const statusStyle: Record<BookingStatus, string> = {
  CONFIRMED: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  PENDING: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  CANCELLED: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
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
          <p class="text-2xl sm:text-3xl font-bold text-white leading-none mb-2 font-mono">{{ s.value }}</p>
          <div class="flex items-center gap-1.5 text-xs">
            <ArrowUpRight :size="13" class="text-emerald-400" />
            <span class="text-emerald-400 font-bold">{{ s.delta }}</span>
            <span class="text-white/30">{{ s.sub }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Bookings Table -->
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
                v-for="h in ['Customer', 'Tour', 'Tour Date', 'Persons', 'Total', 'Status']" 
                :key="h" 
                class="px-6 py-3 text-[10px] tracking-widest uppercase text-white/30 font-semibold whitespace-nowrap"
              >
                {{ h }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr
              v-for="b in recentBookings"
              :key="b.id"
              class="hover:bg-white/[0.02] transition-colors text-xs"
            >
              <td class="px-6 py-3.5 text-white/80 font-medium">
                <div>{{ b.customerName }}</div>
                <div class="text-[10px] text-white/30">{{ b.customerEmail }}</div>
              </td>
              <td class="px-6 py-3.5 text-white/70 max-w-[200px] truncate">
                {{ b.tour?.title || 'Custom Tour' }}
              </td>
              <td class="px-6 py-3.5 text-white/40 whitespace-nowrap">
                {{ formatDate(b.tourDate) }}
              </td>
              <td class="px-6 py-3.5 text-white/60 text-center font-mono">
                {{ b.persons }}
              </td>
              <td class="px-6 py-3.5 text-white font-bold font-mono">
                {{ b.totalPrice }} Lei
              </td>
              <td class="px-6 py-3.5">
                <span :class="['text-[10px] tracking-wider uppercase border px-2 py-0.5 rounded font-mono', statusStyle[b.bookingStatus] || statusStyle.PENDING]">
                  {{ b.bookingStatus }}
                </span>
              </td>
            </tr>

            <tr v-if="recentBookings.length === 0">
              <td colspan="6" class="px-6 py-10 text-center text-white/30 text-xs">
                No bookings recorded yet.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>
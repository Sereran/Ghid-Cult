<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, MoreHorizontal } from 'lucide-vue-next'
import { allBookings } from '~/data/admin'

definePageMeta({
  layout: 'admin'
})

const query = ref('')
const filter = ref('All')

const filters = ['All', 'Confirmed', 'Pending', 'Cancelled']

const statusStyle: Record<string, string> = {
  confirmed: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  pending: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  cancelled: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
}

const counts = computed<Record<string, number>>(() => ({
  All: allBookings.length,
  Confirmed: allBookings.filter((b) => b.status === 'confirmed').length,
  Pending: allBookings.filter((b) => b.status === 'pending').length,
  Cancelled: allBookings.filter((b) => b.status === 'cancelled').length,
}))

const filtered = computed(() => {
  const q = query.value.toLowerCase().trim()
  return allBookings.filter((b) => {
    const matchesFilter = filter.value === 'All' || b.status === filter.value.toLowerCase()
    const matchesQuery =
      q === '' ||
      b.customer.toLowerCase().includes(q) ||
      b.tour.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q)
    return matchesFilter && matchesQuery
  })
})

useHead({
  title: 'Manage Bookings | Admin'
})
</script>

<template>
  <div class="flex flex-col gap-6 max-w-[1200px]">

    <!-- Header -->
    <div>
      <p class="text-[11px] tracking-[0.2em] uppercase text-white/30 mb-1">Manage</p>
      <h1 class="text-3xl font-extrabold text-white tracking-tight">Bookings</h1>
    </div>

    <!-- Filters and Search Bar -->
    <div class="flex items-center gap-3 flex-wrap justify-between">
      <!-- Status Filter -->
      <div class="flex items-center gap-2 flex-wrap">
        <button
          v-for="f in filters"
          :key="f"
          type="button"
          @click="filter = f"
          :class="[
            'flex items-center gap-2 text-[11px] tracking-wider uppercase px-4 py-2 border rounded-lg transition-colors',
            filter === f
              ? 'border-white bg-white text-neutral-950 font-bold'
              : 'border-white/10 text-white/40 hover:text-white hover:border-white/25 bg-white/[0.02]'
          ]"
        >
          <span>{{ f }}</span>
          <span :class="['text-[10px]', filter === f ? 'text-neutral-700' : 'text-white/30']">
            {{ counts[f] }}
          </span>
        </button>
      </div>

      <!-- Search Input -->
      <div class="flex items-center gap-2 border border-white/10 rounded-xl px-3.5 py-2.5 bg-white/[0.02] focus-within:border-emerald-400/50 transition-colors w-full sm:w-[240px]">
        <Search :size="13" class="text-white/30 shrink-0" />
        <input
          v-model="query"
          type="text"
          placeholder="Search bookings…"
          class="bg-transparent text-xs text-white placeholder:text-white/20 outline-none w-full"
        />
      </div>
    </div>

    <!-- Bookings -->
    <div class="border border-white/10 rounded-xl bg-white/[0.01] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-white/5 bg-white/[0.02]">
              <th 
                v-for="h in ['Booking ID', 'Tour', 'Customer', 'Booked', 'Tour date', 'Persons', 'Total', 'Status', '']" 
                :key="h" 
                class="px-5 py-3 text-[10px] tracking-widest uppercase text-white/30 font-semibold whitespace-nowrap"
              >
                {{ h }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr
              v-for="b in filtered"
              :key="b.id"
              class="hover:bg-white/[0.02] transition-colors group text-xs"
            >
              <td class="px-5 py-3.5 text-white/40 whitespace-nowrap font-mono">{{ b.id }}</td>
              <td class="px-5 py-3.5 text-white/80 max-w-[160px] truncate whitespace-nowrap font-medium">{{ b.tour }}</td>
              <td class="px-5 py-3.5">
                <p class="text-white/80 whitespace-nowrap">{{ b.customer }}</p>
                <p class="text-[11px] text-white/30">{{ b.email }}</p>
              </td>
              <td class="px-5 py-3.5 text-white/40 whitespace-nowrap">{{ b.date }}</td>
              <td class="px-5 py-3.5 text-white/60 whitespace-nowrap">{{ b.tourDate }}</td>
              <td class="px-5 py-3.5 text-white/60 text-center">{{ b.persons }}</td>
              <td class="px-5 py-3.5 text-white font-bold font-mono">${{ b.total }}</td>
              <td class="px-5 py-3.5">
                <span :class="['text-[10px] tracking-wider uppercase border px-2 py-0.5 rounded whitespace-nowrap', statusStyle[b.status]]">
                  {{ b.status }}
                </span>
              </td>
              <td class="px-5 py-3.5 text-right">
                <button 
                  type="button" 
                  class="text-white/30 hover:text-white p-1 rounded hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Actions"
                >
                  <MoreHorizontal :size="15" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="filtered.length === 0" class="text-white/30 text-xs text-center py-12">
        No bookings found.
      </p>
    </div>

    <p class="text-[11px] text-white/30 font-mono">{{ filtered.length }} of {{ allBookings.length }} bookings</p>
  </div>
</template>
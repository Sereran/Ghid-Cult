<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, MoreHorizontal } from 'lucide-vue-next'
import { users } from '~/data/admin'

definePageMeta({
  layout: 'admin'
})

const query = ref('')

const roleStyle: Record<string, string> = {
  admin: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  customer: 'text-white/40 border-white/10',
}

const filtered = computed(() => {
  const q = query.value.toLowerCase().trim()
  if (!q) return users
  return users.filter(
    (u) =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
  )
})

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
}

useHead({
  title: 'Manage Users | Admin'
})
</script>

<template>
  <div class="flex flex-col gap-6 max-w-[1000px]">

    <!-- Header -->
    <div>
      <p class="text-[11px] tracking-[0.2em] uppercase text-white/30 mb-1">Manage</p>
      <h1 class="text-3xl font-extrabold text-white tracking-tight">Users</h1>
    </div>

    <!-- Search Input -->
    <div class="flex items-center gap-2 border border-white/10 rounded-xl px-4 py-3 w-full max-w-[360px] bg-white/[0.02] focus-within:border-emerald-400/50 transition-colors">
      <Search :size="14" class="text-white/30 shrink-0" />
      <input
        v-model="query"
        type="text"
        placeholder="Search users…"
        class="bg-transparent flex-1 text-xs text-white placeholder:text-white/20 outline-none"
      />
    </div>

    <!-- Users -->
    <div class="border border-white/10 rounded-xl bg-white/[0.01] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-white/5 bg-white/[0.02]">
              <th 
                v-for="h in ['User', 'Joined', 'Bookings', 'Role', '']" 
                :key="h" 
                class="px-5 py-3 text-[10px] tracking-widest uppercase text-white/30 font-semibold whitespace-nowrap"
              >
                {{ h }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr
              v-for="u in filtered"
              :key="u.id"
              class="hover:bg-white/[0.02] transition-colors group text-xs"
            >
              <!-- User with Initials Avatar -->
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white/50 text-[11px] font-bold shrink-0 font-mono">
                    {{ getInitials(u.name) }}
                  </div>
                  <div>
                    <p class="font-bold text-white/80">{{ u.name }}</p>
                    <p class="text-[11px] text-white/30">{{ u.email }}</p>
                  </div>
                </div>
              </td>

              <!-- Joined Date -->
              <td class="px-5 py-3.5 text-white/40 whitespace-nowrap">{{ u.joined }}</td>

              <!-- Booking Count -->
              <td class="px-5 py-3.5 text-white/60 text-center font-mono">{{ u.bookings }}</td>

              <!-- Role Tag -->
              <td class="px-5 py-3.5">
                <span :class="['text-[10px] tracking-widest uppercase border px-2 py-0.5 rounded', roleStyle[u.role]]">
                  {{ u.role }}
                </span>
              </td>

              <!-- Actions Menu -->
              <td class="px-5 py-3.5 text-right">
                <button 
                  type="button" 
                  class="text-white/30 hover:text-white p-1 rounded hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="User actions"
                >
                  <MoreHorizontal :size="15" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="filtered.length === 0" class="text-white/30 text-xs text-center py-12">
        No users found.
      </p>
    </div>

    <p class="text-[11px] text-white/30 font-mono">{{ filtered.length }} of {{ users.length }} users</p>
  </div>
</template>
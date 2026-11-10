<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Users, 
  FileText, 
  ArrowRight, 
  ArrowUpRight,
  ShieldCheck,
  Eye,
  Clock,
  Loader2,
  Lock,
  Mail
} from '@lucide/vue'
import type { UserAccountRecord } from '~/data/admin'
import type { ArticleRecord } from '~/data/blog'

definePageMeta({
  layout: false, // We control the layout conditionally via <NuxtLayout>
})

const { user, isAuthenticated, isAdmin, fetchUser } = useAuth()

// Check session on page load
if (!user.value) {
  await fetchUser()
}

useHead({
  title: computed(() => isAdmin.value ? 'Admin Dashboard | GhidCult' : 'Admin Login | GhidCult'),
})

// --- LOGIN STATE ---
const email = ref('')
const password = ref('')
const loginLoading = ref(false)
const loginError = ref('')

const handleLogin = async () => {
  loginLoading.value = true
  loginError.value = ''

  try {
    const res = await $fetch<{ success: boolean; user: any }>('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value.trim(),
        password: password.value,
      },
    })

    if (res.user.role !== 'ADMIN') {
      loginError.value = 'Access denied. Administrator privileges required.'
      return
    }

    user.value = res.user
    await refreshData()
  } catch (err: any) {
    loginError.value = err.data?.statusMessage || 'Invalid email or password.'
  } finally {
    loginLoading.value = false
  }
}

// --- DASHBOARD DATA (Only fetched when admin is logged in) ---
const [{ data: usersData, refresh: refreshUsers }, { data: articlesData, refresh: refreshArticles }] = await Promise.all([
  useFetch<{ success: boolean; users: UserAccountRecord[] }>('/api/admin/accounts', {
    immediate: !!isAdmin.value,
  }),
  useFetch<{ success: boolean; total: number; articles: ArticleRecord[] }>('/api/admin/blog', {
    immediate: !!isAdmin.value,
  }),
])

const refreshData = async () => {
  await Promise.all([refreshUsers(), refreshArticles()])
}

const users = computed(() => usersData.value?.users || [])
const articles = computed(() => articlesData.value?.articles || [])

const publishedCount = computed(() => articles.value.filter(a => a.status === 'PUBLISHED').length)
const adminCount = computed(() => users.value.filter(u => u.role === 'ADMIN').length)
const recentArticles = computed(() => articles.value.slice(0, 8))

const stats = computed(() => [
  {
    label: 'Total Users',
    value: String(users.value.length),
    delta: `${adminCount.value} admins`,
    up: true,
    icon: Users,
    sub: 'registered accounts',
  },
  {
    label: 'Total Articles',
    value: String(articles.value.length),
    delta: `${publishedCount.value} live`,
    up: true,
    icon: FileText,
    sub: 'all blog posts',
  },
  {
    label: 'Published Posts',
    value: String(publishedCount.value),
    delta: 'Live',
    up: true,
    icon: Eye,
    sub: 'visible to public',
  },
  {
    label: 'Admins',
    value: String(adminCount.value),
    delta: 'Team',
    up: true,
    icon: ShieldCheck,
    sub: 'dashboard access',
  },
])

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<template>
  <!-- 1. AUTHENTICATED ADMIN: Render full layout & dashboard -->
  <NuxtLayout v-if="isAuthenticated && isAdmin" name="admin">
    <div class="flex flex-col gap-8 max-w-[1200px]">
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

      <!-- Recent Articles Table -->
      <div class="border border-white/10 rounded-xl bg-white/[0.01] overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <p class="text-sm font-bold text-white tracking-wide">Recent articles</p>
          <NuxtLink to="/admin/blog" class="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors">
            View all <ArrowRight :size="12" />
          </NuxtLink>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-white/5 bg-white/[0.02]">
                <th v-for="h in ['Article', 'Category', 'Read Time', 'Date', 'Status']" :key="h" class="px-6 py-3 text-[10px] tracking-widest uppercase text-white/30 font-semibold whitespace-nowrap">
                  {{ h }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr
                v-for="a in recentArticles"
                :key="a.id"
                class="hover:bg-white/[0.02] transition-colors text-xs"
              >
                <td class="px-6 py-3.5 text-white/90 font-medium max-w-[340px] truncate">
                  <NuxtLink :to="`/admin/blog/${a.id}`" class="hover:text-emerald-400 transition-colors">
                    {{ a.title }}
                  </NuxtLink>
                </td>
                <td class="px-6 py-3.5">
                  <span class="text-[10px] tracking-widest uppercase border border-white/10 rounded px-2 py-0.5 text-white/50 font-mono">
                    {{ a.category }}
                  </span>
                </td>
                <td class="px-6 py-3.5 text-white/40 whitespace-nowrap font-mono">
                  <span class="flex items-center gap-1">
                    <Clock :size="12" /> {{ a.readTime }}
                  </span>
                </td>
                <td class="px-6 py-3.5 text-white/40 whitespace-nowrap font-mono">
                  {{ formatDate(a.publishedAt || a.createdAt) }}
                </td>
                <td class="px-6 py-3.5 whitespace-nowrap">
                  <span :class="[
                    'text-[10px] tracking-wider uppercase border px-2 py-0.5 rounded font-mono',
                    a.status === 'PUBLISHED' 
                      ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' 
                      : 'text-white/40 border-white/10 bg-white/[0.02]'
                  ]">
                    {{ a.status }}
                  </span>
                </td>
              </tr>

              <tr v-if="recentArticles.length === 0">
                <td colspan="5" class="px-6 py-10 text-center text-white/30 text-xs">
                  No blog articles published yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </NuxtLayout>

  <!-- 2. UNAUTHENTICATED: Show Login Card directly on /admin -->
  <div v-else class="min-h-screen bg-[#020b0a] flex items-center justify-center p-6 text-white font-mono">
    <div class="w-full max-w-[420px] border border-white/10 bg-[#0d1413] rounded-2xl p-8 flex flex-col gap-6 shadow-2xl">
      <div class="text-center">
        <div class="w-12 h-12 rounded-full border border-emerald-400/30 bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto mb-3">
          <Lock :size="20" />
        </div>
        <h1 class="text-xl font-bold text-white tracking-tight">Admin Portal</h1>
        <p class="text-xs text-white/40 mt-1">Sign in with administrator credentials</p>
      </div>

      <div v-if="loginError" class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center">
        {{ loginError }}
      </div>

      <form @submit.prevent="handleLogin" class="flex flex-col gap-4 text-xs">
        <div>
          <label class="block text-white/40 uppercase tracking-wider mb-1.5 font-semibold">Email</label>
          <div class="flex items-center gap-2 bg-[#141d1c] border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-emerald-400 transition-colors">
            <Mail :size="15" class="text-white/30" />
            <input 
              v-model="email" 
              type="email" 
              required 
              placeholder="admin@ghidcult.ro" 
              class="bg-transparent flex-1 text-white outline-none"
            />
          </div>
        </div>

        <div>
          <label class="block text-white/40 uppercase tracking-wider mb-1.5 font-semibold">Password</label>
          <div class="flex items-center gap-2 bg-[#141d1c] border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-emerald-400 transition-colors">
            <Lock :size="15" class="text-white/30" />
            <input 
              v-model="password" 
              type="password" 
              required 
              placeholder="••••••••" 
              class="bg-transparent flex-1 text-white outline-none"
            />
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="loginLoading"
          class="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/10 mt-2 disabled:opacity-50"
        >
          <Loader2 v-if="loginLoading" :size="16" class="animate-spin" />
          <span>{{ loginLoading ? 'Authenticating…' : 'Sign in to Dashboard' }}</span>
        </button>
      </form>
    </div>
  </div>
</template>
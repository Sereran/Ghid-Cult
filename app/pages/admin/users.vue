<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Search, 
  Trash2, 
  ShieldCheck, 
  ShieldAlert, 
  Loader2, 
  UserPlus, 
  Pencil, 
  X,
  Upload,
  Camera
} from '@lucide/vue'
import type { UserAccountRecord, UserRole } from '~/data/admin'

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Manage Users | Admin',
})

const query = ref('')
const activeRole = ref<UserRole | ''>('')
const actionLoadingId = ref<string | null>(null)
const uploading = ref(false)

// Hidden file input refs for upload
const createFileInputRef = ref<HTMLInputElement | null>(null)
const editFileInputRef = ref<HTMLInputElement | null>(null)

// Fetch from API
const { data, pending, refresh } = await useFetch<{ success: boolean; users: UserAccountRecord[] }>(
  '/api/admin/accounts',
  {
    query: computed(() => ({
      search: query.value.trim() || undefined,
      role: activeRole.value || undefined,
    })),
    watch: [query, activeRole],
  }
)

const users = computed(() => data.value?.users || [])

const roleStyle: Record<UserRole, string> = {
  ADMIN: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  CUSTOMER: 'text-white/40 border-white/10 bg-white/[0.02]',
}

const getInitials = (name?: string) => {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// Upload helper for avatar images
const uploadAvatar = async (file: File): Promise<string | null> => {
  uploading.value = true
  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await $fetch<{ success: boolean; url: string }>('/api/admin/upload', {
      method: 'POST',
      body: formData,
    })
    return res.url
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to upload avatar.')
    return null
  } finally {
    uploading.value = false
  }
}

// --- CREATE USER ---
const showCreateModal = ref(false)
const createLoading = ref(false)
const createForm = ref({
  fullName: '',
  email: '',
  username: '',
  phone: '',
  avatarUrl: '',
  password: '',
  role: 'CUSTOMER' as UserRole,
})

const handleCreateAvatarUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const url = await uploadAvatar(file)
  if (url) createForm.value.avatarUrl = url
  target.value = ''
}

const handleCreateUser = async () => {
  if (!createForm.value.fullName || !createForm.value.email || !createForm.value.password) {
    alert('Please provide full name, email, and a password.')
    return
  }

  createLoading.value = true
  try {
    await $fetch('/api/admin/accounts', {
      method: 'POST',
      body: createForm.value,
    })
    showCreateModal.value = false
    createForm.value = {
      fullName: '',
      email: '',
      username: '',
      phone: '',
      avatarUrl: '',
      password: '',
      role: 'CUSTOMER',
    }
    await refresh()
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to create user.')
  } finally {
    createLoading.value = false
  }
}

// --- EDIT USER ---
const showEditModal = ref(false)
const editLoading = ref(false)
const editTargetId = ref<string | null>(null)
const editForm = ref({
  fullName: '',
  email: '',
  username: '',
  phone: '',
  avatarUrl: '',
  role: 'CUSTOMER' as UserRole,
  password: '',
})

const handleEditAvatarUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const url = await uploadAvatar(file)
  if (url) editForm.value.avatarUrl = url
  target.value = ''
}

const openEditModal = (user: UserAccountRecord) => {
  editTargetId.value = user.id
  editForm.value = {
    fullName: user.fullName || '',
    email: user.email || '',
    username: user.username || '',
    phone: user.phone || '',
    avatarUrl: user.avatarUrl || '',
    role: user.role,
    password: '',
  }
  showEditModal.value = true
}

const handleUpdateUser = async () => {
  if (!editTargetId.value) return

  editLoading.value = true
  try {
    const payload: Record<string, any> = {
      fullName: editForm.value.fullName,
      email: editForm.value.email,
      username: editForm.value.username || null,
      phone: editForm.value.phone || null,
      avatarUrl: editForm.value.avatarUrl || null,
      role: editForm.value.role,
    }
    if (editForm.value.password.trim()) {
      payload.password = editForm.value.password.trim()
    }

    await $fetch(`/api/admin/accounts/${editTargetId.value}`, {
      method: 'PATCH',
      body: payload,
    })

    showEditModal.value = false
    await refresh()
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to update user.')
  } finally {
    editLoading.value = false
  }
}

// --- QUICK ACTIONS ---
const toggleRole = async (user: UserAccountRecord) => {
  const newRole: UserRole = user.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN'
  const confirmed = confirm(`Change role for ${user.fullName} to ${newRole}?`)
  if (!confirmed) return

  actionLoadingId.value = user.id
  try {
    await $fetch(`/api/admin/accounts/${user.id}`, {
      method: 'PATCH',
      body: { role: newRole },
    })
    await refresh()
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to update user role.')
  } finally {
    actionLoadingId.value = null
  }
}

const deleteUser = async (user: UserAccountRecord) => {
  const confirmed = confirm(`Delete account for ${user.fullName} (${user.email})?`)
  if (!confirmed) return

  actionLoadingId.value = user.id
  try {
    await $fetch(`/api/admin/accounts/${user.id}`, {
      method: 'DELETE',
    })
    await refresh()
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to delete user.')
  } finally {
    actionLoadingId.value = null
  }
}
</script>

<template>
  <div class="flex flex-col gap-6 max-w-[1100px]">

    <!-- Header & Action -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p class="text-[11px] tracking-[0.2em] uppercase text-white/30 mb-1">Manage</p>
        <h1 class="text-3xl font-extrabold text-white tracking-tight">Users</h1>
      </div>
      <button
        type="button"
        class="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-2 rounded-xl text-xs transition-colors shadow-lg shadow-emerald-500/10"
        @click="showCreateModal = true"
      >
        <UserPlus :size="15" />
        Add New User
      </button>
    </div>

    <!-- Search & Role Filter Tabs -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2 border border-white/10 rounded-xl px-4 py-2.5 w-full sm:w-[320px] bg-white/[0.02] focus-within:border-emerald-400/50 transition-colors">
        <Search :size="14" class="text-white/30 shrink-0" />
        <input
          v-model="query"
          type="text"
          placeholder="Search by name, email, or username…"
          class="bg-transparent flex-1 text-xs text-white placeholder:text-white/20 outline-none"
        />
      </div>

      <div class="flex items-center gap-1 border border-white/10 rounded-xl p-1 bg-white/[0.02] text-xs">
        <button
          type="button"
          :class="['px-3 py-1.5 rounded-lg transition-colors', !activeRole ? 'bg-white/10 text-white font-semibold' : 'text-white/40 hover:text-white']"
          @click="activeRole = ''"
        >
          All
        </button>
        <button
          type="button"
          :class="['px-3 py-1.5 rounded-lg transition-colors', activeRole === 'ADMIN' ? 'bg-emerald-500/20 text-emerald-400 font-semibold' : 'text-white/40 hover:text-white']"
          @click="activeRole = 'ADMIN'"
        >
          Admins
        </button>
        <button
          type="button"
          :class="['px-3 py-1.5 rounded-lg transition-colors', activeRole === 'CUSTOMER' ? 'bg-white/10 text-white font-semibold' : 'text-white/40 hover:text-white']"
          @click="activeRole = 'CUSTOMER'"
        >
          Customers
        </button>
      </div>
    </div>

    <!-- Accounts Table -->
    <div class="border border-white/10 rounded-xl bg-white/[0.01] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-white/5 bg-white/[0.02]">
              <th v-for="h in ['User', 'Joined', 'Bookings', 'Articles', 'Role', 'Actions']" :key="h" class="px-5 py-3 text-[10px] tracking-widest uppercase text-white/30 font-semibold whitespace-nowrap">
                {{ h }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr v-if="pending && users.length === 0">
              <td colspan="6" class="px-5 py-12 text-center text-white/40 text-xs">
                <Loader2 :size="18" class="animate-spin inline mr-2 text-emerald-400" />
                Loading accounts from database…
              </td>
            </tr>

            <tr v-for="u in users" :key="u.id" class="hover:bg-white/[0.02] transition-colors group text-xs">
              <!-- Avatar with fallback to initials -->
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white/50 text-[11px] font-bold shrink-0 font-mono overflow-hidden">
                    <img 
                      v-if="u.avatarUrl" 
                      :src="u.avatarUrl" 
                      :alt="u.fullName" 
                      class="w-full h-full object-cover" 
                      @error="(e: any) => e.target.style.display = 'none'"
                    />
                    <span v-else>{{ getInitials(u.fullName) }}</span>
                  </div>
                  <div>
                    <p class="font-bold text-white/80">{{ u.fullName }}</p>
                    <p class="text-[11px] text-white/30">{{ u.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-3.5 text-white/40 whitespace-nowrap">
                {{ formatDate(u.createdAt) }}
              </td>
              <td class="px-5 py-3.5 text-white/60 text-center font-mono">
                {{ u._count?.bookings ?? 0 }}
              </td>
              <td class="px-5 py-3.5 text-white/60 text-center font-mono">
                {{ u._count?.articles ?? 0 }}
              </td>
              <td class="px-5 py-3.5">
                <span :class="['text-[10px] tracking-widest uppercase border px-2 py-0.5 rounded font-mono', roleStyle[u.role] || roleStyle.CUSTOMER]">
                  {{ u.role }}
                </span>
              </td>
              <td class="px-5 py-3.5 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    title="Edit User"
                    class="p-1.5 rounded border border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                    @click="openEditModal(u)"
                  >
                    <Pencil :size="13" />
                  </button>

                  <button
                    type="button"
                    :disabled="actionLoadingId === u.id"
                    :title="u.role === 'ADMIN' ? 'Demote to Customer' : 'Promote to Admin'"
                    class="p-1.5 rounded border border-white/10 text-white/40 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-colors"
                    @click="toggleRole(u)"
                  >
                    <ShieldAlert v-if="u.role === 'ADMIN'" :size="13" />
                    <ShieldCheck v-else :size="13" />
                  </button>

                  <button
                    type="button"
                    :disabled="actionLoadingId === u.id"
                    title="Delete User"
                    class="p-1.5 rounded border border-white/10 text-white/40 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-colors"
                    @click="deleteUser(u)"
                  >
                    <Trash2 :size="13" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="!pending && users.length === 0" class="text-white/30 text-xs text-center py-12">
        No accounts found matching your query.
      </div>
    </div>

    <p class="text-[11px] text-white/30 font-mono">
      Showing {{ users.length }} user(s)
    </p>

    <!-- CREATE USER MODAL -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="border border-white/10 bg-[#121214] rounded-2xl w-full max-w-[480px] p-6 flex flex-col gap-5 text-white">
        <div class="flex items-center justify-between border-b border-white/5 pb-3">
          <h2 class="text-lg font-bold">Create New Account</h2>
          <button @click="showCreateModal = false" class="text-white/40 hover:text-white">
            <X :size="18" />
          </button>
        </div>

        <form @submit.prevent="handleCreateUser" class="flex flex-col gap-4 text-xs">
          <!-- Avatar Uploader -->
          <div class="flex items-center gap-4">
            <input 
              ref="createFileInputRef" 
              type="file" 
              accept="image/*" 
              class="hidden" 
              @change="handleCreateAvatarUpload" 
            />
            
            <div class="relative w-14 h-14 rounded-full border border-white/15 bg-white/5 flex items-center justify-center shrink-0 overflow-hidden">
              <img v-if="createForm.avatarUrl" :src="createForm.avatarUrl" alt="Avatar" class="w-full h-full object-cover" />
              <Camera v-else :size="20" class="text-white/30" />
            </div>

            <div class="flex flex-col gap-1.5">
              <span class="text-white/50 text-xs">Profile Picture</span>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  :disabled="uploading"
                  @click="createFileInputRef?.click()"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium"
                >
                  <Loader2 v-if="uploading" :size="12" class="animate-spin text-emerald-400" />
                  <Upload v-else :size="12" class="text-emerald-400" />
                  {{ uploading ? 'Uploading…' : 'Upload photo' }}
                </button>
                <button
                  v-if="createForm.avatarUrl"
                  type="button"
                  @click="createForm.avatarUrl = ''"
                  class="text-[11px] text-rose-400 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-white/50 mb-1">Full Name *</label>
            <input v-model="createForm.fullName" required type="text" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" placeholder="e.g. Elena Vasilescu" />
          </div>

          <div>
            <label class="block text-white/50 mb-1">Email Address *</label>
            <input v-model="createForm.email" required type="email" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" placeholder="elena@example.com" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-white/50 mb-1">Username</label>
              <input v-model="createForm.username" type="text" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" placeholder="elena_v" />
            </div>
            <div>
              <label class="block text-white/50 mb-1">Phone</label>
              <input v-model="createForm.phone" type="text" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" placeholder="+40 700 000 000" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-white/50 mb-1">Password *</label>
              <input v-model="createForm.password" required type="password" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" placeholder="••••••••" />
            </div>
            <div>
              <label class="block text-white/50 mb-1">Role</label>
              <select v-model="createForm.role" class="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400">
                <option value="CUSTOMER">CUSTOMER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
            <button type="button" @click="showCreateModal = false" class="px-4 py-2 border border-white/10 rounded-lg text-white/60 hover:text-white">Cancel</button>
            <button type="submit" :disabled="createLoading" class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-lg disabled:opacity-50">
              {{ createLoading ? 'Creating…' : 'Create User' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- EDIT USER MODAL -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="border border-white/10 bg-[#121214] rounded-2xl w-full max-w-[480px] p-6 flex flex-col gap-5 text-white">
        <div class="flex items-center justify-between border-b border-white/5 pb-3">
          <h2 class="text-lg font-bold">Edit Account</h2>
          <button @click="showEditModal = false" class="text-white/40 hover:text-white">
            <X :size="18" />
          </button>
        </div>

        <form @submit.prevent="handleUpdateUser" class="flex flex-col gap-4 text-xs">
          <!-- Avatar Uploader -->
          <div class="flex items-center gap-4">
            <input 
              ref="editFileInputRef" 
              type="file" 
              accept="image/*" 
              class="hidden" 
              @change="handleEditAvatarUpload" 
            />
            
            <div class="relative w-14 h-14 rounded-full border border-white/15 bg-white/5 flex items-center justify-center shrink-0 overflow-hidden">
              <img v-if="editForm.avatarUrl" :src="editForm.avatarUrl" alt="Avatar" class="w-full h-full object-cover" />
              <Camera v-else :size="20" class="text-white/30" />
            </div>

            <div class="flex flex-col gap-1.5">
              <span class="text-white/50 text-xs">Profile Picture</span>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  :disabled="uploading"
                  @click="editFileInputRef?.click()"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium"
                >
                  <Loader2 v-if="uploading" :size="12" class="animate-spin text-emerald-400" />
                  <Upload v-else :size="12" class="text-emerald-400" />
                  {{ uploading ? 'Uploading…' : 'Upload photo' }}
                </button>
                <button
                  v-if="editForm.avatarUrl"
                  type="button"
                  @click="editForm.avatarUrl = ''"
                  class="text-[11px] text-rose-400 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-white/50 mb-1">Full Name</label>
            <input v-model="editForm.fullName" required type="text" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" />
          </div>

          <div>
            <label class="block text-white/50 mb-1">Email Address</label>
            <input v-model="editForm.email" required type="email" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-white/50 mb-1">Username</label>
              <input v-model="editForm.username" type="text" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" />
            </div>
            <div>
              <label class="block text-white/50 mb-1">Phone</label>
              <input v-model="editForm.phone" type="text" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-white/50 mb-1">Reset Password (Optional)</label>
              <input v-model="editForm.password" type="password" placeholder="Leave blank to keep" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" />
            </div>
            <div>
              <label class="block text-white/50 mb-1">Role</label>
              <select v-model="editForm.role" class="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400">
                <option value="CUSTOMER">CUSTOMER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
            <button type="button" @click="showEditModal = false" class="px-4 py-2 border border-white/10 rounded-lg text-white/60 hover:text-white">Cancel</button>
            <button type="submit" :disabled="editLoading" class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-lg disabled:opacity-50">
              {{ editLoading ? 'Saving…' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>
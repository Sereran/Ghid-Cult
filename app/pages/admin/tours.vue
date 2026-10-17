<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Search, 
  Plus, 
  Trash2, 
  Eye, 
  Loader2, 
  X, 
  MapPin, 
  Clock,
  Pencil 
} from '@lucide/vue'
import type { AdminTourRecord, CreateTourFormInput } from '~/data/tours'

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Manage Tours | Admin',
})

const query = ref('')
const activeFilter = ref<string>('')
const actionLoadingId = ref<string | null>(null)

// Fetch tours from database
const { data, pending, refresh } = await useFetch<{ success: boolean; total: number; tours: AdminTourRecord[] }>(
  '/api/admin/tours',
  {
    query: computed(() => ({
      search: query.value.trim() || undefined,
      isActive: activeFilter.value !== '' ? activeFilter.value : undefined,
    })),
    watch: [query, activeFilter],
  }
)

const tours = computed(() => data.value?.tours || [])

// Toggle Tour Status
const toggleActive = async (tour: AdminTourRecord) => {
  actionLoadingId.value = tour.id
  const targetState = !tour.isActive

  try {
    await $fetch(`/api/admin/tours/${tour.id}`, {
      method: 'PATCH',
      body: { isActive: targetState },
    })
    tour.isActive = targetState
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to update tour status.')
  } finally {
    actionLoadingId.value = null
  }
}

// Delete Tour
const deleteTour = async (tour: AdminTourRecord) => {
  const confirmed = confirm(`Are you sure you want to delete "${tour.title}"?`)
  if (!confirmed) return

  actionLoadingId.value = tour.id
  try {
    await $fetch(`/api/admin/tours/${tour.id}`, {
      method: 'DELETE',
    })
    await refresh()
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to delete tour.')
  } finally {
    actionLoadingId.value = null
  }
}

// Create Tour Modal
const showCreateModal = ref(false)
const createLoading = ref(false)
const createForm = ref<CreateTourFormInput>({
  title: '',
  imageUrl: '',
  mainTag: 'Heritage',
  tags: 'History, Walking Tour, Culture',
  shortDescription: '',
  fullDescription: '',
  meetingPlace: '',
  departureTime: '10:00 AM',
  duration: '2.5 hours',
  location: 'Iași, Romania',
  price: 100,
  maxPersons: 12,
  isFeatured: false,
})

const handleCreateTour = async () => {
  createLoading.value = true
  try {
    await $fetch('/api/admin/tours', {
      method: 'POST',
      body: {
        ...createForm.value,
        price: Number(createForm.value.price),
        maxPersons: Number(createForm.value.maxPersons),
        tags: createForm.value.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        fullDescription: `<p>${createForm.value.fullDescription}</p>`,
      },
    })

    showCreateModal.value = false
    createForm.value = {
      title: '',
      imageUrl: '',
      mainTag: 'Heritage',
      tags: 'History, Walking Tour, Culture',
      shortDescription: '',
      fullDescription: '',
      meetingPlace: '',
      departureTime: '10:00 AM',
      duration: '2.5 hours',
      location: 'Iași, Romania',
      price: 100,
      maxPersons: 12,
      isFeatured: false,
    }
    await refresh()
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to create tour.')
  } finally {
    createLoading.value = false
  }
}

// Edit Tour Modal
const showEditModal = ref(false)
const editLoading = ref(false)
const editTargetId = ref<string | null>(null)
const editForm = ref<CreateTourFormInput>({
  title: '',
  imageUrl: '',
  mainTag: 'Heritage',
  tags: '',
  shortDescription: '',
  fullDescription: '',
  meetingPlace: '',
  departureTime: '10:00 AM',
  duration: '2.5 hours',
  location: 'Iași, Romania',
  price: 100,
  maxPersons: 12,
  isFeatured: false,
})

const openEditModal = (tour: AdminTourRecord) => {
  editTargetId.value = tour.id
  editForm.value = {
    title: tour.title,
    imageUrl: tour.imageUrl,
    mainTag: tour.mainTag || '',
    tags: Array.isArray(tour.tags) ? tour.tags.join(', ') : '',
    shortDescription: tour.shortDescription,
    fullDescription: tour.fullDescription.replace(/<\/?p>/g, ''),
    meetingPlace: tour.meetingPlace,
    departureTime: tour.departureTime,
    duration: tour.duration,
    location: tour.location,
    price: tour.price,
    maxPersons: tour.maxPersons,
    isFeatured: tour.isFeatured,
  }
  showEditModal.value = true
}

const handleUpdateTour = async () => {
  if (!editTargetId.value) return

  editLoading.value = true
  try {
    await $fetch(`/api/admin/tours/${editTargetId.value}`, {
      method: 'PATCH',
      body: {
        ...editForm.value,
        price: Number(editForm.value.price),
        maxPersons: Number(editForm.value.maxPersons),
        tags: editForm.value.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        fullDescription: `<p>${editForm.value.fullDescription}</p>`,
      },
    })

    showEditModal.value = false
    await refresh()
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to update tour.')
  } finally {
    editLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-6 max-w-[1200px]">

    <!-- Header -->
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <p class="text-[11px] tracking-[0.2em] uppercase text-white/30 mb-1">Manage</p>
        <h1 class="text-3xl font-extrabold text-white tracking-tight">Tours</h1>
      </div>
      <button 
        type="button" 
        class="flex items-center gap-2 bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
        @click="showCreateModal = true"
      >
        <Plus :size="14" />
        Add tour
      </button>
    </div>

    <!-- Filters Bar -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2 border border-white/10 rounded-xl px-4 py-2.5 w-full sm:w-[320px] bg-white/[0.02] focus-within:border-emerald-400/50 transition-colors">
        <Search :size="14" class="text-white/30 shrink-0" />
        <input
          v-model="query"
          type="text"
          placeholder="Search tours…"
          class="bg-transparent flex-1 text-xs text-white placeholder:text-white/20 outline-none"
        />
      </div>

      <div class="flex items-center gap-1 border border-white/10 rounded-xl p-1 bg-white/[0.02] text-xs">
        <button
          type="button"
          :class="['px-3 py-1.5 rounded-lg transition-colors', activeFilter === '' ? 'bg-white/10 text-white font-semibold' : 'text-white/40 hover:text-white']"
          @click="activeFilter = ''"
        >
          All
        </button>
        <button
          type="button"
          :class="['px-3 py-1.5 rounded-lg transition-colors', activeFilter === 'true' ? 'bg-emerald-500/20 text-emerald-400 font-semibold' : 'text-white/40 hover:text-white']"
          @click="activeFilter = 'true'"
        >
          Active
        </button>
        <button
          type="button"
          :class="['px-3 py-1.5 rounded-lg transition-colors', activeFilter === 'false' ? 'bg-white/10 text-white font-semibold' : 'text-white/40 hover:text-white']"
          @click="activeFilter = 'false'"
        >
          Inactive
        </button>
      </div>
    </div>

    <!-- Tours Table -->
    <div class="border border-white/10 rounded-xl bg-white/[0.01] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-white/5 bg-white/[0.02]">
              <th 
                v-for="h in ['Tour', 'Tag', 'Duration', 'Price', 'Bookings', 'Status', 'Actions']" 
                :key="h" 
                class="px-5 py-3 text-[10px] tracking-widest uppercase text-white/30 font-semibold whitespace-nowrap"
              >
                {{ h }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr v-if="pending && tours.length === 0">
              <td colspan="7" class="px-5 py-12 text-center text-white/40 text-xs">
                <Loader2 :size="18" class="animate-spin inline mr-2 text-emerald-400" />
                Loading tours from database…
              </td>
            </tr>

            <!-- Tour Item -->
            <tr
              v-for="tour in tours"
              :key="tour.id"
              class="hover:bg-white/[0.02] transition-colors group text-xs"
            >
              <!-- Tour Info -->
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                    <img 
                      :src="tour.imageUrl" 
                      :alt="tour.title" 
                      class="w-full h-full object-cover opacity-80" 
                      @error="(e: any) => e.target.style.display = 'none'"
                    />
                  </div>
                  <div class="min-w-0">
                    <p class="font-bold text-white/90 leading-snug line-clamp-1">{{ tour.title }}</p>
                    <p class="text-[11px] text-white/30 flex items-center gap-1">
                      <MapPin :size="10" /> {{ tour.location }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Tag -->
              <td class="px-5 py-3.5">
                <span class="text-[10px] tracking-widest uppercase border border-white/10 rounded px-2 py-0.5 text-white/50 font-mono">
                  {{ tour.mainTag || 'Tour' }}
                </span>
              </td>

              <!-- Duration -->
              <td class="px-5 py-3.5 text-white/50 whitespace-nowrap">
                <span class="flex items-center gap-1"><Clock :size="11" /> {{ tour.duration }}</span>
              </td>

              <!-- Price -->
              <td class="px-5 py-3.5 font-bold text-white font-mono whitespace-nowrap">
                {{ tour.price }} Lei
              </td>

              <!-- Bookings Count -->
              <td class="px-5 py-3.5 text-center text-white/50 font-mono">
                {{ tour._count?.bookings ?? 0 }}
              </td>

              <!-- Status Toggle Switch -->
              <td class="px-5 py-3.5">
                <button
                  type="button"
                  :disabled="actionLoadingId === tour.id"
                  @click="toggleActive(tour)"
                  :class="[
                    'relative w-9 h-5 rounded-full transition-colors',
                    tour.isActive ? 'bg-emerald-500/30' : 'bg-white/10'
                  ]"
                >
                  <span
                    :class="[
                      'absolute top-0.5 w-4 h-4 rounded-full transition-all',
                      tour.isActive ? 'left-4 bg-emerald-400 shadow-sm' : 'left-0.5 bg-white/30'
                    ]"
                  />
                </button>
              </td>

              <!-- Actions -->
              <td class="px-5 py-3.5 whitespace-nowrap">
                <div class="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  <NuxtLink
                    :to="`/tours/${tour.slug}`"
                    target="_blank"
                    class="w-7 h-7 rounded flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                    title="View public tour"
                  >
                    <Eye :size="14" />
                  </NuxtLink>

                  <button 
                    type="button" 
                    class="w-7 h-7 rounded flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                    title="Edit tour"
                    @click="openEditModal(tour)"
                  >
                    <Pencil :size="13" />
                  </button>

                  <button 
                    type="button" 
                    :disabled="actionLoadingId === tour.id"
                    class="w-7 h-7 rounded flex items-center justify-center text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete tour"
                    @click="deleteTour(tour)"
                  >
                    <Trash2 :size="13" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="!pending && tours.length === 0" class="text-white/30 text-xs text-center py-12">
        No tours match your criteria.
      </p>
    </div>

    <p class="text-[11px] text-white/30 font-mono">Showing {{ tours.length }} tour(s)</p>

    <!-- Create Tour Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="border border-white/10 bg-[#121214] rounded-2xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-5 text-white">
        <div class="flex items-center justify-between border-b border-white/5 pb-3">
          <h2 class="text-lg font-bold">Add New Tour</h2>
          <button @click="showCreateModal = false" class="text-white/40 hover:text-white">
            <X :size="18" />
          </button>
        </div>

        <form @submit.prevent="handleCreateTour" class="flex flex-col gap-4 text-xs">
          <div>
            <label class="block text-white/50 mb-1">Tour Title *</label>
            <input v-model="createForm.title" required type="text" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" placeholder="e.g. Hidden Courtyards of Iași" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-white/50 mb-1">Image URL *</label>
              <input v-model="createForm.imageUrl" required type="text" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" placeholder="/images/tours/example.jpg" />
            </div>
            <div>
              <label class="block text-white/50 mb-1">Main Tag</label>
              <input v-model="createForm.mainTag" type="text" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" placeholder="Heritage" />
            </div>
          </div>

          <div>
            <label class="block text-white/50 mb-1">Tags (comma-separated)</label>
            <input v-model="createForm.tags" type="text" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" placeholder="History, Walking Tour, Architecture" />
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-white/50 mb-1">Price (RON) *</label>
              <input v-model="createForm.price" required type="number" step="0.01" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" />
            </div>
            <div>
              <label class="block text-white/50 mb-1">Duration *</label>
              <input v-model="createForm.duration" required type="text" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" placeholder="2.5 hours" />
            </div>
            <div>
              <label class="block text-white/50 mb-1">Max Group *</label>
              <input v-model="createForm.maxPersons" required type="number" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-white/50 mb-1">Meeting Place *</label>
              <input v-model="createForm.meetingPlace" required type="text" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" placeholder="In front of Palatul Culturii" />
            </div>
            <div>
              <label class="block text-white/50 mb-1">Departure Time *</label>
              <input v-model="createForm.departureTime" required type="text" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" placeholder="10:00 AM" />
            </div>
          </div>

          <div>
            <label class="block text-white/50 mb-1">Short Description *</label>
            <textarea v-model="createForm.shortDescription" required rows="2" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400 resize-none" placeholder="Brief hook displayed on catalog cards..."></textarea>
          </div>

          <div>
            <label class="block text-white/50 mb-1">Full Description *</label>
            <textarea v-model="createForm.fullDescription" required rows="4" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400 resize-none" placeholder="Detailed tour schedule and experience overview..."></textarea>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
            <button type="button" @click="showCreateModal = false" class="px-4 py-2 border border-white/10 rounded-lg text-white/60 hover:text-white">Cancel</button>
            <button type="submit" :disabled="createLoading" class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-lg disabled:opacity-50">
              {{ createLoading ? 'Creating…' : 'Create Tour' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Tour Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="border border-white/10 bg-[#121214] rounded-2xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-5 text-white">
        <div class="flex items-center justify-between border-b border-white/5 pb-3">
          <h2 class="text-lg font-bold">Edit Tour</h2>
          <button @click="showEditModal = false" class="text-white/40 hover:text-white">
            <X :size="18" />
          </button>
        </div>

        <form @submit.prevent="handleUpdateTour" class="flex flex-col gap-4 text-xs">
          <div>
            <label class="block text-white/50 mb-1">Tour Title *</label>
            <input v-model="editForm.title" required type="text" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-white/50 mb-1">Image URL *</label>
              <input v-model="editForm.imageUrl" required type="text" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" />
            </div>
            <div>
              <label class="block text-white/50 mb-1">Main Tag</label>
              <input v-model="editForm.mainTag" type="text" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" />
            </div>
          </div>

          <div>
            <label class="block text-white/50 mb-1">Tags (comma-separated)</label>
            <input v-model="editForm.tags" type="text" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" />
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-white/50 mb-1">Price (RON) *</label>
              <input v-model="editForm.price" required type="number" step="0.01" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" />
            </div>
            <div>
              <label class="block text-white/50 mb-1">Duration *</label>
              <input v-model="editForm.duration" required type="text" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" />
            </div>
            <div>
              <label class="block text-white/50 mb-1">Max Group *</label>
              <input v-model="editForm.maxPersons" required type="number" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-white/50 mb-1">Meeting Place *</label>
              <input v-model="editForm.meetingPlace" required type="text" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" />
            </div>
            <div>
              <label class="block text-white/50 mb-1">Departure Time *</label>
              <input v-model="editForm.departureTime" required type="text" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" />
            </div>
          </div>

          <div>
            <label class="block text-white/50 mb-1">Short Description *</label>
            <textarea v-model="editForm.shortDescription" required rows="2" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400 resize-none"></textarea>
          </div>

          <div>
            <label class="block text-white/50 mb-1">Full Description *</label>
            <textarea v-model="editForm.fullDescription" required rows="4" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400 resize-none"></textarea>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
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
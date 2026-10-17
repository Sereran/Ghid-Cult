<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Search, 
  Trash2, 
  Loader2, 
  Calendar, 
  User, 
  MapPin, 
  Pencil, 
  X 
} from '@lucide/vue'
import type { BookingRecord, BookingStatus, PaymentStatus } from '~/data/admin'

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Manage Bookings | Admin',
})

const query = ref('')
const activeFilter = ref<'ALL' | BookingStatus>('ALL')
const actionLoadingId = ref<string | null>(null)

// Fetch bookings from database
const { data, pending, refresh } = await useFetch<{ success: boolean; total: number; bookings: BookingRecord[] }>(
  '/api/admin/bookings',
  {
    query: computed(() => ({
      search: query.value.trim() || undefined,
      bookingStatus: activeFilter.value !== 'ALL' ? activeFilter.value : undefined,
    })),
    watch: [query, activeFilter],
  }
)

const bookings = computed(() => data.value?.bookings || [])

// Status styling for booking badge
const bookingStatusStyle: Record<BookingStatus, string> = {
  CONFIRMED: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  PENDING: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  CANCELLED: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
}

// Payment status badge
const paymentStatusStyle: Record<PaymentStatus, string> = {
  PAID: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
  UNPAID: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
  REFUNDED: 'text-slate-400 border-white/10 bg-white/5',
}

// Counts across statuses
const counts = computed(() => {
  const all = bookings.value
  return {
    ALL: all.length,
    CONFIRMED: all.filter((b) => b.bookingStatus === 'CONFIRMED').length,
    PENDING: all.filter((b) => b.bookingStatus === 'PENDING').length,
    CANCELLED: all.filter((b) => b.bookingStatus === 'CANCELLED').length,
  }
})

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// Status Switch
const updateBookingStatus = async (booking: BookingRecord, nextStatus: BookingStatus) => {
  actionLoadingId.value = booking.id
  try {
    await $fetch(`/api/admin/bookings/${booking.id}`, {
      method: 'PATCH',
      body: { bookingStatus: nextStatus },
    })
    booking.bookingStatus = nextStatus
    await refresh()
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to update booking status.')
  } finally {
    actionLoadingId.value = null
  }
}

// Delete Booking
const deleteBooking = async (booking: BookingRecord) => {
  const confirmed = confirm(`Are you sure you want to delete booking #${booking.id} for ${booking.customerName}?`)
  if (!confirmed) return

  actionLoadingId.value = booking.id
  try {
    await $fetch(`/api/admin/bookings/${booking.id}`, {
      method: 'DELETE',
    })
    await refresh()
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to delete booking.')
  } finally {
    actionLoadingId.value = null
  }
}

// Edit Booking Modal
const showEditModal = ref(false)
const editLoading = ref(false)
const editTargetId = ref<string | null>(null)
const editForm = ref({
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  bookingStatus: 'PENDING' as BookingStatus,
  paymentStatus: 'UNPAID' as PaymentStatus,
  persons: 1,
  tourDate: '',
  billingAddress: '',
})

const openEditModal = (booking: BookingRecord) => {
  editTargetId.value = booking.id
  editForm.value = {
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone || '',
    bookingStatus: booking.bookingStatus,
    paymentStatus: booking.paymentStatus,
    persons: booking.persons,
    tourDate: booking.tourDate ? (new Date(booking.tourDate).toISOString().split('T')[0] ?? '') : '',
    billingAddress: booking.billingAddress || '',
  }
  showEditModal.value = true
}

const handleUpdateBooking = async () => {
  if (!editTargetId.value) return

  editLoading.value = true
  try {
    await $fetch(`/api/admin/bookings/${editTargetId.value}`, {
      method: 'PATCH',
      body: {
        ...editForm.value,
        persons: Number(editForm.value.persons),
      },
    })
    showEditModal.value = false
    await refresh()
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Failed to update booking details.')
  } finally {
    editLoading.value = false
  }
}
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
      <!-- Status Filter Tabs -->
      <div class="flex items-center gap-2 flex-wrap text-xs">
        <button
          v-for="status in (['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'] as const)"
          :key="status"
          type="button"
          @click="activeFilter = status"
          :class="[
            'flex items-center gap-2 text-[11px] tracking-wider uppercase px-4 py-2 border rounded-xl transition-colors font-mono',
            activeFilter === status
              ? 'border-white bg-white text-neutral-950 font-bold'
              : 'border-white/10 text-white/40 hover:text-white hover:border-white/25 bg-white/[0.02]'
          ]"
        >
          <span>{{ status === 'ALL' ? 'All' : status }}</span>
          <span :class="['text-[10px]', activeFilter === status ? 'text-neutral-700' : 'text-white/30']">
            {{ counts[status] }}
          </span>
        </button>
      </div>

      <!-- Search Input -->
      <div class="flex items-center gap-2 border border-white/10 rounded-xl px-3.5 py-2.5 bg-white/[0.02] focus-within:border-emerald-400/50 transition-colors w-full sm:w-[260px]">
        <Search :size="13" class="text-white/30 shrink-0" />
        <input
          v-model="query"
          type="text"
          placeholder="Search customer, tour, or email…"
          class="bg-transparent text-xs text-white placeholder:text-white/20 outline-none w-full"
        />
      </div>
    </div>

    <!-- Bookings Table -->
    <div class="border border-white/10 rounded-xl bg-white/[0.01] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-white/5 bg-white/[0.02]">
              <th 
                v-for="h in ['Customer', 'Tour', 'Booked On', 'Tour Date', 'Persons', 'Total', 'Payment', 'Status', 'Actions']" 
                :key="h" 
                class="px-5 py-3 text-[10px] tracking-widest uppercase text-white/30 font-semibold whitespace-nowrap"
              >
                {{ h }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr v-if="pending && bookings.length === 0">
              <td colspan="9" class="px-5 py-12 text-center text-white/40 text-xs">
                <Loader2 :size="18" class="animate-spin inline mr-2 text-emerald-400" />
                Loading bookings from database…
              </td>
            </tr>

            <!-- Booking Item -->
            <tr
              v-for="b in bookings"
              :key="b.id"
              class="hover:bg-white/[0.02] transition-colors group text-xs"
            >
              <!-- Customer Details -->
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-2">
                  <User :size="14" class="text-white/30 shrink-0" />
                  <div>
                    <p class="font-bold text-white/90 whitespace-nowrap">{{ b.customerName }}</p>
                    <p class="text-[11px] text-white/40 font-mono">{{ b.customerEmail }}</p>
                  </div>
                </div>
              </td>

              <!-- Tour -->
              <td class="px-5 py-3.5 max-w-[180px] truncate whitespace-nowrap">
                <p class="text-white/80 font-medium truncate">{{ b.tour?.title || 'Tour Deleted/Custom' }}</p>
                <p v-if="b.tour?.slug" class="text-[10px] text-white/30 truncate font-mono">/tours/{{ b.tour.slug }}</p>
              </td>

              <!-- Booked On -->
              <td class="px-5 py-3.5 text-white/40 whitespace-nowrap font-mono">
                {{ formatDate(b.createdAt) }}
              </td>

              <!-- Tour Date -->
              <td class="px-5 py-3.5 text-white/70 whitespace-nowrap font-mono">
                <span class="flex items-center gap-1.5"><Calendar :size="12" class="text-white/30" /> {{ formatDate(b.tourDate) }}</span>
              </td>

              <!-- Persons -->
              <td class="px-5 py-3.5 text-white/60 text-center font-mono">
                {{ b.persons }}
              </td>

              <!-- Total Price -->
              <td class="px-5 py-3.5 text-white font-bold font-mono whitespace-nowrap">
                {{ b.totalPrice }} Lei
              </td>

              <!-- Payment Status -->
              <td class="px-5 py-3.5 whitespace-nowrap">
                <span :class="['text-[10px] tracking-wider uppercase border px-2 py-0.5 rounded font-mono', paymentStatusStyle[b.paymentStatus]]">
                  {{ b.paymentStatus }}
                </span>
              </td>

              <!-- Booking Status Badge & Dropdown -->
              <td class="px-5 py-3.5 whitespace-nowrap">
                <select 
                  :value="b.bookingStatus"
                  :disabled="actionLoadingId === b.id"
                  @change="(e: any) => updateBookingStatus(b, e.target.value as BookingStatus)"
                  :class="[
                    'text-[10px] tracking-wider uppercase border px-2 py-1 rounded font-mono outline-none cursor-pointer bg-[#141416]',
                    bookingStatusStyle[b.bookingStatus]
                  ]"
                >
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </td>

              <!-- Action Buttons -->
              <td class="px-5 py-3.5 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button 
                    type="button" 
                    class="w-7 h-7 rounded flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                    title="Edit booking"
                    @click="openEditModal(b)"
                  >
                    <Pencil :size="13" />
                  </button>

                  <button 
                    type="button" 
                    :disabled="actionLoadingId === b.id"
                    class="w-7 h-7 rounded flex items-center justify-center text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete booking"
                    @click="deleteBooking(b)"
                  >
                    <Trash2 :size="13" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="!pending && bookings.length === 0" class="text-white/30 text-xs text-center py-12">
        No bookings found.
      </p>
    </div>

    <p class="text-[11px] text-white/30 font-mono">{{ bookings.length }} total booking(s)</p>

    <!-- Edit Booking Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="border border-white/10 bg-[#121214] rounded-2xl w-full max-w-[500px] p-6 flex flex-col gap-5 text-white">
        <div class="flex items-center justify-between border-b border-white/5 pb-3">
          <h2 class="text-lg font-bold">Edit Booking #{{ editTargetId }}</h2>
          <button @click="showEditModal = false" class="text-white/40 hover:text-white">
            <X :size="18" />
          </button>
        </div>

        <form @submit.prevent="handleUpdateBooking" class="flex flex-col gap-4 text-xs">
          <div>
            <label class="block text-white/50 mb-1">Customer Name *</label>
            <input v-model="editForm.customerName" required type="text" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-white/50 mb-1">Customer Email *</label>
              <input v-model="editForm.customerEmail" required type="email" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" />
            </div>
            <div>
              <label class="block text-white/50 mb-1">Customer Phone</label>
              <input v-model="editForm.customerPhone" type="text" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-white/50 mb-1">Tour Date</label>
              <input v-model="editForm.tourDate" type="date" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" />
            </div>
            <div>
              <label class="block text-white/50 mb-1">Number of Persons</label>
              <input v-model="editForm.persons" type="number" min="1" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-white/50 mb-1">Booking Status</label>
              <select v-model="editForm.bookingStatus" class="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400">
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="PENDING">PENDING</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
            <div>
              <label class="block text-white/50 mb-1">Payment Status</label>
              <select v-model="editForm.paymentStatus" class="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400">
                <option value="PAID">PAID</option>
                <option value="UNPAID">UNPAID</option>
                <option value="REFUNDED">REFUNDED</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-white/50 mb-1">Billing Address</label>
            <textarea v-model="editForm.billingAddress" rows="2" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-400 resize-none"></textarea>
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
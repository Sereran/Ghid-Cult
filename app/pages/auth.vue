<script setup lang="ts">
import { ref } from 'vue'
import { Eye, EyeOff, MapPin, ArrowRight } from 'lucide-vue-next'

const BG = "https://images.unsplash.com/photo-1782049075945-4014d719a4a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400&q=80"

// Reactive States
const mode = ref<'login' | 'register'>('login')
const showPass = ref(false)
const showConfirm = ref(false)

const name = ref('')
const email = ref('')
const password = ref('')
const confirm = ref('')

const switchMode = (m: 'login' | 'register') => {
  mode.value = m
  showPass.value = false
  showConfirm.value = false
}

const handleSubmit = () => {
  if (mode.value === 'login') {
    console.log('Logging in with:', { email: email.value, password: password.value })
  } else {
    console.log('Registering with:', { name: name.value, email: email.value, password: password.value, confirm: confirm.value })
  }
}

useHead({
  title: 'Sign In / Register | GhidCult'
})
</script>

<template>
  <div class="min-h-screen grid grid-cols-1 md:grid-cols-[1fr_520px]">

    <!-- Panel -->
    <div class="relative hidden md:flex flex-col justify-between overflow-hidden bg-[#030f0e]">
      <img
        :src="BG"
        alt="Iași cityscape backdrop"
        class="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-[#030f0e]/20 to-[#030f0e]" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#030f0e] via-transparent to-[#030f0e]/60" />

      <!-- Brand Logo -->
      <div class="relative z-10 p-10">
        <NuxtLink to="/" class="flex items-center gap-2 group w-fit">
          <MapPin :size="18" class="text-emerald-400 group-hover:scale-110 transition-transform" />
          <span class="text-white text-lg font-bold tracking-tight">GhidCult</span>
        </NuxtLink>
      </div>

      <!-- Testimonial / Quote -->
      <div class="relative z-10 p-10 pb-14">
        <p class="text-[11px] tracking-[0.2em] uppercase text-emerald-400 font-semibold mb-3">
          Iași, Romania
        </p>
        <blockquote class="text-2xl lg:text-3xl font-bold text-white leading-[1.3] max-w-[420px] tracking-tight">
          "Every city rewards the visitor who takes the time to understand it."
        </blockquote>
        <p class="text-xs text-slate-400 mt-4 font-mono">— Adrian Ilade</p>
      </div>
    </div>

    <!-- Auth Form -->
    <div class="flex flex-col min-h-screen bg-[#030f0e] border-l border-white/10">

      <!-- Mobile Header Logo -->
      <div class="md:hidden p-6 border-b border-white/10 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <MapPin :size="18" class="text-emerald-400" />
          <span class="text-white text-base font-bold tracking-tight">GhidCult</span>
        </NuxtLink>
      </div>

      <div class="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-14 py-12">

        <!-- Mode Switcher Tab -->
        <div class="flex border border-white/10 rounded-xl p-1 bg-neutral-900/60 mb-8">
          <button
            type="button"
            @click="switchMode('login')"
            :class="[
              'flex-1 py-2.5 text-xs font-semibold tracking-wider uppercase rounded-lg transition-all duration-200',
              mode === 'login'
                ? 'bg-white text-neutral-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            ]"
          >
            Sign in
          </button>
          <button
            type="button"
            @click="switchMode('register')"
            :class="[
              'flex-1 py-2.5 text-xs font-semibold tracking-wider uppercase rounded-lg transition-all duration-200',
              mode === 'register'
                ? 'bg-white text-neutral-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            ]"
          >
            Register
          </button>
        </div>

        <div class="mb-8">
          <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {{ mode === 'login' ? 'Welcome back.' : 'Create an account.' }}
          </h1>
          <p class="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            {{ mode === 'login'
              ? 'Sign in to manage your bookings and saved tours.'
              : 'Join GhidCult to book tours and track your adventures.' }}
          </p>
        </div>

        <!-- Credentials Form -->
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">

          <!-- Full Name (Register Only) -->
          <div v-if="mode === 'register'" class="flex flex-col gap-1.5">
            <label class="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
              Full name
            </label>
            <input
              v-model="name"
              type="text"
              placeholder="Alexandru Popescu"
              required
              class="w-full bg-neutral-900/60 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 px-4 py-3.5 outline-none focus:border-emerald-400 transition-colors"
            />
          </div>

          <!-- Email Field -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
              Email address
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="your@email.com"
              required
              class="w-full bg-neutral-900/60 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 px-4 py-3.5 outline-none focus:border-emerald-400 transition-colors"
            />
          </div>

          <!-- Password Field -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
              Password
            </label>
            <div class="relative flex items-center bg-neutral-900/60 border border-white/10 rounded-xl focus-within:border-emerald-400 transition-colors">
              <input
                v-model="password"
                :type="showPass ? 'text' : 'password'"
                placeholder="••••••••••"
                required
                class="w-full bg-transparent text-sm text-white placeholder:text-slate-600 px-4 py-3.5 outline-none"
              />
              <button
                type="button"
                @click="showPass = !showPass"
                class="px-4 text-slate-500 hover:text-white transition-colors shrink-0"
                aria-label="Toggle password visibility"
              >
                <EyeOff v-if="showPass" :size="16" />
                <Eye v-else :size="16" />
              </button>
            </div>
          </div>

          <!-- Confirm Password Field (Register Only) -->
          <div v-if="mode === 'register'" class="flex flex-col gap-1.5">
            <label class="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
              Confirm password
            </label>
            <div class="relative flex items-center bg-neutral-900/60 border border-white/10 rounded-xl focus-within:border-emerald-400 transition-colors">
              <input
                v-model="confirm"
                :type="showConfirm ? 'text' : 'password'"
                placeholder="••••••••••"
                required
                class="w-full bg-transparent text-sm text-white placeholder:text-slate-600 px-4 py-3.5 outline-none"
              />
              <button
                type="button"
                @click="showConfirm = !showConfirm"
                class="px-4 text-slate-500 hover:text-white transition-colors shrink-0"
                aria-label="Toggle confirm password visibility"
              >
                <EyeOff v-if="showConfirm" :size="16" />
                <Eye v-else :size="16" />
              </button>
            </div>
          </div>

          <!-- Forgot Password -->
          <div v-if="mode === 'login'" class="flex justify-end">
            <a href="#" class="text-xs text-slate-400 hover:text-emerald-400 transition-colors">
              Forgot password?
            </a>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="mt-3 w-full flex items-center justify-center gap-2 bg-white hover:bg-neutral-100 text-neutral-950 text-sm font-bold py-3.5 rounded-full transition-all duration-200 shadow-xl hover:scale-[1.01] active:scale-98"
          >
            <span>{{ mode === 'login' ? 'Sign in' : 'Create account' }}</span>
            <ArrowRight :size="15" />
          </button>
        </form>

        <!-- Divider -->
        <div class="flex items-center gap-4 my-6">
          <div class="flex-1 h-px bg-white/10" />
          <span class="text-xs text-slate-500 font-mono">or</span>
          <div class="flex-1 h-px bg-white/10" />
        </div>

        <!-- Google OAuth Provider -->
        <div>
          <button
            type="button"
            class="w-full flex items-center justify-center gap-3 border border-white/10 hover:border-white/25 bg-neutral-900/40 hover:bg-neutral-900/80 text-slate-300 hover:text-white text-xs font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-sm"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <!-- Mode Toggle Text -->
        <p class="text-center text-xs text-slate-400 mt-6">
          {{ mode === 'login' ? "Don't have an account? " : "Already have an account? " }}
          <button
            type="button"
            @click="switchMode(mode === 'login' ? 'register' : 'login')"
            class="text-emerald-400 hover:text-emerald-300 underline font-semibold transition-colors ml-1"
          >
            {{ mode === 'login' ? 'Register' : 'Sign in' }}
          </button>
        </p>
      </div>

      <!-- Bottom Legal Links -->
      <div class="px-8 sm:px-12 md:px-14 py-6 border-t border-white/10 flex items-center justify-between gap-4 text-xs text-slate-500 font-mono">
        <p>© 2026 GhidCult</p>
        <div class="flex gap-5">
          <a href="#" class="hover:text-slate-300 transition-colors">Privacy</a>
          <a href="#" class="hover:text-slate-300 transition-colors">Terms</a>
        </div>
      </div>

    </div>
  </div>
</template>
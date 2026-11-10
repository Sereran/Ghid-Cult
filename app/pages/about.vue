<script setup lang="ts">
import { computed } from 'vue'

const PORTRAIT = "/images/portrait.jpeg"
const PORTRAIT_2 = "/images/portrait_2.jpeg"
const CITY_BG = "/images/background-image.jpeg"

const { t, tm, rt } = useI18n()

useHead({
  title: computed(() => t('aboutPage.metaTitle'))
})

const credentials = computed(() => {
  const raw = tm('aboutPage.credentials') as string[]
  return raw.map(item => rt(item))
})

const educationItems = computed(() => {
  const raw = tm('aboutPage.education.items') as Array<{ year: string; detail: string }>
  return raw.map(item => ({
    year: rt(item.year),
    detail: rt(item.detail)
  }))
})
</script>

<template>
  <div class="pt-[72px] min-h-screen text-slate-100 selection:bg-emerald-500 selection:text-white">

    <section class="grid grid-cols-1 md:grid-cols-2 min-h-[90vh]">
      <!-- Portrait Photo -->
      <div class="relative overflow-hidden bg-[#030f0e] min-h-[400px] md:min-h-0">
        <img
          :src="PORTRAIT"
          alt="Adrian Ilade"
          class="absolute inset-0 w-full h-full object-cover object-top opacity-80"
          @error="(e: any) => e.target.style.display = 'none'"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-transparent to-[#030f0e] hidden md:block" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#030f0e] to-transparent md:hidden" />
      </div>

      <!-- Intro Content -->
      <div class="flex flex-col justify-center px-8 sm:px-12 md:px-16 py-20 relative bg-[#030f0e]">
        <div class="absolute left-0 top-[20%] bottom-[20%] w-px bg-white/10 hidden md:block" />

        <p class="text-[11px] tracking-[0.25em] uppercase text-emerald-400 font-semibold mb-6 font-mono">
          {{ $t('aboutPage.tagline') }}
        </p>

        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[0.95] mb-8 tracking-tight">
          {{ $t('aboutPage.name.first') }}<br />{{ $t('aboutPage.name.last') }}
        </h1>

        <p class="text-base sm:text-lg text-slate-300 leading-[1.8] max-w-[480px] mb-10 font-light">
          {{ $t('aboutPage.intro') }}
        </p>

        <!-- Credentials -->
        <div class="flex flex-col gap-3">
          <div 
            v-for="(c, idx) in credentials" 
            :key="idx" 
            class="flex items-center gap-3 text-xs text-slate-400 font-mono"
          >
            <div class="w-4 h-px bg-emerald-400/60 shrink-0" />
            <span>{{ c }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Quote -->
    <!-- <section class="relative py-28 overflow-hidden border-y border-white/10">
      <img :src="CITY_BG" alt="Iași City Background" class="absolute inset-0 w-full h-full object-cover opacity-10" />
      <div class="absolute inset-0 bg-[#030f0e]/85" />
      <div class="relative max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16">
        <div class="max-w-[900px] mx-auto text-center">
          <blockquote class="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-[1.3] tracking-tight italic">
            "{{ $t('aboutPage.quote') }}"
          </blockquote>
          <div class="mt-10 flex items-center justify-center gap-4">
            <div class="w-8 h-px bg-white/30" />
            <span class="text-xs text-slate-400 font-mono">{{ $t('aboutPage.quoteAuthor') }}</span>
            <div class="w-8 h-px bg-white/30" />
          </div>
        </div>
      </div>
    </section> -->

    <!-- Bio and Photo -->
    <section class="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 py-24 grid grid-cols-1 md:grid-cols-[1fr_400px] gap-16 lg:gap-20 items-start">
      <!-- Bio and Education -->
      <div class="flex flex-col gap-10">
        <!-- <div>
          <p class="text-[11px] tracking-[0.2em] uppercase text-emerald-400 font-semibold mb-5 font-mono">
            {{ $t('aboutPage.background.tagline') }}
          </p>
          <p class="text-sm sm:text-base text-slate-300 leading-[1.9] mb-6 font-light">
            {{ $t('aboutPage.background.paragraph1') }}
          </p>
          <p class="text-sm sm:text-base text-slate-300 leading-[1.9] font-light">
            {{ $t('aboutPage.background.paragraph2') }}
          </p>
        </div> -->

        <div class="border-t border-white/10 pt-8">
          <p class="text-[11px] tracking-[0.2em] uppercase text-emerald-400 font-semibold mb-5 font-mono">
            {{ $t('aboutPage.education.tagline') }}
          </p>
          <ul class="flex flex-col gap-4">
            <li 
              v-for="(edu, idx) in educationItems" 
              :key="idx" 
              class="flex items-start gap-6 text-xs sm:text-sm"
            >
              <span class="text-slate-500 font-mono shrink-0 w-[90px]">{{ edu.year }}</span>
              <span class="text-slate-300 font-light">{{ edu.detail }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Photo -->
      <div class="flex flex-col gap-6 md:sticky md:top-[92px]">
        <div class="relative overflow-hidden aspect-[3/4] rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl">
          <img 
            :src="PORTRAIT_2" 
            alt="Adrian in the field" 
            class="w-full h-full object-cover opacity-80" 
            @error="(e: any) => e.target.style.display = 'none'"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-[#030f0e]/60 to-transparent" />
        </div>
      </div>
    </section>

  </div>
</template>
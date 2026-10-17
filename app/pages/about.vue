<script setup lang="ts">
import { 
  ArrowRight, 
  BookOpen, 
  Globe, 
  Users, 
  Award 
} from '@lucide/vue'

const PORTRAIT = "https://images.unsplash.com/photo-1698270949479-5797ceee3efe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80"
const PORTRAIT_2 = "https://images.unsplash.com/photo-1582222186592-fb6306eab9b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=700&q=80"
const CITY_BG = "https://images.unsplash.com/photo-1578469645742-46cae010e5d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1600&q=80"

const stats = [
  { value: "14", label: "Years guiding" },
  { value: "3,800+", label: "Tours led" },
  { value: "4", label: "Languages spoken" },
  { value: "22", label: "Countries visited" },
]

const values = [
  {
    icon: BookOpen,
    title: "Depth over breadth",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Every detail has a story worth telling.",
  },
  {
    icon: Globe,
    title: "Context, always",
    body: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. History lives in the street names.",
  },
  {
    icon: Users,
    title: "Small groups, real connection",
    body: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. A maximum of twelve is a minimum of intimacy.",
  },
]

const timeline = [
  { year: "1985", label: "Born in Iași", note: "Third generation Iași native, grew up in the shadow of the Palace of Culture." },
  { year: "2003", label: "Faculty of History", note: "Studied at Alexandru Ioan Cuza University. Specialised in Moldavian medieval history." },
  { year: "2009", label: "First official tour", note: "Led a group of twelve French tourists through the old city. Realised this was the work." },
  { year: "2014", label: "GhidCult founded", note: "Turned a solo practice into a curated guide service rooted in Iași's cultural heritage." },
  { year: "2019", label: "Award for Cultural Tourism", note: "Recognised by the Romanian National Tourism Authority for excellence in heritage interpretation." },
  { year: "2024", label: "Today", note: "Still leading tours. Still learning something new about this city every week." },
]

useHead({
  title: 'About the Guide | GhidCult'
})
</script>

<template>
  <div class="pt-[72px] min-h-screen">

    <section class="grid grid-cols-1 md:grid-cols-2 min-h-[90vh]">
      <!-- Portrait Photo -->
      <div class="relative overflow-hidden bg-[#030f0e] min-h-[400px] md:min-h-0">
        <img
          :src="PORTRAIT"
          alt="Adrian Ilade"
          class="absolute inset-0 w-full h-full object-cover object-top opacity-80"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-transparent to-[#030f0e] hidden md:block" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#030f0e] to-transparent md:hidden" />

        <!-- Tag -->
        <div class="absolute top-8 left-8">
          <span class="text-[10px] tracking-[0.25em] uppercase border border-white/30 text-white/75 backdrop-blur-md bg-black/40 px-3 py-1.5 rounded-sm">
            Lead Guide · Iași
          </span>
        </div>
      </div>

      <!-- Intro Content -->
      <div class="flex flex-col justify-center px-8 sm:px-12 md:px-16 py-20 relative bg-[#030f0e]">
        <div class="absolute left-0 top-[20%] bottom-[20%] w-px bg-white/10 hidden md:block" />

        <p class="text-[11px] tracking-[0.25em] uppercase text-emerald-400 font-semibold mb-6">
          About the guide
        </p>

        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[0.95] mb-8 tracking-tight">
          Adrian<br />Ilade.
        </h1>

        <p class="text-base sm:text-lg text-slate-300 leading-[1.8] max-w-[480px] mb-10">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
        </p>

        <!-- Credentials -->
        <div class="flex flex-col gap-3">
          <div 
            v-for="c in [
              'Historian, Alexandru Ioan Cuza University',
              'Certified Heritage Interpreter',
              'Member, Romanian Tour Guide Federation'
            ]" 
            :key="c" 
            class="flex items-center gap-3 text-xs text-slate-400"
          >
            <div class="w-4 h-px bg-emerald-400/60 shrink-0" />
            <span>{{ c }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Quote -->
    <section class="relative py-28 overflow-hidden">
      <img :src="CITY_BG" alt="" class="absolute inset-0 w-full h-full object-cover opacity-10" />
      <div class="absolute inset-0 bg-[#030f0e]/85" />
      <div class="relative max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16">
        <div class="max-w-[900px] mx-auto text-center">
          <p class="text-[11px] tracking-[0.25em] uppercase text-emerald-400 font-semibold mb-8">
            In his own words
          </p>
          <blockquote class="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-[1.3] tracking-tight">
            "Lorem ipsum dolor sit amet consectetur. Iași is not just where I guide — it is what I know best, and what I love most."
          </blockquote>
          <div class="mt-10 flex items-center justify-center gap-4">
            <div class="w-8 h-px bg-white/30" />
            <span class="text-xs text-slate-400">Adrian Ilade, 2024</span>
            <div class="w-8 h-px bg-white/30" />
          </div>
        </div>
      </div>
    </section>

    <!-- Bio and Photo -->
    <section class="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 py-24 grid grid-cols-1 md:grid-cols-[1fr_400px] gap-16 lg:gap-20 items-start">
      <!-- Bio and Education -->
      <div class="flex flex-col gap-10">
        <div>
          <p class="text-[11px] tracking-[0.2em] uppercase text-emerald-400 font-semibold mb-5">Background</p>
          <p class="text-sm sm:text-base text-slate-300 leading-[1.9] mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p class="text-sm sm:text-base text-slate-300 leading-[1.9]">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus.
          </p>
        </div>

        <div class="border-t border-white/10 pt-8">
          <p class="text-[11px] tracking-[0.2em] uppercase text-emerald-400 font-semibold mb-5">Education &amp; training</p>
          <ul class="flex flex-col gap-4">
            <li 
              v-for="[year, detail] in [
                ['2003–2007', 'BA History — Alexandru Ioan Cuza University, Iași'],
                ['2007–2009', 'MA Medieval Studies — University of Bucharest'],
                ['2010', 'Heritage Interpretation Certificate — ICOMOS Romania'],
                ['2015', 'Cultural Tourism Management — online, Edinburgh'],
              ]" 
              :key="year" 
              class="flex items-start gap-6 text-xs sm:text-sm"
            >
              <span class="text-slate-500 font-mono shrink-0 w-[80px]">{{ year }}</span>
              <span class="text-slate-300">{{ detail }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Photo and Recognition -->
      <div class="flex flex-col gap-6 md:sticky md:top-[92px]">
        <div class="relative overflow-hidden aspect-[3/4] rounded-2xl border border-white/10 bg-neutral-900">
          <img :src="PORTRAIT_2" alt="Adrian in the field" class="w-full h-full object-cover opacity-80" />
          <div class="absolute inset-0 bg-gradient-to-t from-[#030f0e]/60 to-transparent" />
        </div>

        <div class="border border-white/10 bg-neutral-900/60 rounded-2xl p-6 flex flex-col gap-4 shadow-lg">
          <p class="text-[10px] tracking-[0.2em] uppercase text-emerald-400 font-semibold">Recognition</p>
          <div 
            v-for="award in [
              'Romanian National Tourism Authority — Excellence Award 2019',
              'TripAdvisor Hall of Fame — 2020, 2021, 2022',
              'Best Cultural Tour, Iași Tourism Awards 2023',
            ]" 
            :key="award" 
            class="flex items-start gap-3"
          >
            <Award :size="15" class="text-emerald-400 shrink-0 mt-0.5" />
            <p class="text-xs text-slate-300 leading-relaxed">{{ award }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <div class="border-y border-white/10 bg-neutral-950/40">
      <div class="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16">
        <div class="grid grid-cols-2 md:grid-cols-4">
          <div
            v-for="(s, i) in stats"
            :key="s.label"
            :class="[
              'py-12 px-6 sm:px-8 flex flex-col gap-2',
              i < stats.length - 1 ? 'border-b md:border-b-0 md:border-r border-white/10' : ''
            ]"
          >
            <p class="text-4xl sm:text-5xl font-bold font-mono text-white leading-none">{{ s.value }}</p>
            <p class="text-xs text-slate-400 uppercase tracking-widest mt-1">{{ s.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Values and Approach -->
    <section class="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 py-24">
      <div class="mb-14">
        <p class="text-[11px] tracking-[0.2em] uppercase text-emerald-400 font-semibold mb-3">Philosophy</p>
        <h2 class="text-3xl sm:text-4xl font-bold text-white tracking-tight">How I guide</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 border border-white/10 rounded-2xl overflow-hidden bg-neutral-900/40">
        <div 
          v-for="(v, i) in values" 
          :key="v.title" 
          :class="[
            'p-8 sm:p-10 flex flex-col gap-6',
            i < values.length - 1 ? 'border-b md:border-b-0 md:border-r border-white/10' : ''
          ]"
        >
          <div class="w-10 h-10 rounded-xl border border-white/20 bg-white/5 flex items-center justify-center shrink-0">
            <component :is="v.icon" :size="18" class="text-emerald-400" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-white mb-3">{{ v.title }}</h3>
            <p class="text-xs sm:text-sm text-slate-400 leading-[1.85]">{{ v.body }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline -->
    <section class="border-t border-white/10">
      <div class="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 py-24">
        <div class="mb-14">
          <p class="text-[11px] tracking-[0.2em] uppercase text-emerald-400 font-semibold mb-3">Journey</p>
          <h2 class="text-3xl sm:text-4xl font-bold text-white tracking-tight">How I got here</h2>
        </div>

        <div class="relative">
          <div class="absolute left-[72px] top-0 bottom-0 w-px bg-white/10 hidden md:block" />

          <div class="flex flex-col">
            <div 
              v-for="(item, i) in timeline" 
              :key="item.year" 
              class="grid grid-cols-1 md:grid-cols-[144px_1fr] group"
            >
              <div class="flex items-start gap-4 py-6 md:py-8">
                <span class="text-xs sm:text-sm font-bold font-mono text-emerald-400 md:w-[72px] md:text-right shrink-0">
                  {{ item.year }}
                </span>
                <div class="relative mt-1 shrink-0 hidden md:block">
                  <div class="w-2.5 h-2.5 rounded-full border border-white/40 bg-[#030f0e] group-hover:border-emerald-400 transition-colors" />
                </div>
              </div>

              <!-- Details -->
              <div :class="['py-6 md:py-8 md:pl-10', i < timeline.length - 1 ? 'border-b border-white/10' : '']">
                <p class="text-base sm:text-lg font-bold text-white mb-2">{{ item.label }}</p>
                <p class="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-[560px]">{{ item.note }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section class="border-t border-white/10">
      <div class="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 py-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
        <div>
          <p class="text-[11px] tracking-[0.2em] uppercase text-emerald-400 font-semibold mb-4">Ready to explore?</p>
          <h2 class="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
            Come walk<br />Iași with me.
          </h2>
        </div>
        <div class="flex flex-col gap-6 items-start md:items-end">
          <p class="text-sm text-slate-400 max-w-[360px] text-left md:text-right leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Every tour is a conversation about place, time, and the people who shaped it.
          </p>
          <div class="flex items-center gap-4 flex-wrap">
            <NuxtLink
              to="/tours"
              class="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              Browse tours <ArrowRight :size="14" />
            </NuxtLink>
            <NuxtLink
              to="/tours"
              class="bg-white hover:bg-neutral-100 text-neutral-900 text-sm font-bold px-8 py-3.5 rounded-full transition-all duration-200 shadow-xl hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              Book a tour
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
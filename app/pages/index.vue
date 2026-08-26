<script setup lang="ts">
import { 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  ArrowRight 
} from 'lucide-vue-next'

const destinations = [
  { 
    name: 'Iași City Tour', 
    subtitle: 'Iași · 14 tours', 
    img: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    name: 'Palatul Culturii', 
    subtitle: 'Iași · 9 tours', 
    img: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    name: 'Grădina Botanică', 
    subtitle: 'Iași · 21 tours', 
    img: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    name: 'Teatrul Național', 
    subtitle: 'Iași · 7 tours', 
    img: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80' 
  },
]

const tours = [
  { 
    slug: 'sfintii-trei-ierarhi',
    title: 'Mănăstirea Sfinții Trei Ierarhi', 
    location: 'Iași', 
    days: 4, 
    groupSize: '12 max', 
    rating: 4.9, 
    reviews: 238, 
    price: 890, 
    tag: 'Bestseller', 
    img: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    slug: 'biblioteca-mihai-eminescu',
    title: 'Biblioteca Mihai Eminescu', 
    location: 'Iași', 
    days: 1, 
    groupSize: '8 max', 
    rating: 4.8, 
    reviews: 411, 
    price: 120, 
    tag: 'Top Rated', 
    img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    slug: 'parcul-expozitiei',
    title: 'Parcul Expoziției', 
    location: 'Iași', 
    days: 2, 
    groupSize: '10 max', 
    rating: 4.7, 
    reviews: 189, 
    price: 340, 
    tag: 'Adventure', 
    img: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80' 
  },
]
</script>

<template>
  <div class="w-full">
    <section class="relative w-full h-screen min-h-[640px] flex flex-col justify-end overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=2000&q=85"
          alt="Iași cityscape backdrop"
          class="w-full h-full object-cover object-center"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[#030f0e] via-[#030f0e]/60 to-black/40"></div>
      </div>

      <!-- Main Phrase -->
      <div class="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 w-full pb-20 pt-32">
        <div class="flex flex-col items-end gap-6 max-w-3xl ml-auto text-right">
          <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight text-white tracking-tight">
            Explore the wonderful<br />city of Iași
          </h1>
          <p class="text-base sm:text-xl text-slate-200 leading-relaxed max-w-xl">
            Every journey is better with someone who knows it by heart. Browse handpicked tours across 60+ destinations.
          </p>
          <NuxtLink 
            to="/tours" 
            class="inline-block bg-white text-neutral-900 text-base sm:text-lg font-bold px-10 py-4 rounded-full hover:bg-neutral-100 transition-all duration-200 shadow-2xl hover:scale-105 active:scale-95"
          >
            Get started
          </NuxtLink>
        </div>
      </div>

    </section>

    <!-- Destinations -->
    <section class="py-24 px-6 sm:px-12 lg:px-16 max-w-[1440px] mx-auto">
      <div class="flex items-end justify-between mb-12">
        <div>
          <p class="text-xs tracking-widest uppercase text-emerald-400 mb-2 font-semibold">Popular right now</p>
          <h2 class="text-3xl sm:text-4xl font-bold text-white tracking-tight">Top destinations</h2>
        </div>
        <NuxtLink to="/tours" class="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          View all <ArrowRight :size="14" />
        </NuxtLink>
      </div>

      <!-- 4-Column Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <NuxtLink
          v-for="dest in destinations"
          :key="dest.name"
          to="/tours"
          class="group relative overflow-hidden h-96 rounded-2xl block border border-white/10 bg-neutral-900 shadow-lg"
        >
          <img
            :src="dest.img"
            :alt="dest.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75 group-hover:opacity-95"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-[#030f0e] via-transparent to-transparent"></div>
          <div class="absolute bottom-0 inset-x-0 p-5 flex gap-3 items-end">
            <div class="bg-emerald-400 w-1 self-stretch min-h-[32px] shrink-0 rounded-full"></div>
            <div>
              <p class="text-white font-bold text-lg leading-snug">{{ dest.name }}</p>
              <p class="text-slate-400 text-xs mt-0.5">{{ dest.subtitle }}</p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!--Featured Tours-->
    <section class="py-24 px-6 sm:px-12 lg:px-16 max-w-[1440px] mx-auto border-t border-white/10">
      <div class="flex items-end justify-between mb-12">
        <div>
          <p class="text-xs tracking-widest uppercase text-emerald-400 mb-2 font-semibold">Handpicked</p>
          <h2 class="text-3xl sm:text-4xl font-bold text-white tracking-tight">Featured tours</h2>
        </div>
        <NuxtLink to="/tours" class="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          View all <ArrowRight :size="14" />
        </NuxtLink>
      </div>

      <!-- 3-Column Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NuxtLink
          v-for="tour in tours"
          :key="tour.title"
          to="/tour-details"
          class="group relative overflow-hidden bg-neutral-900/60 rounded-2xl block border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl"
        >
          <div class="h-64 overflow-hidden relative">
            <img :src="tour.img" :alt="tour.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
            <div class="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent"></div>
          </div>
          
          <div class="absolute top-4 left-4">
            <span class="text-[10px] font-semibold tracking-widest uppercase border border-white/30 backdrop-blur-md bg-black/50 text-white px-2.5 py-1 rounded-md">
              {{ tour.tag }}
            </span>
          </div>

          <div class="p-6">
            <h3 class="text-white text-lg font-bold leading-snug mb-3 group-hover:text-emerald-400 transition-colors">
              {{ tour.title }}
            </h3>
            
            <div class="flex items-center gap-4 text-slate-400 text-xs mb-5">
              <span class="flex items-center gap-1"><MapPin :size="12" />{{ tour.location }}</span>
              <span class="flex items-center gap-1"><Clock :size="12" />{{ tour.days }}d</span>
              <span class="flex items-center gap-1"><Users :size="12" />{{ tour.groupSize }}</span>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-white/5">
              <span class="flex items-center gap-1 text-slate-300 text-xs font-semibold">
                <Star :size="12" class="fill-amber-400 text-amber-400" /> {{ tour.rating }} ({{ tour.reviews }})
              </span>
              <span class="text-white font-bold text-base font-mono">from ${{ tour.price }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
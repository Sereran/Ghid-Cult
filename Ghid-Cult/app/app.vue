<script setup>
import { ref } from 'vue'

const currentLang = ref('ro') // Default language is Romanian

const content = {
  ro: {
    status: 'În construcție',
    title: 'Ghid Cult',
    description: 'Lucrăm în prezent la site-ul web. Vă rugăm să reveniți mai târziu pentru actualizări și conținut nou!',
    followUs: 'Între timp, ne puteți urmări pe rețelele sociale pentru cele mai recente știri și actualizări.'
  },
  en: {
    status: 'Under Construction',
    title: 'Ghid Cult',
    description: 'We are currently working on the website. Please check back later for updates and new content!',
    followUs: 'Meanwhile, you can follow us on social media for the latest news and updates.'
  }
}
</script>

<template>
  <div class="relative min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 overflow-hidden">

    <!-- Language Switcher -->
    <header class="absolute top-6 right-6 z-20">
      <div class="inline-flex p-1 bg-slate-900/80 border border-slate-800 backdrop-blur-md rounded-xl shadow-lg">
        <button
          type="button"
          @click="currentLang = 'ro'"
          :class="[
            'px-3 py-1 text-xs font-semibold rounded-lg transition-all duration-200',
            currentLang === 'ro'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          ]"
        >
          RO
        </button>
        <button
          type="button"
          @click="currentLang = 'en'"
          :class="[
            'px-3 py-1 text-xs font-semibold rounded-lg transition-all duration-200',
            currentLang === 'en'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          ]"
        >
          EN
        </button>
      </div>
    </header>

    <!-- Ambient background -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="relative max-w-lg w-full text-center bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
      
      <!-- Status Badge -->
      <span class="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-semibold tracking-wide text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full shadow-inner">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
        🚧 {{ content[currentLang].status }}
      </span>

      <!-- Title & Copy -->
      <div class="space-y-3">
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Ghid Cult
        </h1>
        <p class="text-slate-400 text-sm sm:text-base leading-relaxed">
          {{ content[currentLang].description }}
        </p>
        <p class="text-xs sm:text-sm text-slate-500">
          {{ content[currentLang].followUs }}
        </p>
      </div>

      <!-- Social Media Buttons -->
      <div class="flex items-center justify-center gap-3.5 pt-2">
        <!-- TikTok -->
        <a 
          href="https://www.tiktok.com/@adrianilade" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="TikTok"
          class="p-3 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 hover:border-slate-600 rounded-2xl transition-all duration-200 hover:-translate-y-1 shadow-md hover:shadow-slate-800/50"
        >
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.89 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.91a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.05a8.28 8.28 0 0 0 5.06 1.7V7.3a4.87 4.87 0 0 1-1.3-.61z"/>
          </svg>
        </a>

        <!-- LinkedIn -->
        <a 
          href="https://www.linkedin.com/in/ghid-cult-0b746b42b/" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          class="p-3 bg-slate-800/80 hover:bg-sky-950/40 text-slate-300 hover:text-[#0A66C2] border border-slate-700/60 hover:border-sky-500/40 rounded-2xl transition-all duration-200 hover:-translate-y-1 shadow-md"
        >
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.778-.773 1.778-1.729V1.73C24 .774 23.205 0 22.225 0z"/>
          </svg>
        </a>

        <!-- Facebook -->
        <a 
          href="https://www.facebook.com/profile.php?id=61593669897171" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Facebook"
          class="p-3 bg-slate-800/80 hover:bg-blue-950/40 text-slate-300 hover:text-blue-400 border border-slate-700/60 hover:border-blue-500/40 rounded-2xl transition-all duration-200 hover:-translate-y-1 shadow-md"
        >
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>

        <!-- YouTube -->
        <a 
          href="https://www.youtube.com/@adrianilade" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="YouTube"
          class="p-3 bg-slate-800/80 hover:bg-red-950/40 text-slate-300 hover:text-red-400 border border-slate-700/60 hover:border-red-500/40 rounded-2xl transition-all duration-200 hover:-translate-y-1 shadow-md"
        >
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </a>
      </div>

    </div>
  </div>
</template>
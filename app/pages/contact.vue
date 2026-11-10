<script setup lang="ts">
import { ref, computed } from 'vue'
import { Phone, Mail, ArrowUpRight, MapPin, Check, Copy } from '@lucide/vue'

const PORTRAIT = "/images/portrait.jpeg"
const { t } = useI18n()

useHead({
  title: computed(() => t('contactPage.metaTitle'))
})

const methods = computed(() => [
  {
    icon: Phone,
    label: t('contactPage.methods.phoneLabel'),
    value: "+40 741 658 289",
    note: t('contactPage.methods.phoneNote'),
    href: "tel:+40741658289",
    badge: "WhatsApp",
  },
  {
    icon: Mail,
    label: t('contactPage.methods.emailLabel'),
    value: "adrian.ilade@ghidcult.com",
    note: t('contactPage.methods.emailNote'),
    href: "mailto:adrian.ilade@ghidcult.com",
    badge: null,
  },
])

const copiedValue = ref<string | null>(null)

const copyToClipboard = async (text: string, e: Event) => {
  e.preventDefault() // Prevents opening tel or mailto links when copying
  e.stopPropagation()
  try {
    await navigator.clipboard.writeText(text)
    copiedValue.value = text
    setTimeout(() => {
      copiedValue.value = null
    }, 2000)
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}
</script>

<template>
  <div class="pt-[72px] min-h-screen flex flex-col justify-between text-slate-100 selection:bg-emerald-500 selection:text-white">

    <div class="grid grid-cols-1 md:grid-cols-2 flex-1">

      <!-- Portrait Side -->
      <div class="relative overflow-hidden min-h-[420px] md:min-h-0 bg-[#030f0e]">
        <img
          :src="PORTRAIT"
          alt="Adrian Ilade"
          class="absolute inset-0 w-full h-full object-cover object-top opacity-50"
          @error="(e: any) => e.target.style.display = 'none'"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[#030f0e] via-transparent to-transparent" />
        <div class="absolute inset-0 bg-gradient-to-r from-transparent to-[#030f0e] hidden md:block" />

        <!-- Nameplate -->
        <div class="absolute bottom-10 left-8 sm:left-12 md:left-16 right-8">
          <p class="text-[11px] tracking-[0.25em] uppercase text-emerald-400 font-semibold mb-2 font-mono">
            {{ $t('contactPage.nameplate.tagline') }}
          </p>
          <p class="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight">
            {{ $t('contactPage.nameplate.firstName') }}<br />{{ $t('contactPage.nameplate.lastName') }}
          </p>
          <p class="text-xs sm:text-sm text-slate-400 mt-2 font-mono">
            {{ $t('contactPage.nameplate.role') }}
          </p>
        </div>
      </div>

      <!-- Contact Info -->
      <div class="flex flex-col justify-center px-8 sm:px-12 md:px-16 py-16 sm:py-20 relative bg-[#030f0e]">
        <div class="absolute left-0 top-[15%] bottom-[15%] w-px bg-white/10 hidden md:block" />

        <p class="text-[11px] tracking-[0.25em] uppercase text-emerald-400 font-semibold mb-5 font-mono">
          {{ $t('contactPage.hero.tagline') }}
        </p>
        <h1 class="text-5xl sm:text-6xl font-extrabold text-white leading-[0.95] mb-4 tracking-tight">
          {{ $t('contactPage.hero.title') }}
        </h1>
        <p class="text-sm sm:text-base text-slate-300 leading-relaxed max-w-[420px] mb-12 font-light">
          {{ $t('contactPage.hero.description') }}
        </p>

        <!-- Methods with Copy Action -->
        <div class="flex flex-col gap-4">
          <div
            v-for="m in methods"
            :key="m.label"
            class="group flex items-start gap-4 sm:gap-5 border border-white/10 hover:border-white/25 bg-neutral-900/50 p-5 rounded-2xl transition-all duration-200 shadow-sm relative"
          >
            <!-- Call/Email Icon -->
            <a 
              :href="m.href"
              :aria-label="m.label"
              class="w-10 h-10 border border-white/15 rounded-xl flex items-center justify-center shrink-0 group-hover:border-emerald-400/50 bg-white/5 transition-colors"
            >
              <component :is="m.icon" :size="18" class="text-slate-300 group-hover:text-emerald-400 transition-colors" />
            </a>
            
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <p class="text-[11px] tracking-[0.15em] uppercase text-slate-400 font-medium font-mono">{{ m.label }}</p>
                <span 
                  v-if="m.badge" 
                  class="text-[9px] tracking-widest uppercase border border-emerald-500/40 text-emerald-400 font-mono px-2 py-0.5 rounded-full"
                >
                  {{ m.badge }}
                </span>
              </div>

              <!-- Selectable/Copyable Text -->
              <div class="flex items-center gap-3">
                <a 
                  :href="m.href"
                  class="text-lg sm:text-xl font-bold text-white hover:text-emerald-400 font-mono transition-colors truncate select-text"
                >
                  {{ m.value }}
                </a>

                <!-- Copy Button -->
                <button
                  type="button"
                  @click="(e) => copyToClipboard(m.value, e)"
                  class="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
                  :title="copiedValue === m.value ? t('contactPage.copy.copied') : t('contactPage.copy.copyTitle')"
                >
                  <Check v-if="copiedValue === m.value" :size="14" class="text-emerald-400" />
                  <Copy v-else :size="14" />
                </button>

                <span 
                  v-if="copiedValue === m.value" 
                  class="text-[11px] font-mono text-emerald-400 font-semibold animate-pulse"
                >
                  {{ $t('contactPage.copy.copied') }}
                </span>
              </div>

              <p class="text-xs text-slate-400 mt-1 font-light">{{ m.note }}</p>
            </div>

            <!-- Direct Action Link -->
            <a 
              :href="m.href"
              :aria-label="m.label"
              class="text-slate-500 group-hover:text-white transition-colors shrink-0 mt-1"
            >
              <ArrowUpRight :size="16" />
            </a>
          </div>
        </div>

        <!-- Location Footnote -->
        <div class="flex items-start gap-3 mt-8 px-1">
          <MapPin :size="15" class="text-emerald-400 shrink-0 mt-0.5" />
          <p class="text-xs text-slate-400 leading-relaxed font-mono">
            {{ $t('contactPage.location') }}
          </p>
        </div>
      </div>

    </div>

    <!-- Socials -->
    <div class="border-t border-white/10 bg-neutral-950/40">
      <div class="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 py-12">
        <p class="text-[11px] tracking-[0.25em] uppercase text-emerald-400 font-semibold mb-6 font-mono">
          {{ $t('contactPage.socials.tagline') }}
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- LinkedIn -->
          <a
            href="https://www.linkedin.com/in/ghid-cult/"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex items-center gap-4 border border-white/10 hover:border-white/20 bg-neutral-900/40 p-4 rounded-xl transition-all duration-200"
          >
            <div class="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity shrink-0">
              <svg class="w-5 h-5 fill-current text-white group-hover:text-[#0A66C2] transition-colors" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.778-.773 1.778-1.729V1.73C24 .774 23.205 0 22.225 0z"/>
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-white text-sm font-bold group-hover:text-emerald-400 transition-colors">LinkedIn</p>
              <p class="text-slate-400 text-xs truncate font-mono">Ghid Cult</p>
            </div>
            <ArrowUpRight :size="14" class="text-slate-600 group-hover:text-white transition-colors ml-auto shrink-0" />
          </a>

          <!-- TikTok -->
          <a
            href="https://www.tiktok.com/@adrianilade"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex items-center gap-4 border border-white/10 hover:border-white/20 bg-neutral-900/40 p-4 rounded-xl transition-all duration-200"
          >
            <div class="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity shrink-0">
              <svg class="w-5 h-5 fill-current text-white group-hover:text-[#25F4EE] transition-colors" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.77 1.81-.02 3.32-1.44 3.44-3.25.07-2.18.03-4.37.04-6.55V0h-.01c-.16.02-.32.02-.48.02z"/>
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-white text-sm font-bold group-hover:text-emerald-400 transition-colors">TikTok</p>
              <p class="text-slate-400 text-xs truncate font-mono">@adrianilade</p>
            </div>
            <ArrowUpRight :size="14" class="text-slate-600 group-hover:text-white transition-colors ml-auto shrink-0" />
          </a>

          <!-- YouTube -->
          <a
            href="https://www.youtube.com/@adrianilade"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex items-center gap-4 border border-white/10 hover:border-white/20 bg-neutral-900/40 p-4 rounded-xl transition-all duration-200"
          >
            <div class="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity shrink-0">
              <svg class="w-5 h-5 fill-current text-white group-hover:text-[#FF0000] transition-colors" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-white text-sm font-bold group-hover:text-emerald-400 transition-colors">YouTube</p>
              <p class="text-slate-400 text-xs truncate font-mono">Ghid Cult</p>
            </div>
            <ArrowUpRight :size="14" class="text-slate-600 group-hover:text-white transition-colors ml-auto shrink-0" />
          </a>

          <!-- Facebook -->
          <a
            href="https://www.facebook.com/adrian.ilade"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex items-center gap-4 border border-white/10 hover:border-white/20 bg-neutral-900/40 p-4 rounded-xl transition-all duration-200"
          >
            <div class="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity shrink-0">
              <svg class="w-5 h-5 fill-current text-white group-hover:text-[#1877F2] transition-colors" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-white text-sm font-bold group-hover:text-emerald-400 transition-colors">Facebook</p>
              <p class="text-slate-400 text-xs truncate font-mono">Adrian Ilade</p>
            </div>
            <ArrowUpRight :size="14" class="text-slate-600 group-hover:text-white transition-colors ml-auto shrink-0" />
          </a>
        </div>
      </div>
    </div>

  </div>
</template>
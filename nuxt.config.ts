export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n'
  ],
  app: {
    head: {
      title: 'GhidCult | Piatra ne vorbește',
      meta: [
        {
          name: 'description',
          content: 'Promovez patrimoniul cultural al Iaşului prin workshop-uri inspiraționale şi călătorii de descoperire.'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico?v=3' },
        { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico?v=3' }
      ]
    }
  },
  i18n: {
    baseUrl: 'https://ghidcult.com',
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'ro', iso: 'ro-RO', file: 'ro.json', name: 'Română' },
    ],
    defaultLocale: 'ro',
    langDir: 'locales',
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
  }
})

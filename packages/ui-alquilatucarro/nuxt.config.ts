// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // Auto-imports desde logic package
  imports: {
    dirs: [
      '../logic/src/composables',  // Only scan composables dir
      '../logic/src/stores',        // Only scan stores dir
      // Don't scan utils/** - import types explicitly instead
    ]
  },

  typescript: {
    strict: true,
    typeCheck: false
  },

  // Configuración específica de alquilatucarro
  app: {
    head: {
      title: 'Alquilatucarro - Alquiler de vehículos',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  }
})

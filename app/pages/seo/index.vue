<script setup lang="ts">
definePageMeta({
  layout: 'seo',
  middleware: ['seo-auth']
})

// Update state
const isUpdating = ref(false)
const updateResult = ref<{
  success: boolean
  message: string
  updated: string[]
  errors: string[]
} | null>(null)

// Update data from APIs
async function handleUpdate() {
  isUpdating.value = true
  updateResult.value = null

  try {
    const response = await $fetch('/api/seo/update', {
      method: 'POST',
      body: { services: ['moz', 'gsc'] }
    })

    updateResult.value = {
      success: response.success,
      message: response.success
        ? `Datos actualizados: ${response.updated.join(', ')}`
        : 'Error al actualizar',
      updated: response.updated,
      errors: response.errors
    }

    // Refresh metrics after update
    if (response.success && response.data) {
      if (response.data.moz) {
        metrics.value.current.domainAuthority = response.data.moz.domainAuthority ?? metrics.value.current.domainAuthority
        metrics.value.current.pageAuthority = response.data.moz.pageAuthority ?? metrics.value.current.pageAuthority
        metrics.value.current.backlinksTotal = response.data.moz.backlinksTotal ?? metrics.value.current.backlinksTotal
        metrics.value.current.linkingDomains = response.data.moz.linkingDomains ?? metrics.value.current.linkingDomains
      }
      metrics.value.current.lastUpdated = new Date().toISOString().split('T')[0]
    }

    // Auto-hide success message after 5 seconds
    if (response.success) {
      setTimeout(() => {
        updateResult.value = null
      }, 5000)
    }
  } catch (error: any) {
    updateResult.value = {
      success: false,
      message: error.message || 'Error de conexión',
      updated: [],
      errors: [error.message]
    }
  } finally {
    isUpdating.value = false
  }
}

// TODO: Load from JSON files via API
const metrics = ref({
  current: {
    domainAuthority: 53,
    pageAuthority: 39,
    backlinksTotal: 6994,
    linkingDomains: 433,
    keywordsTop20: 0,
    internalLinks: 33,
    lastUpdated: '2026-01-17'
  },
  goals: {
    '6months': {
      da: 58,
      backlinks: 10000,
      domains: 600,
      keywords: 10,
      internalLinks: 333
    }
  }
})

// Calculate progress percentages
const daProgress = computed(() => {
  const current = metrics.value.current.domainAuthority
  const goal = metrics.value.goals['6months'].da
  const start = 53 // baseline
  return Math.round(((current - start) / (goal - start)) * 100)
})

const backlinksProgress = computed(() => {
  const current = metrics.value.current.backlinksTotal
  const goal = metrics.value.goals['6months'].backlinks
  return Math.round((current / goal) * 100)
})

const domainsProgress = computed(() => {
  const current = metrics.value.current.linkingDomains
  const goal = metrics.value.goals['6months'].domains
  return Math.round((current / goal) * 100)
})

const keywordsProgress = computed(() => {
  const current = metrics.value.current.keywordsTop20
  const goal = metrics.value.goals['6months'].keywords
  return Math.round((current / goal) * 100)
})

const internalLinksProgress = computed(() => {
  const current = metrics.value.current.internalLinks
  const goal = metrics.value.goals['6months'].internalLinks
  return Math.round((current / goal) * 100)
})

// Alerts
const alerts = computed(() => {
  const list = []

  if (metrics.value.current.keywordsTop20 === 0) {
    list.push({
      type: 'warning',
      icon: 'i-heroicons-exclamation-triangle',
      message: '0 keywords en Top 20 - Prioridad alta: mejorar posiciones'
    })
  }

  if (metrics.value.current.internalLinks < 100) {
    list.push({
      type: 'info',
      icon: 'i-heroicons-information-circle',
      message: `Solo ${metrics.value.current.internalLinks} internal links - Meta: 333+`
    })
  }

  return list
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Dashboard SEO</h1>
        <p class="text-gray-400 text-sm mt-1">
          Última actualización: {{ metrics.current.lastUpdated }}
        </p>
      </div>
      <button
        class="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        :disabled="isUpdating"
        @click="handleUpdate"
      >
        <UIcon
          :name="isUpdating ? 'i-heroicons-arrow-path' : 'i-heroicons-arrow-path'"
          class="w-4 h-4"
          :class="{ 'animate-spin': isUpdating }"
        />
        {{ isUpdating ? 'Actualizando...' : 'Actualizar datos' }}
      </button>
    </div>

    <!-- Update Result Toast -->
    <div
      v-if="updateResult"
      class="fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg"
      :class="updateResult.success ? 'bg-green-900 border border-green-700' : 'bg-red-900 border border-red-700'"
    >
      <div class="flex items-start gap-3">
        <UIcon
          :name="updateResult.success ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
          class="w-5 h-5 flex-shrink-0"
          :class="updateResult.success ? 'text-green-400' : 'text-red-400'"
        />
        <div class="flex-1">
          <p class="text-sm font-medium" :class="updateResult.success ? 'text-green-300' : 'text-red-300'">
            {{ updateResult.message }}
          </p>
          <div v-if="updateResult.errors.length > 0" class="mt-2 text-xs text-red-400">
            <p v-for="error in updateResult.errors" :key="error">{{ error }}</p>
          </div>
        </div>
        <button
          class="text-gray-400 hover:text-white"
          @click="updateResult = null"
        >
          <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Alerts -->
    <div v-if="alerts.length > 0" class="space-y-2">
      <div
        v-for="(alert, index) in alerts"
        :key="index"
        class="flex items-center gap-3 p-4 rounded-lg"
        :class="{
          'bg-yellow-900/30 border border-yellow-700': alert.type === 'warning',
          'bg-blue-900/30 border border-blue-700': alert.type === 'info'
        }"
      >
        <UIcon
          :name="alert.icon"
          class="w-5 h-5"
          :class="{
            'text-yellow-400': alert.type === 'warning',
            'text-blue-400': alert.type === 'info'
          }"
        />
        <span
          class="text-sm"
          :class="{
            'text-yellow-300': alert.type === 'warning',
            'text-blue-300': alert.type === 'info'
          }"
        >
          {{ alert.message }}
        </span>
      </div>
    </div>

    <!-- KPIs Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Domain Authority -->
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-400 text-sm font-medium">Domain Authority</h3>
          <span class="text-xs text-gray-500">Meta: 58</span>
        </div>
        <div class="flex items-baseline gap-2 mb-4">
          <span class="text-4xl font-bold text-white">{{ metrics.current.domainAuthority }}</span>
          <span class="text-gray-500">/ 58</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2">
          <div
            class="bg-red-600 h-2 rounded-full transition-all"
            :style="{ width: `${Math.min(daProgress, 100)}%` }"
          />
        </div>
        <p class="text-xs text-gray-500 mt-2">{{ daProgress }}% hacia la meta</p>
      </div>

      <!-- Backlinks -->
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-400 text-sm font-medium">Backlinks Totales</h3>
          <span class="text-xs text-gray-500">Meta: 10,000</span>
        </div>
        <div class="flex items-baseline gap-2 mb-4">
          <span class="text-4xl font-bold text-white">{{ metrics.current.backlinksTotal.toLocaleString() }}</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2">
          <div
            class="bg-green-600 h-2 rounded-full transition-all"
            :style="{ width: `${Math.min(backlinksProgress, 100)}%` }"
          />
        </div>
        <p class="text-xs text-gray-500 mt-2">{{ backlinksProgress }}% hacia la meta</p>
      </div>

      <!-- Linking Domains -->
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-400 text-sm font-medium">Linking Domains</h3>
          <span class="text-xs text-gray-500">Meta: 600</span>
        </div>
        <div class="flex items-baseline gap-2 mb-4">
          <span class="text-4xl font-bold text-white">{{ metrics.current.linkingDomains }}</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all"
            :style="{ width: `${Math.min(domainsProgress, 100)}%` }"
          />
        </div>
        <p class="text-xs text-gray-500 mt-2">{{ domainsProgress }}% hacia la meta</p>
      </div>

      <!-- Keywords Top 20 -->
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-400 text-sm font-medium">Keywords Top 20</h3>
          <span class="text-xs text-gray-500">Meta: 10</span>
        </div>
        <div class="flex items-baseline gap-2 mb-4">
          <span class="text-4xl font-bold text-yellow-400">{{ metrics.current.keywordsTop20 }}</span>
          <span class="text-gray-500">/ 10</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2">
          <div
            class="bg-yellow-600 h-2 rounded-full transition-all"
            :style="{ width: `${Math.min(keywordsProgress, 100)}%` }"
          />
        </div>
        <p class="text-xs text-yellow-500 mt-2">Prioridad alta</p>
      </div>

      <!-- Internal Links -->
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-400 text-sm font-medium">Internal Links</h3>
          <span class="text-xs text-gray-500">Meta: 333</span>
        </div>
        <div class="flex items-baseline gap-2 mb-4">
          <span class="text-4xl font-bold text-white">{{ metrics.current.internalLinks }}</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2">
          <div
            class="bg-purple-600 h-2 rounded-full transition-all"
            :style="{ width: `${Math.min(internalLinksProgress, 100)}%` }"
          />
        </div>
        <p class="text-xs text-gray-500 mt-2">{{ internalLinksProgress }}% hacia la meta</p>
      </div>

      <!-- Page Authority -->
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-400 text-sm font-medium">Page Authority</h3>
          <span class="text-xs text-gray-500">Homepage</span>
        </div>
        <div class="flex items-baseline gap-2 mb-4">
          <span class="text-4xl font-bold text-white">{{ metrics.current.pageAuthority }}</span>
        </div>
        <p class="text-xs text-gray-500 mt-2">Autoridad de la página principal</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 class="text-lg font-semibold text-white mb-4">Acciones Rápidas</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NuxtLink
          to="/seo/tareas"
          class="flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          <UIcon name="i-heroicons-plus-circle" class="w-8 h-8 text-green-400 mb-2" />
          <span class="text-sm text-white">Nueva Tarea</span>
        </NuxtLink>
        <NuxtLink
          to="/seo/backlinks"
          class="flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          <UIcon name="i-heroicons-link" class="w-8 h-8 text-blue-400 mb-2" />
          <span class="text-sm text-white">Ver Backlinks</span>
        </NuxtLink>
        <NuxtLink
          to="/seo/keywords"
          class="flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          <UIcon name="i-heroicons-magnifying-glass" class="w-8 h-8 text-yellow-400 mb-2" />
          <span class="text-sm text-white">Keywords</span>
        </NuxtLink>
        <NuxtLink
          to="/seo/herramientas"
          class="flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          <UIcon name="i-heroicons-wrench-screwdriver" class="w-8 h-8 text-purple-400 mb-2" />
          <span class="text-sm text-white">Herramientas</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Recent Activity (placeholder) -->
    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 class="text-lg font-semibold text-white mb-4">Actividad Reciente</h2>
      <div class="text-center py-8 text-gray-500">
        <UIcon name="i-heroicons-clock" class="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No hay actividad registrada todavía</p>
        <p class="text-sm mt-1">Comienza agregando tareas en el módulo de Tareas</p>
      </div>
    </div>
  </div>
</template>

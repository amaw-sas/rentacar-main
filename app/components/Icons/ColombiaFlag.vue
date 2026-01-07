<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :class="cls"
    viewBox="0 0 300 200"
    aria-label="Bandera de Colombia"
    role="img"
  >
    <!-- Amarillo (50%) -->
    <rect x="0" y="0" width="300" height="100" fill="#FCD116"/>
    <!-- Azul (25%) -->
    <rect x="0" y="100" width="300" height="50" fill="#003893"/>
    <!-- Rojo (25%) -->
    <rect x="0" y="150" width="300" height="50" fill="#CE1126"/>
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{ cls?: string }>()
const cls = props.cls ?? ''
</script>

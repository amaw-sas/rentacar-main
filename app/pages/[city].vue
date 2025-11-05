<template>
    <div>
        <h1 class="text-white mx-auto" v-text="cityParam"></h1>
    </div>
</template>

<script setup lang="ts">
const { getCityById } = useData();
const { franchise } = useAppConfig();

const route = useRoute();
const cityParam = route.params.city;
const city = cityParam ? getCityById(cityParam as string) : undefined

useBaseSEO();

useHead({
  title: `${franchise.title} | ${city?.name}`,
  htmlAttrs: {
      lang: "es",
  },
  link: [
    {
      rel: 'canonical',
      href: `${franchise.website}/${cityParam}`
    }
  ]
})

</script>

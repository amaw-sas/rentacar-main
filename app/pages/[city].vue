<template>
  <UPage>
    <!-- Hero Section -->
    <UPageHero orientation="horizontal">
      <template #headline>
        <div class="space-x-2 text-white text-center">
          <UIcon name="ic:round-star" class="bg-white size-5"></UIcon>
          <UIcon name="ic:round-star" class="bg-white size-5"></UIcon>
          <UIcon name="ic:round-star" class="bg-white size-5"></UIcon>
          <UIcon name="ic:round-star" class="bg-white size-5"></UIcon>
          <UIcon name="ic:round-star" class="bg-white size-5"></UIcon>
          <span>4.9 reviews</span>
        </div>
      </template>
      <template #title>
        <div class="text-white text-4xl text-center">
          <div class="">
            <div class="font-bold uppercase">ALQUILER</div>
            <div>DE CARROS EN</div>
          </div>
          <div v-text="city.name"></div>
          <div class="italic">COLOMBIA</div>
        </div>
      </template>
      <template #body>
        <div class="text-center justify-items-center">
          <div class="mb-4 text-white text-3xl">Consulta disponibilidad y precios</div>
          <p class="text-white text-lg">
            Elige ciudades, fechas y horarios y renta un vehículo por
            días, semanas o el tiempo que necesites
          </p>
        </div>
      </template>
      <template #default>
        <!-- Buscador -->
        <ImagesFamily />
      </template>
      
    </UPageHero>

    <!-- Result Section -->

    <!-- Description Section -->
    <UPageSection
      id="descripcion"
      class="bg-white text-black"
    >
      <UPageGrid>
        <UPageCard variant="ghost">
          <LazyImagesCiudadesChica />
        </UPageCard>
        <UPageCard variant="ghost">
          <div class="flex flex-col gap-2 text-center font-extrabold">
            <div class="text-red-600 text-3xl">En {{ franchise.shortname }}</div>
            <div class="text-red-600 text-5xl" v-text="city?.name"></div>
            <p class="text-black text-4xl">
              la libertad <br/>
              de moverte <br/>
              a tu manera <br/>
              es realidad
            </p>
          </div>
        </UPageCard>
        <UPageCard variant="ghost">
          <p class="text-black text-center font-semibold" v-text="city?.description"></p>
        </UPageCard>
      </UPageGrid>
    </UPageSection>

     <!-- Testimonials Section -->
      <UPageSection 
      id="testimonios"
      orientation="vertical" 
      class="bg-white text-black"
      title="Lo que dicen nuestros clientes"
      :description="`Descubre por qué somos la opción preferida para alquilar carros en ${city?.name}. Nuestros clientes destacan nuestra atención, precios competitivos y la facilidad para explorar.`"
      :ui="testimoniosPageSectionUIConfig"
    >
      <template #default>
        <UPageGrid>
          <UPageCard 
            v-for="testimonio in testimonios"
            :description="testimonio.quote"
            variant="solid"
            :ui="testimonioPageCardUIConfig"
          >
            <template #title>
                <UUser 
                  size="3xl" 
                  v-bind="testimonio.user" 
                  :ui="testimonioUserUIConfig"
                  loading="lazy"
                />
            </template>
            <template #footer>
              <UIcon name="ic:round-star" class="bg-yellow-500 size-6"></UIcon>
              <UIcon name="ic:round-star" class="bg-yellow-500 size-6"></UIcon>
              <UIcon name="ic:round-star" class="bg-yellow-500 size-6"></UIcon>
              <UIcon name="ic:round-star" class="bg-yellow-500 size-6"></UIcon>
              <UIcon name="ic:round-star" class="bg-yellow-500 size-6"></UIcon>
            </template>
          </UPageCard>
        </UPageGrid>
      </template>
    </UPageSection>
  </UPage>
    
</template>

<script setup lang="ts">
import type { Testimonial } from '#imports';

const { getCityById } = useData();
const { franchise } = useAppConfig();

const route = useRoute();
const cityParam = route.params.city;
const city = cityParam ? getCityById(cityParam as string) : undefined

useBaseSEO()

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

definePageMeta({
    colorMode: 'dark',
    middleware: ['validate-city-params']
})

const testimonios: Testimonial[] | undefined = city?.testimonials;

const testimoniosPageSectionUIConfig = {
  title: 'text-black'
}

const testimonioPageCardUIConfig = {
  root: 'border-1 border-gray-100 rounded-lg bg-gray-50 shadow',
  description: 'mt-4'
}

const testimonioUserUIConfig = {
  name: 'text-black',
}

</script>

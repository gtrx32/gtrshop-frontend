<script lang="ts" setup>
type Zoom = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19;

type Coordinates = [number, number];

interface YandexMapProps {
  center: Coordinates
  zoom: Zoom
}

const props = defineProps<YandexMapProps>();

const config = useRuntimeConfig()

const mapRef = ref<HTMLDivElement | null>(null);
const panelIsOpen = ref(true);

const loadMap = () => {
  if (window.ymaps) return Promise.resolve()
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=${config.public.yandexMapsKey}`
    script.onload = () => resolve()
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const initMap = () => {
  const ymaps = window.ymaps
  ymaps.ready(() => {
    const map = new ymaps.Map(mapRef.value, {
      center: props.center,
      zoom: props.zoom,
      controls: ['zoomControl']
    })
    const placemark = new ymaps.Placemark(props.center)
    map.geoObjects.add(placemark)
  })
}

const openRoute = () => {
  const [lat, lng] = props.center
  window.open(`https://yandex.ru/maps/?rtext=~${lat},${lng}&rtt=auto`, '_blank')
}

onMounted(async () => {
  await loadMap()
  initMap()
})
</script>

<template>
  <div class="relative w-full h-150 overflow-hidden rounded-lg">
    <div ref="mapRef" class="w-full h-full"/>
    <div class="absolute inset-x-4 top-4 flex justify-end">
      <div
          :class="panelIsOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'"
          class="flex flex-col gap-3 w-80 max-w-full bg-gtr-pale/60 backdrop-blur p-4 rounded-lg shadow-lg transition-all duration-300"
      >
        <u-button
            class="absolute top-3 right-3 text-xs w-22 px-3 py-2"
            variant="soft"
            @click="panelIsOpen = false"
        >
          свернуть
        </u-button>
        <slot/>
        <u-button class="text-base self-center" variant="soft" @click="openRoute">
          Построить маршрут
        </u-button>
      </div>
      <button
          :class="panelIsOpen
        ? 'opacity-0 translate-x-10 pointer-events-none'
        : 'opacity-100 translate-x-0'"
          class="absolute right-3 top-3 w-22 px-3 py-2 text-xs cursor-pointer rounded-lg
        bg-black/70 text-white transition-all duration-300 hover:bg-black/80 active:bg-black/80 focus:outline-none"
          @click="panelIsOpen = true"
      >
        открыть
      </button>
    </div>
  </div>
</template>
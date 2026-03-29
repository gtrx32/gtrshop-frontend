<script setup lang="ts">
import type {News} from "~/types/news";

const api = useApi()
const route = useRoute()

const slug = computed(() => String(route.params.slug))

const { data } = await useAsyncData(
    () => `news:show:${slug.value}`,
    () => api<News>(`api/news/${slug.value}`),
    { watch: [slug] }
)

const news = computed(() => data.value!)

const {setBreadcrumbs} = useBreadcrumbs()

watch(
    () => news.value.title,
    (title) => setBreadcrumbs([
      {label: 'Новости', to: '/news'},
      {label: title},
    ]),
    {immediate: true}
)

useSeoMeta({
  title: () => `${news.value.title}`,
  description: () => news.value.excerpt,
})
</script>

<template>
  <heading
      :title="news.title"
      :subtitle="news.excerpt"
      breadcrumbs
  />

  <div class="space-y-4">
    <img
        v-if="news.image"
        :src="news.image"
        :alt="news.title"
        class="w-full h-[300px] lg:h-[600px] object-cover rounded-3xl"
    />

    <div v-html="news.content" />

    <div class="text-sm text-gtr-dimmed">
      {{ formatDate(news.active_from ?? news.created_at) }}
    </div>

    <u-button icon="mdi:arrow-left" to="/news">
      Назад к новостям
    </u-button>
  </div>
</template>


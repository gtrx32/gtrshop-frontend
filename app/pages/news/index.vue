<script setup lang="ts">
import {useNewsList} from "~/composables/news/useNewsList";

const {setBreadcrumbs} = useBreadcrumbs()

setBreadcrumbs([
  {label: 'Новости'},
])

const {
  news,
  pending,
  canLoadMore,
  loadMore,
  loadingMore,
} = useNewsList()
</script>

<template>
  <heading title="Новости" subtitle="Лента обновлений и анонсов" breadcrumbs />
  <div class="flex flex-col items-center gap-6 md:gap-8">
    <div class="space-y-6 md:space-y-8">
      <nuxt-link
          v-for="item in news"
          :key="item.id"
          :to="`/news/${item.slug}`"
          class="block group"
      >
        <article class="flex flex-col md:flex-row transition duration-300 hover:bg-gtr-fade/70 rounded-3xl overflow-hidden">
          <div class="shrink-0 overflow-hidden rounded-3xl">
            <img
                class="rounded-3xl h-full w-full md:w-96 lg:w-128 object-cover transition-transform duration-300 group-hover:scale-95"
                :src="item.image ?? undefined"
                alt=""
            />
          </div>
          <div class="flex-1 flex flex-col gap-2 md:gap-4 py-4 md:p-6 lg:p-8">
            <h3 class="text-2xl md:text-xl lg:text-2xl leading-tight text-gtr-base font-medium">
              {{ item.title }}
            </h3>
            <p class="text-lg md:text-base lg:text-lg leading-relaxed text-gtr-muted">
              {{ item.excerpt }}
            </p>
            <div class="mt-auto ml-auto text-sm text-gtr-dimmed">
              {{ formatDate(item.active_from ?? item.created_at) }}
            </div>
          </div>
        </article>
      </nuxt-link>
    </div>

    <u-button
        v-if="canLoadMore"
        @click="loadMore"
        :disabled="pending || loadingMore"
        icon="mdi:arrow-down"
        :loading="loadingMore"
        loading-icon="streamline-ultimate:loading-bold"
    >
      Показать ещё
    </u-button>
  </div>
</template>
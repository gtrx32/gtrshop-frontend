<script lang="ts" setup>
import type {News} from "~/types/news";
import type {PaginatedResponse} from "~/types/api";

const api = useApi();

const {data: news} = await useAsyncData("news", () =>
    api<PaginatedResponse<News>>("/api/news")
);

const newsItems = computed(() => news.value?.data?.slice(0, 7) ?? []);

const cardClasses = [
  {
    grid: "md:col-span-2 md:row-span-2 xl:col-span-1 xl:row-span-4",
    excerpt: "line-clamp-10",
  },
  {
    grid: "md:col-span-1 md:row-span-2 xl:col-span-1 xl:row-span-2",
    excerpt: "line-clamp-5",
  },
  {
    grid: "md:col-span-1 md:row-span-1 xl:col-span-1 xl:row-span-1",
    excerpt: "line-clamp-3",
  },
  {
    grid: "md:col-span-1 md:row-span-1 xl:col-span-1 xl:row-span-1",
    excerpt: "line-clamp-3",
  },
  {
    grid: "md:col-span-1 md:row-span-2 xl:col-span-1 xl:row-span-2",
    excerpt: "line-clamp-5",
  },
  {
    grid: "md:col-span-1 md:row-span-1 xl:col-span-1 xl:row-span-1",
    excerpt: "line-clamp-3",
  },
  {
    grid: "md:col-span-1 md:row-span-1 xl:col-span-1 xl:row-span-1",
    excerpt: "line-clamp-3",
  },
];
</script>

<template>
  <div v-if="newsItems.length" class="grid grid-cols-1 gap-4 md:grid-cols-2 md:auto-rows-[180px] xl:grid-cols-3">
    <NuxtLink
        v-for="(item, index) in newsItems"
        :key="item.id"
        :class="[
          'group relative overflow-hidden rounded-2xl min-h-[250px] md:min-h-0',
          cardClasses[index]?.grid
        ]"
        :to="`/news/${item.slug}`"
    >
      <img
          :alt="item.title"
          :src="item.image ?? undefined"
          class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
      />

      <div class="absolute inset-0 bg-gtr-shadow"/>

      <div class="relative z-10 flex h-full flex-col justify-end p-4 pt-12 text-white">
        <span class="absolute right-4 top-4 text-sm">
          {{ formatDate(item.active_from || item.created_at) }}
        </span>

        <h3 class="mb-2 line-clamp-2 text-lg font-semibold">
          {{ item.title }}
        </h3>

        <p :class="['text-sm text-white/90', cardClasses[index]?.excerpt]">
          {{ item.excerpt }}
        </p>
      </div>
    </NuxtLink>
  </div>

  <div v-else>
    Новостей пока нет
  </div>
</template>
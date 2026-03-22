<script setup lang="ts">
import type {Banner} from "~/types/banner";

const api = useApi()

const { data: banners } = await useAsyncData('banners', () =>
    api<Banner[]>('/api/banners')
)
</script>

<template>
  <div class="space-y-8 sm:space-y-12">
    <banner-slider :banners="banners ?? []"/>

    <div class="space-y-4">
      <subtitle>
        <template #title>
          Последние новости
        </template>
        <template #actions>
          <u-button to="/news" color="primary" variant="ghost" size="xl">
            Все новости
          </u-button>
        </template>
      </subtitle>
      <news-widget />
    </div>
  </div>
</template>
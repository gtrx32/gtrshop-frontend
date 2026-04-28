<script setup lang="ts">
import type { NuxtError } from '#app'
import type { Product } from '~/types/product'
import type { CatalogViewMode } from '~/types/catalog'
import CatalogProductTable from "~/components/catalog/list/CatalogProductTable.vue";
import CatalogProductGrid from "~/components/catalog/list/CatalogProductGrid.vue";

const props = defineProps<{
  products: Product[]
  viewMode: CatalogViewMode
  loading: boolean
  error?: NuxtError
}>()

const emit = defineEmits<{
  reset: []
}>()

const hasProducts = computed(() => props.products.length > 0)
</script>

<template>
  <div class="relative flex min-h-[420px] grow flex-col">
    <div
        v-if="error && !loading"
        class="flex grow flex-col items-center justify-center rounded-lg border border-dashed border-gtr-soft px-6 py-16"
    >
      <div class="text-2xl font-medium text-gtr-base">
        Ошибка загрузки товаров
      </div>

      <u-button
          class="mt-5"
          color="neutral"
          @click="emit('reset')"
      >
        Сбросить фильтры
      </u-button>
    </div>

    <div
        v-else-if="hasProducts"
        class="transition-opacity duration-200"
        :class="{ 'pointer-events-none opacity-50': loading }"
    >
      <CatalogProductGrid
          v-if="viewMode === 'grid'"
          :products="products"
      />

      <CatalogProductTable
          v-else
          :products="products"
      />
    </div>

    <div
        v-else-if="!loading"
        class="flex grow flex-col items-center justify-center rounded-lg border border-dashed border-gtr-soft px-6 py-16"
    >
      <div class="text-2xl font-medium text-gtr-base">
        Ничего не найдено
      </div>

      <u-button
          class="mt-5"
          color="neutral"
          @click="emit('reset')"
      >
        Сбросить фильтры
      </u-button>
    </div>

    <div
        v-if="loading"
        class="absolute inset-0 z-10 rounded-lg bg-gtr-pale/60 backdrop-blur-[1px]"
    >
      <div class="sticky top-[45dvh] flex justify-center py-8">
        <spinner />
      </div>
    </div>
  </div>
</template>
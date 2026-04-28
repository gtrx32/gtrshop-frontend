<script setup lang="ts">
import type {
  CatalogSort,
  CatalogSortOption,
  CatalogSortOrder,
  CatalogViewMode,
  CatalogViewModeOption,
} from '~/types/catalog'

import CatalogSortSelect from '~/components/catalog/list/CatalogSort.vue'
import CatalogViewModeSwitcher from '~/components/catalog/list/CatalogViewMode.vue'

const props = defineProps<{
  total: number
  sort: CatalogSort
  order: CatalogSortOrder
  sortOptions: CatalogSortOption[]
  viewMode: CatalogViewMode
  viewModeOptions: CatalogViewModeOption[]
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:sort': [value: CatalogSortOption]
  'update:viewMode': [value: CatalogViewMode]
}>()

const currentSortOption = computed(() => {
  return props.sortOptions.find((option) => {
    return option.value === props.sort && option.order === props.order
  })
})
</script>

<template>
  <div class="rounded-lg border border-gtr-soft p-4 md:p-5">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div class="text-sm uppercase tracking-[0.18em] text-gtr-muted">
          Найдено
        </div>

        <div class="mt-1 text-2xl font-medium text-gtr-base">
          {{ total }} товаров
        </div>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <CatalogSortSelect
            :model-value="currentSortOption"
            :options="sortOptions"
            :disabled="loading"
            @update:model-value="emit('update:sort', $event)"
        />

        <CatalogViewModeSwitcher
            :model-value="viewMode"
            :options="viewModeOptions"
            :disabled="loading"
            @update:model-value="emit('update:viewMode', $event)"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { CatalogFilters, CatalogFilterValues } from '~/types/catalog'

interface CatalogFiltersProps {
  modelValue: CatalogFilters
  loading?: boolean
  filterValues?: CatalogFilterValues
}

const props = defineProps<CatalogFiltersProps>()

const emit = defineEmits<{
  'update:modelValue': [value: CatalogFilters]
  reset: []
}>()

function updateFilter<Key extends keyof CatalogFilters>(
    key: Key,
    value: CatalogFilters[Key],
) {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value,
  })
}
</script>

<template>
  <aside class="space-y-6 rounded-lg border border-gtr-soft p-5 md:p-6">
    <div class="flex items-center justify-between gap-4">
      <h2 class="text-xl font-medium text-gtr-base">
        Фильтры
      </h2>

      <u-button
          :disabled="loading"
          size="lg"
          variant="ghost"
          @click="emit('reset')"
      >
        Сбросить
      </u-button>
    </div>

    <div class="flex flex-col gap-6">
      <div>
        <label
            for="catalog-name"
            class="text-sm text-gtr-toned"
        >
          Название
        </label>

        <u-input
            id="catalog-name"
            :model-value="modelValue.name"
            :disabled="loading"
            placeholder="Например, danil kolbasenko"
            class="mt-1 w-full"
            :ui="{
            base: 'w-full rounded-lg border border-gtr-soft bg-white/70 text-gtr-base placeholder:text-gtr-muted dark:bg-gtr-pale'
          }"
            @change="updateFilter('name', ($event.target as HTMLInputElement).value)"
        />
      </div>

      <div class="flex items-center gap-3">
        <u-switch
            id="catalog-in-stock"
            :model-value="modelValue.in_stock"
            :disabled="loading"
            color="neutral"
            @update:model-value="updateFilter('in_stock', $event)"
        />

        <label
            for="catalog-in-stock"
            class="cursor-pointer text-gtr-base"
        >
          Только в наличии
        </label>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label
              for="catalog-price-min"
              class="text-sm text-gtr-toned"
          >
            Цена от
          </label>

          <u-input-number
              id="catalog-price-min"
              :model-value="modelValue.price_min"
              :min="filterValues?.price.min ?? 0"
              :max="filterValues?.price.max ?? undefined"
              :step="100"
              :step-snapping="false"
              orientation="vertical"
              class="mt-1 w-full"
              :ui="{
                base: 'w-full rounded-lg border border-gtr-soft bg-white/70 text-gtr-base dark:bg-gtr-pale'
              }"
              @update:model-value="updateFilter('price_min', $event ?? null)"
          />
        </div>

        <div>
          <label
              for="catalog-price-max"
              class="text-sm text-gtr-toned"
          >
            Цена до
          </label>

          <u-input-number
              id="catalog-price-max"
              :model-value="modelValue.price_max"
              :min="filterValues?.price.min ?? 0"
              :max="filterValues?.price.max ?? undefined"
              :step="100"
              :step-snapping="false"
              orientation="vertical"
              class="mt-1 w-full"
              :ui="{
                base: 'w-full rounded-lg border border-gtr-soft bg-white/70 text-gtr-base dark:bg-gtr-pale'
              }"
              @update:model-value="updateFilter('price_max', $event ?? null)"
          />
        </div>
      </div>
    </div>
  </aside>
</template>
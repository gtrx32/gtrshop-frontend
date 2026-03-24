<script setup lang="ts">
import type { CatalogFilters } from '~/types/catalog'
// todo: рефактор
interface CatalogFiltersProps {
    modelValue: CatalogFilters
    loading?: boolean
}

const props = defineProps<CatalogFiltersProps>()

const emit = defineEmits<{
    'update:modelValue': [value: CatalogFilters]
    reset: []
}>()

function updateFilter<Key extends keyof CatalogFilters>(key: Key, value: CatalogFilters[Key]) {
    emit('update:modelValue', {
        ...props.modelValue,
        [key]: value,
    })
}
</script>

<template>
  <aside class="rounded-lg border border-gtr-soft bg-gtr-fade/40 p-5 md:p-6">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h2 class="text-xl font-medium text-gtr-base">
          Фильтры
        </h2>
        <p class="mt-1 text-sm text-gtr-muted">
          Поиск, цена, рейтинг и наличие
        </p>
      </div>

      <u-button
          color="neutral"
          variant="ghost"
          size="sm"
          :disabled="loading"
          @click="emit('reset')"
      >
        Сбросить
      </u-button>
    </div>

    <div class="mt-6 space-y-5">
      <div class="space-y-2">
        <label class="text-sm text-gtr-toned" for="catalog-name">
          Название
        </label>
        <input
            id="catalog-name"
            :value="modelValue.name"
            type="text"
            class="w-full rounded-2xl border border-gtr-soft bg-white/70 px-4 py-3 text-gtr-base outline-none transition focus:border-gtr-accent dark:bg-gtr-pale"
            placeholder="Например, Fender"
            @input="updateFilter('name', ($event.target as HTMLInputElement).value)"
        />
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="space-y-2">
          <label class="text-sm text-gtr-toned" for="catalog-price-min">
            Цена от
          </label>
          <input
              id="catalog-price-min"
              :value="modelValue.priceMin ?? ''"
              type="number"
              min="0"
              class="w-full rounded-2xl border border-gtr-soft bg-white/70 px-4 py-3 text-gtr-base outline-none transition focus:border-gtr-accent dark:bg-gtr-pale"
              placeholder="0"
              @input="updateFilter('priceMin', ($event.target as HTMLInputElement).value === '' ? null : Number(($event.target as HTMLInputElement).value))"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm text-gtr-toned" for="catalog-price-max">
            Цена до
          </label>
          <input
              id="catalog-price-max"
              :value="modelValue.priceMax ?? ''"
              type="number"
              min="0"
              class="w-full rounded-2xl border border-gtr-soft bg-white/70 px-4 py-3 text-gtr-base outline-none transition focus:border-gtr-accent dark:bg-gtr-pale"
              placeholder="500000"
              @input="updateFilter('priceMax', ($event.target as HTMLInputElement).value === '' ? null : Number(($event.target as HTMLInputElement).value))"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="space-y-2">
          <label class="text-sm text-gtr-toned" for="catalog-rating-min">
            Рейтинг от
          </label>
          <input
              id="catalog-rating-min"
              :value="modelValue.ratingMin ?? ''"
              type="number"
              min="0"
              max="5"
              step="0.1"
              class="w-full rounded-2xl border border-gtr-soft bg-white/70 px-4 py-3 text-gtr-base outline-none transition focus:border-gtr-accent dark:bg-gtr-pale"
              placeholder="0"
              @input="updateFilter('ratingMin', ($event.target as HTMLInputElement).value === '' ? null : Number(($event.target as HTMLInputElement).value))"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm text-gtr-toned" for="catalog-rating-max">
            Рейтинг до
          </label>
          <input
              id="catalog-rating-max"
              :value="modelValue.ratingMax ?? ''"
              type="number"
              min="0"
              max="5"
              step="0.1"
              class="w-full rounded-2xl border border-gtr-soft bg-white/70 px-4 py-3 text-gtr-base outline-none transition focus:border-gtr-accent dark:bg-gtr-pale"
              placeholder="5"
              @input="updateFilter('ratingMax', ($event.target as HTMLInputElement).value === '' ? null : Number(($event.target as HTMLInputElement).value))"
          />
        </div>
      </div>

      <label class="flex items-center gap-3 rounded-2xl border border-gtr-soft bg-white/60 px-4 py-3 text-sm text-gtr-base dark:bg-gtr-pale">
        <input
            :checked="modelValue.inStock"
            type="checkbox"
            class="h-4 w-4 rounded border-gtr-soft text-gtr-base focus:ring-gtr-accent"
            @change="updateFilter('inStock', ($event.target as HTMLInputElement).checked)"
        />
        <span>Только в наличии</span>
      </label>
    </div>
  </aside>
</template>

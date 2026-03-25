<script lang="ts" setup>
import type {CatalogFilters} from '~/types/catalog'

interface CatalogFiltersProps {
  modelValue: CatalogFilters
  loading?: boolean
  priceBounds?: {
    min_price: number | null
    max_price: number | null
  }
}

const props = defineProps<CatalogFiltersProps>()

const emit = defineEmits<{
  'update:modelValue': [value: CatalogFilters]
  reset: []
}>()

const minPriceLimit = computed(() => props.priceBounds?.min_price ?? 0)
const maxPriceLimit = computed(() => props.priceBounds?.max_price ?? 100000)

function updateFilter<Key extends keyof CatalogFilters>(key: Key, value: CatalogFilters[Key]) {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value,
  })
}

const priceRange = ref<[number, number]>([
  props.modelValue.priceMin ?? minPriceLimit.value,
  props.modelValue.priceMax ?? maxPriceLimit.value,
])

watch(
    () => [props.modelValue.priceMin, props.modelValue.priceMax, minPriceLimit.value, maxPriceLimit.value],
    ([min, max]) => {
      priceRange.value = [min ?? minPriceLimit.value, max ?? maxPriceLimit.value]
    }
)

function commitPriceRange() {
  updateFilter('priceMin', priceRange.value[0])
  updateFilter('priceMax', priceRange.value[1])
}
</script>

<template>
  <aside class="rounded-lg border border-gtr-soft  p-5 md:p-6 space-y-6">
    <div class="flex items-center justify-between gap-4">
      <h2 class="text-xl font-medium text-gtr-base">
        Фильтры
      </h2>
      <u-button :disabled="loading" size="lg" variant="ghost" @click="emit('reset')">
        Сбросить
      </u-button>
    </div>

    <div class="flex flex-col gap-6">
      <div>
        <label class="text-sm text-gtr-toned" for="catalog-name">
          Название
        </label>
        <u-input
            id="catalog-name"
            :model-value="modelValue.name"
            :ui="{ base: 'w-full rounded-lg border border-gtr-soft bg-white/70 dark:bg-gtr-pale' }"
            class="w-full mt-1"
            placeholder="Например, danil kolbasenko"
            @change="updateFilter('name', ($event.target as HTMLInputElement).value)"
        />
      </div>

      <div class="flex gap-2">
        <u-switch v-model="modelValue.inStock" id="catalog-in-stock" />
        <label class="" for="catalog-in-stock">
          Только в наличии
        </label>
      </div>

      <div class="flex flex-col gap-4">
        <div class="flex gap-4">
          <div>
            <label class="text-sm text-gtr-toned" for="catalog-price-min">
              Цена от
            </label>
            <u-input-number
                id="catalog-price-min"
                :max="priceRange[1]"
                :min="minPriceLimit"
                :model-value="priceRange[0]"
                :ui="{ base: 'w-full rounded-lg border border-gtr-soft bg-white/70 dark:bg-gtr-pale' }"
                class="w-full mt-1"
                orientation="vertical"
                @update:model-value="(value: number | undefined) => updateFilter('priceMin', value ?? minPriceLimit)"
            />
          </div>
          <div>
            <label class="text-sm text-gtr-toned" for="catalog-price-max">
              Цена до
            </label>
            <u-input-number
                id="catalog-price-max"
                :max="maxPriceLimit"
                :min="priceRange[0]"
                :model-value="priceRange[1]"
                :ui="{ base: 'w-full rounded-lg border border-gtr-soft bg-white/70 dark:bg-gtr-pale' }"
                class="w-full mt-1"
                orientation="vertical"
                @update:model-value="(value: number | undefined) => updateFilter('priceMax', value ?? maxPriceLimit)"
            />
          </div>
        </div>
        <u-slider
            v-model="priceRange"
            :max="maxPriceLimit"
            :min="minPriceLimit"
            :step="1000"
            :ui="{
              track: 'bg-white/70 dark:bg-gtr-pale',
              range: 'bg-gtr-contrast',
              thumb: 'bg-white ring-gtr-contrast dark:bg-gtr-pale',
            }"
            color="neutral"
            @change="commitPriceRange"
        />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type {PaginatedResponse, PaginationMeta} from '~/types/api'
import type {CatalogFilters, CatalogSortKey, CatalogSortOrder, CatalogViewMode} from '~/types/catalog'
import {CATALOG_SORT_OPTIONS} from '~/types/catalog'
import type {Product} from '~/types/product'

definePageMeta({
  breadcrumb: 'Каталог',
})

const api = useApi()
const route = useRoute()

const filters = reactive<CatalogFilters>({
  name: typeof route.query.name === 'string' ? route.query.name : '',
  priceMin: typeof route.query.price_min === 'string' && route.query.price_min !== '' ? Number(route.query.price_min) : null,
  priceMax: typeof route.query.price_max === 'string' && route.query.price_max !== '' ? Number(route.query.price_max) : null,
  ratingMin: typeof route.query.rating_min === 'string' && route.query.rating_min !== '' ? Number(route.query.rating_min) : null,
  ratingMax: typeof route.query.rating_max === 'string' && route.query.rating_max !== '' ? Number(route.query.rating_max) : null,
  inStock: route.query.in_stock === '1',
})

const page = ref(typeof route.query.page === 'string' ? Number(route.query.page) || 1 : 1)
const perPage = 12

const sort = ref<CatalogSortKey>(isCatalogSortKey(route.query.sort) ? route.query.sort : 'id')
const order = ref<CatalogSortOrder>(route.query.order === 'asc' ? 'asc' : 'desc')

const selectedSortLabel = computed(() => {
  return CATALOG_SORT_OPTIONS.find((item) => item.value === sort.value && item.order === order.value)?.label
      ?? CATALOG_SORT_OPTIONS[0]?.label
})

const requestParams = computed(() => ({
  page: page.value,
  per_page: perPage,
  sort: sort.value,
  order: order.value,
  name: filters.name || undefined,
  price_min: filters.priceMin ?? undefined,
  price_max: filters.priceMax ?? undefined,
  rating_min: filters.ratingMin ?? undefined,
  rating_max: filters.ratingMax ?? undefined,
  in_stock: filters.inStock ? 1 : undefined,
}))

const {data, pending, refresh} = await useAsyncData(
    'catalog:products',
    () => api<PaginatedResponse<Product>>('api/products', {
      query: requestParams.value,
    }),
    {
      watch: [requestParams],
    }
)

const products = computed(() => data.value?.data ?? [])
const meta = computed<PaginationMeta | null>(() => data.value?.meta ?? null)

const hasProducts = computed(() => products.value.length > 0)

const viewMode = ref<CatalogViewMode>(route.query.view === 'table' ? 'table' : 'grid')

function isCatalogSortKey(value: unknown): value is CatalogSortKey {
  return CATALOG_SORT_OPTIONS.some(option => option.value === value)
}

function updateFilters(value: CatalogFilters) {
  filters.name = value.name
  filters.priceMin = value.priceMin
  filters.priceMax = value.priceMax
  filters.ratingMin = value.ratingMin
  filters.ratingMax = value.ratingMax
  filters.inStock = value.inStock
}

function resetFilters() {
  updateFilters({
    name: '',
    priceMin: null,
    priceMax: null,
    ratingMin: null,
    ratingMax: null,
    inStock: false,
  })
}

function applySort(optionLabel: string) {
  const option = CATALOG_SORT_OPTIONS.find((item) => item.label === optionLabel)
  if (!option) return

  sort.value = option.value
  order.value = option.order
  page.value = 1
}

function setPage(nextPage: number) {
  if (!meta.value) return
  if (nextPage < 1 || nextPage > meta.value.last_page) return
  page.value = nextPage
}

watch(
    () => filters,
    () => page.value = 1,
    {deep: true}
)
</script>

<template>
  <div class="space-y-6 md:space-y-8">
    <heading title="Каталог" breadcrumbs />

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)] items-start relative">
      <div class="lg:sticky lg:top-30">
        <catalog-filters
            :model-value="filters"
            :loading="pending"
            @update:model-value="updateFilters"
            @reset="resetFilters"
        />
      </div>

      <section class="space-y-4">
        <div class="rounded-lg border border-gtr-soft bg-gtr-fade/30 p-4 md:p-5">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div class="text-sm uppercase tracking-[0.18em] text-gtr-muted">
                Найдено
              </div>
              <div class="mt-1 text-2xl font-medium text-gtr-base">
                {{ meta?.total }} товаров
              </div>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
              <u-select
                  :model-value="selectedSortLabel"
                  :items="CATALOG_SORT_OPTIONS.map((item) => item.label)"
                  class="min-w-48 focus:ring-unset focus:ring-1"
                  @update:model-value="applySort"
              />

              <!-- todo: заменить на компонент nuxt ui -->
              <div class="grid grid-cols-2 rounded-2xl border border-gtr-soft bg-white/70 p-1 dark:bg-gtr-pale">
                <button
                    type="button"
                    class="rounded-xl px-4 py-2 text-sm transition"
                    :class="viewMode === 'grid' ? 'bg-gtr-contrast text-gtr-pale' : 'text-gtr-base'"
                    @click="viewMode = 'grid'"
                >
                  Плитка
                </button>
                <button
                    type="button"
                    class="rounded-xl px-4 py-2 text-sm transition"
                    :class="viewMode === 'table' ? 'bg-gtr-contrast text-gtr-pale' : 'text-gtr-base'"
                    @click="viewMode = 'table'"
                >
                  Таблица
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- todo: добавить спиннер -->
        <div v-if="pending">
          loading...
        </div>

        <template v-else-if="hasProducts">
          <catalog-grid v-if="viewMode === 'grid'" :products="products"/>
          <catalog-table v-else :products="products"/>

          <!-- todo: заменить на пагинацию из nuxt ui -->
          <div
              v-if="meta && meta.last_page > 1"
              class="flex flex-wrap items-center justify-center gap-2 pt-2"
          >
            <u-button
                color="neutral"
                variant="ghost"
                :disabled="page <= 1"
                @click="setPage(page - 1)"
            >
              Назад
            </u-button>

            <button
                v-for="pageNumber in pageNumbers"
                :key="pageNumber"
                type="button"
                class="flex h-10 min-w-10 items-center justify-center rounded-2xl border px-3 text-sm transition"
                :class="page === pageNumber ? 'border-gtr-contrast bg-gtr-contrast text-gtr-pale' : 'border-gtr-soft bg-white/70 text-gtr-base dark:bg-gtr-pale'"
                @click="setPage(pageNumber)"
            >
              {{ pageNumber }}
            </button>

            <u-button
                color="neutral"
                variant="ghost"
                :disabled="!meta || page >= meta.last_page"
                @click="setPage(page + 1)"
            >
              Вперед
            </u-button>
          </div>
        </template>

        <div
            v-else
            class="rounded-3xl border border-dashed border-gtr-soft bg-gtr-fade/20 px-6 py-16 text-center"
        >
          <div class="text-2xl font-medium text-gtr-base">
            Ничего не найдено
          </div>
          <u-button class="mt-5" @click="resetFilters(); refresh()">
            Сбросить фильтры
          </u-button>
        </div>
      </section>
    </div>
  </div>
</template>

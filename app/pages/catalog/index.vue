<script lang="ts" setup>
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
const perPage = 2

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
const viewModeTabs: { label: string, value: CatalogViewMode }[] = [
  {label: 'Плитка', value: 'grid'},
  {label: 'Таблица', value: 'table'},
];

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
  <div class="space-y-6 md:space-y-8 grow flex flex-col">
    <heading breadcrumbs title="Каталог"/>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)] items-start relative grow">
      <div class="lg:sticky lg:top-30">
        <catalog-filters
            :loading="pending"
            :model-value="filters"
            @reset="resetFilters"
            @update:model-value="updateFilters"
        />
      </div>

      <section class="h-full flex flex-col gap-4">
        <div class="rounded-lg border border-gtr-soft bg-gtr-fade/40 p-4 md:p-5">
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
                  :items="CATALOG_SORT_OPTIONS.map((item) => item.label)"
                  :model-value="selectedSortLabel"
                  class="min-w-48"
                  @update:model-value="applySort"
              />
              <u-tabs
                  v-model="viewMode"
                  :content="false"
                  :items="viewModeTabs"
                  variant="pill"
              />
            </div>
          </div>
        </div>

        <div class="grow flex flex-col">
          <spinner v-if="pending"/>

          <template v-else-if="hasProducts">
            <catalog-grid v-if="viewMode === 'grid'" :products="products"/>
            <catalog-table v-else :products="products"/>
          </template>

          <div
              v-else
              class="rounded-lg border border-dashed border-gtr-soft bg-gtr-fade/40 px-6 py-16 grow flex flex-col items-center justify-center"
          >
            <div class="text-2xl font-medium text-gtr-base">
              Ничего не найдено
            </div>
            <u-button class="mt-5" @click="resetFilters()">
              Сбросить фильтры
            </u-button>
          </div>
        </div>

        <div class="flex justify-center">
          <UPagination
              v-model:page="page"
              :items-per-page="perPage"
              :sibling-count="2"
              :total="meta?.total"
              :ui="{
                list: 'flex flex-wrap justify-center sm:flex-nowrap',
                first: 'size-10',
                prev: 'size-10',
                item: 'size-10',
                next: 'size-10',
                last: 'size-10',
                ellipsis: 'size-10',
              }"
              show-edges
          />
        </div>
      </section>
    </div>
  </div>
</template>

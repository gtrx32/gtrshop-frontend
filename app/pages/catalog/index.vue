<script lang="ts" setup>
import type {PaginationMeta} from '~/types/api'
import type {CatalogFilters, CatalogResponse, CatalogSortKey, CatalogSortOrder, CatalogViewMode} from '~/types/catalog'
import {CATALOG_SORT_OPTIONS} from '~/types/catalog'

definePageMeta({
  breadcrumb: 'Каталог',
})

const api = useApi()
const route = useRoute()

const filters = reactive<CatalogFilters>({
  name: typeof route.query.name === 'string' ? route.query.name : '',
  priceMin: typeof route.query.price_min === 'string' && route.query.price_min !== '' ? Number(route.query.price_min) : null,
  priceMax: typeof route.query.price_max === 'string' && route.query.price_max !== '' ? Number(route.query.price_max) : null,
  inStock: route.query.in_stock === '1',
})

const page = ref(typeof route.query.page === 'string' ? Number(route.query.page) || 1 : 1)
const perPageOptions = ['6', '9', '12', '15']
const perPage = ref(perPageOptions.includes(String(route.query.per_page)) ? String(route.query.per_page) : '6')

const sort = ref<CatalogSortKey>(isCatalogSortKey(route.query.sort) ? route.query.sort : 'id')
const order = ref<CatalogSortOrder>(route.query.order === 'asc' ? 'asc' : 'desc')

const selectedSortLabel = computed(() => {
  return CATALOG_SORT_OPTIONS.find((item) => item.value === sort.value && item.order === order.value)?.label
      ?? CATALOG_SORT_OPTIONS[0]?.label
})

const requestParams = computed(() => ({
  page: page.value,
  per_page: Number(perPage.value),
  sort: sort.value,
  order: order.value,
  name: filters.name || undefined,
  price_min: filters.priceMin ?? undefined,
  price_max: filters.priceMax ?? undefined,
  in_stock: filters.inStock ? 1 : undefined,
}))

const {data, pending} = await useAsyncData(
    'catalog:products',
    () => api<CatalogResponse>('api/products', {
      query: requestParams.value,
    }),
    {
      watch: [requestParams],
    }
)

const products = computed(() => data.value?.data ?? [])
const meta = computed<PaginationMeta | null>(() => data.value?.meta ?? null)
const priceBounds = computed(() => ({
  min_price: data.value?.filters?.min_price ?? 0,
  max_price: data.value?.filters?.max_price ?? 100000,
}))

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
  filters.inStock = value.inStock
}

function resetFilters() {
  updateFilters({
    name: '',
    priceMin: null,
    priceMax: null,
    inStock: false,
  })
}

function updatePerPage(value: string) {
  if (perPage.value === value) return

  page.value = 1
  perPage.value = value
}

function applySort(optionLabel: string) {
  const option = CATALOG_SORT_OPTIONS.find((item) => item.label === optionLabel)
  if (!option) return

  sort.value = option.value
  order.value = option.order
  page.value = 1
}

watch(
    filters,
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
            :price-bounds="priceBounds"
            @reset="resetFilters"
            @update:model-value="updateFilters"
        />
      </div>

      <section class="h-full flex flex-col gap-4">
        <div class="rounded-lg border border-gtr-soft p-4 md:p-5">
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

        <div class="flex flex-col items-center gap-4">
          <UPagination
              v-model:page="page"
              :items-per-page="Number(perPage)"
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
          <div class="flex items-center gap-4">
            <div>Товаров на странице:</div>
            <u-select
                :items="perPageOptions"
                class="min-w-20"
                :model-value="perPage"
                @update:model-value="updatePerPage"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

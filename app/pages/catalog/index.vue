<script setup lang="ts">
import {useCatalogQuery} from "~/composables/catalog/useCatalogQuery";
import {useCatalogProducts} from "~/composables/catalog/useCatalogProducts";
import {useCatalogViewMode} from "~/composables/catalog/useCatalogViewMode";
import CatalogFilters from "~/components/catalog/list/CatalogFilters.vue";
import CatalogToolbar from "~/components/catalog/list/CatalogToolbar.vue";
import CatalogProducts from "~/components/catalog/list/CatalogProducts.vue";
import CatalogPagination from "~/components/catalog/list/CatalogPagination.vue";

const {
  filters,
  sort,
  order,
  page,
  per_page,
  query,
  sortOptions,
  perPageOptions,
  setFilters,
  setSort,
  setPage,
  setPerPage,
  resetFilters,
} = useCatalogQuery()

const {
  products,
  total,
  lastPage,
  pending,
  error,
  filterValues,
} = useCatalogProducts(query)

const {
  viewMode,
  viewModeOptions,
  setViewMode,
} = useCatalogViewMode()
</script>

<template>
  <div class="flex grow flex-col space-y-6 md:space-y-8">
    <heading
        breadcrumbs
        title="Каталог"
    />

    <div class="relative grid grow grid-cols-1 items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <div class="lg:sticky lg:top-30">
        <CatalogFilters
            :model-value="filters"
            :loading="pending"
            :filter-values="filterValues"
            @update:model-value="setFilters"
            @reset="resetFilters"
        />
      </div>

      <section class="flex h-full flex-col gap-4">
        <CatalogToolbar
            :total="total"
            :sort="sort"
            :order="order"
            :sort-options="sortOptions"
            :view-mode="viewMode"
            :view-mode-options="viewModeOptions"
            :loading="pending"
            @update:sort="setSort"
            @update:view-mode="setViewMode"
        />

        <CatalogProducts
            :products="products"
            :view-mode="viewMode"
            :loading="pending"
            :error="error"
            @reset="resetFilters"
        />

        <CatalogPagination
            v-if="total > 0 && lastPage > 1"
            :page="page"
            :per-page="per_page"
            :per-page-options="perPageOptions"
            :total="total"
            :loading="pending"
            @update:page="setPage"
            @update:per-page="setPerPage"
        />
      </section>
    </div>
  </div>
</template>
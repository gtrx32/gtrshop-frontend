<script setup lang="ts">
import type { Product } from '~/types/product'

interface CatalogTableProps {
  products: Product[]
}

const props = defineProps<CatalogTableProps>()
</script>

<template>
  <div class="divide-y divide-gtr-soft overflow-hidden rounded-lg border border-gtr-soft bg-gtr-pale">
    <article
        v-for="product in props.products"
        :key="product.id"
        class="grid grid-cols-[80px_minmax(0,1fr)] items-start gap-4 p-4 transition-colors duration-200 hover:bg-gtr-fade/25 md:grid-cols-[88px_minmax(0,1fr)_172px] md:gap-5 md:p-5"
    >
      <NuxtLink
          :to="`/catalog/${product.slug}`"
          class="block self-start overflow-hidden rounded-md"
      >
        <div class="aspect-square">
          <img
              :src="product.image ?? ''"
              :alt="product.name"
              class="h-full w-full object-cover"
          >
        </div>
      </NuxtLink>

      <div class="min-w-0">
        <NuxtLink
            :to="`/catalog/${product.slug}`"
            class="block min-w-0"
        >
          <h3 class="line-clamp-2 text-lg leading-tight font-medium text-gtr-base">
            {{ product.name }}
          </h3>
        </NuxtLink>

        <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
          <u-badge
              :class="product.stock > 0 ? 'border-gtr-highlight text-gtr-highlight' : 'border-gtr-error text-gtr-error'"
              class="border bg-gtr-pale"
          >
            {{ formatStock(product.stock) }}
          </u-badge>

          <div
              v-if="product.reviews_count"
              class="flex flex-wrap items-center gap-1 text-gtr-muted"
          >
            <UIcon
                name="mdi:star"
                class="size-4 text-gtr-warning"
            />
            <span>{{ formatRating(product.rating) }}</span>
            <span>· {{ product.reviews_count }} отзывов</span>
          </div>

          <div
              v-else
              class="flex items-center gap-1 text-gtr-dimmed"
          >
            <UIcon
                name="mdi:star-outline"
                class="size-4"
            />
            <span>Нет отзывов</span>
          </div>
        </div>

        <p class="mt-3 line-clamp-3 text-[15px] leading-6 text-gtr-muted">
          {{ product.description }}
        </p>
      </div>

      <div class="col-span-2 flex items-center justify-between gap-3 border-t border-gtr-soft/80 pt-3 md:col-span-1 md:block md:border-t-0 md:pt-0">
        <div class="flex flex-col gap-2">
          <div class="hidden text-xs uppercase tracking-[0.16em] text-gtr-dimmed md:block">
            Цена
          </div>
          <div class="text-2xl font-medium whitespace-nowrap text-gtr-base">
            {{ formatPrice(product.price) }}
          </div>
        </div>

        <u-button
            color="primary"
            variant="ghost"
            size="md"
            block
            class="w-auto min-w-32 px-4 md:mt-4 md:w-full md:min-w-0 md:px-0"
            @click.prevent
        >
          В корзину
        </u-button>
      </div>
    </article>
  </div>
</template>

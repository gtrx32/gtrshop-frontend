<script setup lang="ts">
import type { Product } from '~/types/product'

interface CatalogGridProps {
  products: Product[]
}

const props = defineProps<CatalogGridProps>()

function formatPrice(price: number) {
  return new Intl.NumberFormat('ru-RU').format(price)
}

function formatStock(stock: number) {
  return stock > 0 ? `${stock} в наличии` : 'Нет в наличии'
}

function formatRating(rating?: number) {
  return rating ? rating.toFixed(1) : null
}
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
    <NuxtLink
        v-for="product in props.products"
        :key="product.id"
        :to="`/catalog/${product.slug}`"
        class="grid min-h-[420px] grid-rows-[220px_auto] overflow-hidden rounded-lg border border-gtr-soft bg-gtr-pale transition-all duration-200 hover:bg-gtr-fade/30 hover:shadow-[0_0_15px_0_var(--color-gtr-accent)]"
    >
      <div class="relative bg-gtr-fade">
        <img
            :src="product.image ?? ''"
            :alt="product.name"
            class="h-full w-full object-cover"
        >
        <div class="absolute right-3 top-3">
          <u-badge
              :class="product.stock > 0 ? 'text-gtr-highlight border-gtr-highlight' : 'text-gtr-error border-gtr-error'"
              class="bg-gtr-pale border"
          >
            {{ formatStock(product.stock) }}
          </u-badge>
        </div>
      </div>

      <div class="flex h-full flex-col p-4">
        <div class="mb-3">
          <h3 class="line-clamp-2 text-xl leading-tight font-medium text-gtr-base">
            {{ product.name }}
          </h3>
        </div>

        <div class="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
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

        <p class="line-clamp-3 text-sm leading-6 text-gtr-muted">
          {{ product.description }}
        </p>

        <div class="mt-auto pt-6">
          <div class="mb-4 flex items-end justify-between gap-3">
            <div class="flex flex-col">
              <span class="text-xs uppercase tracking-[0.16em] text-gtr-dimmed">
                Цена
              </span>
              <div class="text-2xl font-medium text-gtr-base">
                {{ formatPrice(product.price) }} ₽
              </div>
            </div>
          </div>

          <u-button
              color="primary"
              variant="ghost"
              size="lg"
              block
              @click.prevent
          >
            В корзину
          </u-button>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

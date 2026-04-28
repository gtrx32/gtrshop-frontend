<script setup lang="ts">
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import type { Product } from '~/types/product'
import AddToCartButton from "~/components/catalog/list/AddToCartButton.vue";

interface CatalogProductTableProps {
  products: Product[]
}

defineProps<CatalogProductTableProps>()

const [listRef] = useAutoAnimate()

const { user } = useAuth()
</script>

<template>
  <div
      ref="listRef"
      class="divide-y divide-gtr-soft overflow-hidden rounded-lg border border-gtr-soft bg-gtr-pale"
  >
    <nuxt-link
        v-for="product in products"
        :key="product.id"
        :to="`/catalog/${product.slug}`"
        class="grid grid-cols-[80px_minmax(0,1fr)] items-start gap-4 p-4 transition-colors duration-200 hover:bg-gtr-fade/25 md:grid-cols-[88px_minmax(0,1fr)_172px] md:gap-5 md:p-5"
    >
      <div class="aspect-square overflow-hidden rounded-lg bg-gtr-fade">
        <img
            :src="product.image ?? ''"
            :alt="product.name"
            class="h-full w-full object-cover"
        >
      </div>

      <div class="min-w-0">
        <h3 class="line-clamp-2 text-lg font-medium leading-tight text-gtr-base">
          {{ product.name }}
        </h3>

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
            <u-icon
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
            <u-icon
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

          <div class="whitespace-nowrap text-2xl font-medium text-gtr-base">
            {{ formatPrice(product.price) }}
          </div>
        </div>
        <AddToCartButton v-if="user" :product-id="product.id" :stock="product.stock"/>
      </div>
    </nuxt-link>
  </div>
</template>
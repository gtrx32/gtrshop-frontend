<script setup lang="ts">
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import type { Product } from '~/types/product'
import AddToCartButton from "~/components/catalog/list/AddToCartButton.vue";

interface CatalogProductGridProps {
  products: Product[]
}

defineProps<CatalogProductGridProps>()

const [gridRef] = useAutoAnimate()

const { user } = useAuth()
</script>

<template>
  <div
      ref="gridRef"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
  >
    <nuxt-link
        v-for="product in products"
        :key="product.id"
        :to="`/catalog/${product.slug}`"
        class="group grid min-h-[420px] grid-rows-[220px_auto] overflow-hidden rounded-lg border border-gtr-soft bg-gtr-pale transition-all duration-200 hover:bg-gtr-fade/30 hover:shadow-[0_0_15px_0_var(--color-gtr-accent)]"
    >
      <div class="relative overflow-hidden bg-gtr-fade">
        <img
            :src="product.image ?? ''"
            :alt="product.name"
            class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        >

        <div class="absolute right-3 top-3">
          <u-badge
              :class="product.stock > 0 ? 'border-gtr-highlight text-gtr-highlight' : 'border-gtr-error text-gtr-error'"
              class="border bg-gtr-pale"
          >
            {{ formatStock(product.stock) }}
          </u-badge>
        </div>
      </div>

      <div class="flex h-full flex-col p-4">
        <div class="mb-3">
          <h3 class="line-clamp-2 text-xl font-medium leading-tight text-gtr-base">
            {{ product.name }}
          </h3>
        </div>

        <div class="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
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
                {{ formatPrice(product.price) }}
              </div>
            </div>
          </div>
          <AddToCartButton v-if="user" :product-id="product.id" :stock="product.stock"/>
        </div>
      </div>
    </nuxt-link>
  </div>
</template>
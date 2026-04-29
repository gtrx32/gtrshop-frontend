<script setup lang="ts">
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import type { Product } from '~/types/product'
import AddToCartButton from '~/components/catalog/list/AddToCartButton.vue'

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
      class="overflow-hidden rounded-xl border border-gtr-soft bg-gtr-pale"
  >
    <nuxt-link
        v-for="product in products"
        :key="product.id"
        :to="`/catalog/${product.slug}`"
        class="grid grid-cols-1 gap-4 border-b border-gtr-soft px-4 py-4 transition-colors duration-200 hover:bg-gtr-fade/20 last:border-b-0 md:grid-cols-[88px_minmax(0,1fr)_220px] md:items-center md:gap-5 md:px-5"
    >
      <div class="flex gap-4 md:contents">
        <div class="h-22 w-22 shrink-0 overflow-hidden rounded-lg bg-gtr-fade md:h-22 md:w-22">
          <img
              :src="product.image ?? ''"
              :alt="product.name"
              class="h-full w-full object-cover"
          >
        </div>

        <div class="min-w-0 flex-1 md:hidden">
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
                class="flex items-center gap-1 text-gtr-muted"
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
        </div>
      </div>

      <div class="hidden min-w-0 md:block">
        <h3 class="line-clamp-1 text-xl font-medium leading-tight text-gtr-base">
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
              class="flex items-center gap-1 text-gtr-muted"
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

        <p class="mt-3 line-clamp-2 text-sm leading-6 text-gtr-muted">
          {{ product.description }}
        </p>
      </div>

      <div class="flex items-end justify-between gap-3 border-t border-gtr-soft/70 pt-3 md:flex-col md:items-stretch md:justify-center md:border-t-0 md:pt-0">
        <div class="space-y-1">
          <div class="text-xs uppercase tracking-[0.16em] text-gtr-dimmed">
            Цена
          </div>

          <div class="whitespace-nowrap text-2xl font-medium text-gtr-base md:text-3xl">
            {{ formatPrice(product.price) }}
          </div>
        </div>

        <div class="w-full max-w-50 md:max-w-none">
          <AddToCartButton
              v-if="user"
              :product-id="product.id"
              :stock="product.stock"
              size="sm"
          />
        </div>
      </div>
    </nuxt-link>
  </div>
</template>
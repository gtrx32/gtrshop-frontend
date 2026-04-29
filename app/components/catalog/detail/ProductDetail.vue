<script setup lang="ts">
import type { Product } from '~/types/product'

const props = defineProps<{
  product: Product
}>()

const reviewsTotal = computed(() => props.product.reviews_count ?? props.product.reviews?.length ?? 0)
const inStock = computed(() => props.product.stock > 0)

const ratingLabel = computed(() => formatRating(props.product.rating))

const reviewsLabel = computed(() => {
  return `${reviewsTotal.value} отзывов`
})

const stockText = computed(() => {
  return inStock.value ? `В наличии: ${props.product.stock}` : 'Нет в наличии'
})
</script>

<template>
  <section class="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
    <div class="overflow-hidden rounded-xl bg-gtr-fade/30 lg:min-w-0 lg:flex-[1.1]">
      <img
          v-if="product.image"
          :src="product.image"
          :alt="product.name"
          class="h-80 w-full object-cover sm:h-100 lg:h-120"
      >

      <div
          v-else
          class="flex h-80 w-full items-center justify-center text-gtr-toned sm:h-100 lg:h-120"
      >
        Нет изображения
      </div>
    </div>

    <div class="flex flex-col gap-2 md:gap-6 lg:min-w-[320px] lg:flex-[0.9]">
      <div class="flex flex-wrap items-center justify-end gap-x-3 gap-y-2 text-sm">
        <div
            v-if="ratingLabel"
            class="flex flex-wrap items-center gap-1 text-gtr-muted"
        >
          <u-icon
              name="mdi:star"
              class="size-4 text-gtr-warning"
          />

          <span>{{ ratingLabel }}</span>
          <span>· {{ reviewsLabel }}</span>
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

      <div class="space-y-2">
        <div class="text-sm uppercase tracking-[0.18em] text-gtr-muted">
          Цена
        </div>

        <div class="text-4xl font-medium tracking-tight text-gtr-base">
          {{ formatPrice(product.price) }}
        </div>
      </div>

      <div class="text-sm leading-6 text-gtr-toned">
        {{ product.description }}
      </div>

      <div class="flex flex-col items-start gap-2">
        <div class="text-gtr-toned">
          {{ stockText }}
        </div>

        <u-button v-if="inStock">
          Добавить в корзину
        </u-button>

        <u-button
            v-else
            to="/contacts"
            variant="ghost"
            color="primary"
        >
          Уточнить наличие
        </u-button>
      </div>
    </div>
  </section>
</template>
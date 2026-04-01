<script setup lang="ts">
import type { Review } from '~/types/review'

const props = defineProps<{
  reviews: Review[]
  limit?: number
}>()

const visibleReviews = computed(() => props.reviews.slice(0, props.limit ?? 4))
</script>

<template>
  <div
    v-if="visibleReviews.length"
    class="grid gap-4 lg:grid-cols-2"
  >
    <review-card
      v-for="review in visibleReviews"
      :key="review.id"
      :review="review"
    />
  </div>

  <div
    v-else
    class="py-12 text-center text-gtr-toned"
  >
    Для этого товара пока нет отзывов.
  </div>
</template>

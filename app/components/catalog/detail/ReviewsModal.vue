<script setup lang="ts">
import type { Review } from '~/types/review'
import type { ReviewSortKey } from '~/composables/catalog/useProductReviews'
import ReviewCard from '~/components/catalog/detail/ReviewCard.vue'

const open = defineModel<boolean>('open', { default: false })

const props = defineProps<{
  reviews: Review[]
  total: number
  page: number
  perPage: number
  perPageOptions: number[]
  shownFrom: number
  shownTo: number
  sort: ReviewSortKey
  sortOptions: { label: string, value: ReviewSortKey }[]
  loading: boolean
  error: unknown
  isReviewLoading: (reviewId: number) => boolean
}>()

const emit = defineEmits<{
  'update:page': [value: number]
  'update:sort': [value: ReviewSortKey]
  'update:perPage': [value: number]
  like: [reviewId: number]
  dislike: [reviewId: number]
}>()

const reviewsTitle = computed(() => `${props.total} отзывов`)
</script>

<template>
  <u-modal
      v-model:open="open"
      :title="reviewsTitle"
      :description="total ? 'Все отзывы о товаре с сортировкой и постраничной загрузкой.' : undefined"
      class="max-w-7xl"
      scrollable
  >
    <template #body>
      <div class="space-y-6">
        <div class="flex flex-col gap-3 border-b border-gtr-soft pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="text-sm leading-6 text-gtr-toned">
            Показано {{ shownFrom }}–{{ shownTo }} из {{ total }}
          </div>

          <u-select
              :model-value="sort"
              :items="sortOptions"
              value-key="value"
              label-key="label"
              :disabled="loading"
              class="min-w-60"
              color="neutral"
              @update:model-value="emit('update:sort', $event as ReviewSortKey)"
          />
        </div>

        <spinner v-if="loading" />

        <div
            v-else-if="error"
            class="py-12 text-center text-gtr-toned"
        >
          Не удалось загрузить отзывы.
        </div>

        <div
            v-else-if="reviews.length"
            class="grid gap-4 lg:grid-cols-2"
        >
          <ReviewCard
              v-for="review in reviews"
              :key="review.id"
              :review="review"
              :loading="isReviewLoading(review.id)"
              @like="emit('like', $event)"
              @dislike="emit('dislike', $event)"
          />
        </div>

        <div
            v-else
            class="py-12 text-center text-gtr-toned"
        >
          Отзывы не найдены.
        </div>

        <div
            v-if="total > 0"
            class="flex flex-col items-center gap-4 border-t border-gtr-soft pt-4"
        >
          <u-pagination
              :page="page"
              :items-per-page="perPage"
              :sibling-count="1"
              :total="total"
              :disabled="loading"
              @update:page="emit('update:page', $event)"
          />

          <div class="flex items-center gap-4 text-sm text-gtr-toned">
            <div>
              Отзывов на странице:
            </div>

            <u-select
                :model-value="perPage"
                :items="perPageOptions"
                :disabled="loading"
                class="min-w-20"
                color="neutral"
                @update:model-value="emit('update:perPage', Number($event))"
            />
          </div>
        </div>
      </div>
    </template>
  </u-modal>
</template>
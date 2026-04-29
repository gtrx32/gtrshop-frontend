<script setup lang="ts">
import type { Review } from '~/types/review'
import ReviewCard from '~/components/catalog/detail/ReviewCard.vue'
import ReviewsModal from '~/components/catalog/detail/ReviewsModal.vue'
import { useProductReviews } from '~/composables/catalog/useProductReviews'
import { useReviewMarks } from '~/composables/catalog/useReviewMarks'

const props = defineProps<{
  productSlug: string
  reviews: Review[]
  reviewsCount: number
}>()

const isModalOpen = ref(false)

const productSlug = computed(() => props.productSlug)

const previewReviews = ref<Review[]>([])

watch(
    () => props.reviews,
    (reviews) => {
      previewReviews.value = [...reviews]
    },
    {
      immediate: true,
      deep: true,
    },
)

const {
  reviews: modalReviews,
  pending,
  error,
  page,
  perPage,
  sort,
  total,
  shownFrom,
  shownTo,
  sortOptions,
  perPageOptions,
  fetchReviews,
  setPage,
  setSort,
  setPerPage,
} = useProductReviews(productSlug)

const {
  isPending,
  likeReview,
  dislikeReview,
} = useReviewMarks([
  previewReviews,
  modalReviews,
])

const visibleReviews = computed(() => previewReviews.value.slice(0, 4))
const hasReviews = computed(() => visibleReviews.value.length > 0)
const hasReviewsTotal = computed(() => props.reviewsCount > 0)
const modalTotal = computed(() => total.value || props.reviewsCount)

const openModal = async () => {
  isModalOpen.value = true
  await fetchReviews(1)
}
</script>

<template>
  <section class="space-y-4">
    <subtitle>
      <template #title>
        Отзывы
      </template>

      <template #actions>
        <u-button
            color="primary"
            variant="ghost"
            size="lg"
            :disabled="!hasReviewsTotal"
            @click="openModal"
        >
          {{ hasReviewsTotal ? `Все отзывы (${reviewsCount})` : 'Отзывы появятся позже' }}
        </u-button>
      </template>
    </subtitle>

    <div
        v-if="hasReviews"
        class="grid gap-4 lg:grid-cols-2"
    >
      <ReviewCard
          v-for="review in visibleReviews"
          :key="review.id"
          :review="review"
          :loading="isPending(review.id)"
          @like="likeReview"
          @dislike="dislikeReview"
      />
    </div>

    <div
        v-else
        class="py-12 text-center text-gtr-toned"
    >
      Для этого товара пока нет отзывов.
    </div>

    <ReviewsModal
        v-model:open="isModalOpen"
        :reviews="modalReviews"
        :total="modalTotal"
        :page="page"
        :per-page="perPage"
        :shown-from="shownFrom"
        :shown-to="shownTo"
        :sort="sort"
        :sort-options="sortOptions"
        :per-page-options="perPageOptions"
        :loading="pending"
        :error="error"
        :is-review-loading="isPending"
        @update:page="setPage"
        @update:sort="setSort"
        @update:perPage="setPerPage"
        @like="likeReview"
        @dislike="dislikeReview"
    />
  </section>
</template>
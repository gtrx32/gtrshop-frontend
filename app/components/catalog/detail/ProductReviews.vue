<script setup lang="ts">
import type { Review } from '~/types/review'
import ReviewCard from '~/components/catalog/detail/ReviewCard.vue'
import ReviewsModal from '~/components/catalog/detail/ReviewsModal.vue'
import CreateReviewModal from '~/components/catalog/detail/CreateReviewModal.vue'
import { useProductReviews } from '~/composables/catalog/useProductReviews'
import { useReviewMarks } from '~/composables/catalog/useReviewMarks'

const props = defineProps<{
  productSlug: string
  reviews: Review[]
  reviewsCount: number
  canReview?: boolean
}>()

const isReviewsModalOpen = ref(false)
const isCreateModalOpen = ref(false)

const productSlug = computed(() => props.productSlug)

const previewReviews = ref<Review[]>([])
const reviewsCount = ref(props.reviewsCount)

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

watch(
    () => props.reviewsCount,
    (value) => {
      reviewsCount.value = value
    },
    {
      immediate: true,
    },
)

const {
  reviews: modalReviews,
  pending,
  error,
  createPending,
  createError,
  page,
  perPage,
  sort,
  total,
  shownFrom,
  shownTo,
  sortOptions,
  perPageOptions,
  fetchReviews,
  createReview,
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
const hasReviewsTotal = computed(() => reviewsCount.value > 0)
const modalTotal = computed(() => total.value || reviewsCount.value)

const openReviewsModal = async () => {
  isReviewsModalOpen.value = true
  await fetchReviews(1)
}

const submitReview = async (payload: {
  title: string
  comment: string
  rating: number
}) => {
  const review = await createReview(payload)

  if (!review) return

  previewReviews.value = [
    review,
    ...previewReviews.value.filter((item) => item.id !== review.id),
  ]

  reviewsCount.value += 1
  isCreateModalOpen.value = false
}
</script>

<template>
  <section class="space-y-4">
    <subtitle>
      <template #title>
        Отзывы
      </template>

      <template #actions>
        <div class="flex flex-wrap items-center gap-2">
          <u-button
              color="primary"
              variant="ghost"
              size="lg"
              :disabled="!hasReviewsTotal"
              @click="openReviewsModal"
          >
            {{ hasReviewsTotal ? `Все отзывы (${reviewsCount})` : 'Отзывы появятся позже' }}
          </u-button>

          <u-button
              v-if="canReview"
              color="primary"
              size="lg"
              icon="mdi:pencil-outline"
              @click="isCreateModalOpen = true"
          >
            Оставить отзыв
          </u-button>
        </div>
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
        v-model:open="isReviewsModalOpen"
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

    <CreateReviewModal
        v-model:open="isCreateModalOpen"
        :loading="createPending"
        :error="createError"
        @submit="submitReview"
    />
  </section>
</template>
<script setup lang="ts">
import type { PaginatedResponse, PaginationMeta } from '~/types/api'
import type { Review } from '~/types/review'

type ReviewSortKey = 'newest' | 'oldest' | 'rating_desc' | 'rating_asc'

const open = defineModel<boolean>('open', { default: false })

const props = defineProps<{
  productSlug: string
  reviewsCount?: number
}>()

const api = useApi()

const perPage = 6

const page = ref(1)
const sort = ref<ReviewSortKey>('newest')
const reviews = ref<Review[]>([])
const meta = ref<PaginationMeta | null>(null)
const pending = ref(false)
const loadingMore = ref(false)

const sortOptions: { label: string, value: ReviewSortKey }[] = [
  { label: 'Сначала новые', value: 'newest' },
  { label: 'Сначала старые', value: 'oldest' },
  { label: 'С высоким рейтингом', value: 'rating_desc' },
  { label: 'С низким рейтингом', value: 'rating_asc' },
]

const totalReviews = computed(() => props.reviewsCount ?? meta.value?.total ?? reviews.value.length)
const reviewsTitle = computed(() => `${totalReviews.value} отзывов`)
const canLoadMore = computed(() => {
  if (!meta.value) return false
  return meta.value.current_page < meta.value.last_page
})

const sortParams = computed(() => {
  switch (sort.value) {
    case 'oldest':
      return { sort: 'date', order: 'asc' as const }
    case 'rating_desc':
      return { sort: 'rating', order: 'desc' as const }
    case 'rating_asc':
      return { sort: 'rating', order: 'asc' as const }
    case 'newest':
    default:
      return { sort: 'date', order: 'desc' as const }
  }
})

async function fetchReviews(reset = false) {
  if (!props.productSlug) return

  if (reset) {
    page.value = 1
    pending.value = true
  } else {
    loadingMore.value = true
  }

  try {
    const response = await api<PaginatedResponse<Review>>('api/reviews', {
      query: {
        product: props.productSlug,
        page: page.value,
        per_page: perPage,
        sort: sortParams.value.sort,
        order: sortParams.value.order,
      },
    })

    reviews.value = reset ? response.data : [...reviews.value, ...response.data]
    meta.value = response.meta
  } finally {
    pending.value = false
    loadingMore.value = false
  }
}

async function loadMore() {
  if (!canLoadMore.value || loadingMore.value) return

  page.value += 1
  await fetchReviews()
}

watch(open, async (value) => {
  if (!value) return
  await fetchReviews(true)
})

watch(sort, async () => {
  if (!open.value) return
  await fetchReviews(true)
})
</script>

<template>
  <u-modal
    v-model:open="open"
    :title="reviewsTitle"
    :description="totalReviews ? 'Все отзывы о товаре с серверной сортировкой и постраничной загрузкой.' : undefined"
    class='max-w-7xl'
    scrollable
  >
    <template #body>
      <div class="space-y-6">
        <div class="flex flex-col gap-3 border-b border-gtr-soft pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="text-sm leading-6 text-gtr-toned">
            Показано {{ reviews.length }} из {{ totalReviews }}
          </div>

          <u-select
            v-model="sort"
            :items="sortOptions"
            value-key="value"
            label-key="label"
            class="min-w-60"
          />
        </div>

        <spinner v-if="pending" />

        <div
          v-else-if="reviews.length"
          class="grid gap-4 lg:grid-cols-2"
        >
          <review-card
            v-for="review in reviews"
            :key="review.id"
            :review="review"
          />
        </div>

        <div
          v-else
          class="py-12 text-center text-gtr-toned"
        >
          Отзывы не найдены.
        </div>

        <div
          v-if="canLoadMore"
          class="flex justify-center pt-2"
        >
          <u-button
            icon="mdi:arrow-down"
            :loading="loadingMore"
            :disabled="pending || loadingMore"
            @click="loadMore"
          >
            Показать ещё
          </u-button>
        </div>
      </div>
    </template>
  </u-modal>
</template>

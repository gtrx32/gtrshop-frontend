import type { PaginatedResponse, PaginationMeta } from '~/types/api'
import type { Review } from '~/types/review'

export type ReviewSortKey = 'newest' | 'oldest' | 'rating_desc' | 'rating_asc'

type ReviewResponse = Review | {
    data: Review
}

type CreateReviewPayload = {
    title: string
    comment: string
    rating: number
}

export const useProductReviews = (productSlug: Ref<string>) => {
    const api = useApi()

    const reviews = ref<Review[]>([])
    const meta = ref<PaginationMeta | null>(null)
    const pending = ref(false)
    const error = ref<unknown>(null)

    const createPending = ref(false)
    const createError = ref<unknown>(null)

    const page = ref(1)
    const perPage = ref(6)
    const sort = ref<ReviewSortKey>('newest')

    const sortOptions: { label: string, value: ReviewSortKey }[] = [
        { label: 'Сначала новые', value: 'newest' },
        { label: 'Сначала старые', value: 'oldest' },
        { label: 'С высоким рейтингом', value: 'rating_desc' },
        { label: 'С низким рейтингом', value: 'rating_asc' },
    ]

    const perPageOptions = [6, 12, 24]

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

    const total = computed(() => meta.value?.total ?? 0)
    const lastPage = computed(() => meta.value?.last_page ?? 1)
    const currentPage = computed(() => meta.value?.current_page ?? page.value)

    const shownFrom = computed(() => {
        if (!reviews.value.length) return 0

        return (currentPage.value - 1) * perPage.value + 1
    })

    const shownTo = computed(() => {
        if (!reviews.value.length) return 0

        return Math.min(currentPage.value * perPage.value, total.value)
    })

    const normalizeReviewResponse = (response: ReviewResponse) => {
        return 'data' in response ? response.data : response
    }

    const fetchReviews = async (targetPage = page.value) => {
        if (!productSlug.value) return

        pending.value = true
        error.value = null

        try {
            const response = await api<PaginatedResponse<Review>>('api/reviews', {
                query: {
                    product: productSlug.value,
                    page: targetPage,
                    per_page: perPage.value,
                    sort: sortParams.value.sort,
                    order: sortParams.value.order,
                },
            })

            reviews.value = response.data
            meta.value = response.meta
            page.value = response.meta.current_page
        } catch (requestError) {
            error.value = requestError
        } finally {
            pending.value = false
        }
    }

    const createReview = async (payload: CreateReviewPayload) => {
        if (!productSlug.value) return null

        createPending.value = true
        createError.value = null

        try {
            const response = await api<ReviewResponse>('api/reviews', {
                method: 'POST',
                body: {
                    product: productSlug.value,
                    ...payload,
                },
            })

            const review = normalizeReviewResponse(response)

            reviews.value = [
                review,
                ...reviews.value.filter((item) => item.id !== review.id),
            ]

            if (meta.value) {
                meta.value.total += 1
            }

            return review
        } catch (requestError) {
            createError.value = requestError
            throw requestError
        } finally {
            createPending.value = false
        }
    }

    const setPage = async (value: number) => {
        if (value < 1 || value > lastPage.value || value === page.value) return

        page.value = value
        await fetchReviews(value)
    }

    const setSort = async (value: ReviewSortKey) => {
        if (value === sort.value) return

        sort.value = value
        page.value = 1
        await fetchReviews(1)
    }

    const setPerPage = async (value: number) => {
        if (value === perPage.value) return

        perPage.value = value
        page.value = 1
        await fetchReviews(1)
    }

    const resetReviews = () => {
        reviews.value = []
        meta.value = null
        page.value = 1
        error.value = null
        createError.value = null
    }

    watch(productSlug, () => {
        resetReviews()
    })

    return {
        reviews,
        meta,
        pending,
        error,

        createPending,
        createError,

        page,
        perPage,
        sort,

        total,
        lastPage,
        currentPage,
        shownFrom,
        shownTo,

        sortOptions,
        perPageOptions,

        fetchReviews,
        createReview,
        setPage,
        setSort,
        setPerPage,
        resetReviews,
    }
}
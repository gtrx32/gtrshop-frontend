import type { Review } from '~/types/review'

type ReviewResponse = Review | {
    data: Review
}

export const useReviewMarks = (sources: Ref<Review[]>[]) => {
    const api = useApi()

    const pendingIds = ref<number[]>([])

    const isPending = (reviewId: number) => {
        return pendingIds.value.includes(reviewId)
    }

    const setPending = (reviewId: number, value: boolean) => {
        if (value) {
            pendingIds.value = [...pendingIds.value, reviewId]
            return
        }

        pendingIds.value = pendingIds.value.filter((id) => id !== reviewId)
    }

    const normalizeReviewResponse = (response: ReviewResponse) => {
        return 'data' in response ? response.data : response
    }

    const replaceReview = (updatedReview: Review) => {
        sources.forEach((source) => {
            const index = source.value.findIndex((review) => review.id === updatedReview.id)

            if (index === -1) return

            source.value[index] = {
                ...source.value[index],
                ...updatedReview,
            }
        })
    }

    const likeReview = async (reviewId: number) => {
        if (isPending(reviewId)) return

        setPending(reviewId, true)

        try {
            const response = await api<ReviewResponse>(`api/reviews/${reviewId}/like`, {
                method: 'POST',
            })

            replaceReview(normalizeReviewResponse(response))
        } finally {
            setPending(reviewId, false)
        }
    }

    const dislikeReview = async (reviewId: number) => {
        if (isPending(reviewId)) return

        setPending(reviewId, true)

        try {
            const response = await api<ReviewResponse>(`api/reviews/${reviewId}/dislike`, {
                method: 'POST',
            })

            replaceReview(normalizeReviewResponse(response))
        } finally {
            setPending(reviewId, false)
        }
    }

    return {
        pendingIds,
        isPending,
        likeReview,
        dislikeReview,
    }
}
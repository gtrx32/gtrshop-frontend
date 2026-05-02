import type {News} from "~/types/news";
import type {PaginatedResponse, PaginationMeta} from "~/types/api";

export const useNewsList = () => {
    const api = useApi()

    const perPage = ref(10)
    const page = ref(1)

    const extraItems = ref<News[]>([])
    const meta = ref<PaginationMeta | null>(null)
    const loadingMore = ref(false)

    const {data, pending} = useAsyncData(
        'news:init',
        () => api<PaginatedResponse<News>>('api/news', {
            params: {page: 1, per_page: perPage.value},
        })
    )

    const baseItems = computed(() => data.value?.data ?? [])

    const news = computed(() => [...baseItems.value, ...extraItems.value])

    const currentMeta = computed(() => meta.value ?? data.value?.meta ?? null)

    const canLoadMore = computed(() => {
        if (!currentMeta.value) return false
        return currentMeta.value.current_page < currentMeta.value.last_page
    })

    async function loadMore() {
        if (loadingMore.value || !canLoadMore.value) return

        loadingMore.value = true
        page.value += 1

        const res = await api<PaginatedResponse<News>>('api/news', {
            params: {page: page.value, per_page: perPage.value},
        })

        extraItems.value.push(...res.data)
        meta.value = res.meta

        loadingMore.value = false
    }

    return {
        news,
        pending,
        canLoadMore,
        loadMore,
        loadingMore,
    }
}
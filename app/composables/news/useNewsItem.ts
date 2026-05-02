import type {News} from "~/types/news";

export const useNewsItem = async () => {
    const api = useApi()
    const route = useRoute()

    const slug = computed(() => String(route.params.slug))

    const { data } = await useAsyncData(
        () => `news:show:${slug.value}`,
        () => api<News>(`api/news/${slug.value}`),
        { watch: [slug] }
    )

    const news = computed(() => data.value!)

    return { news }
}
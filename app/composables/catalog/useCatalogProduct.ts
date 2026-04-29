import type { Product } from '~/types/product'

export const useCatalogProduct = async (slug: Ref<string>) => {
    const api = useApi()

    const {
        data: product,
        pending,
        error,
        refresh,
    } = await useAsyncData(
        () => `catalog:product:${slug.value}`,
        () => api<Product>(`api/products/${slug.value}`),
        {
            watch: [slug],
        },
    )

    return {
        product,
        pending,
        error,
        refresh,
    }
}
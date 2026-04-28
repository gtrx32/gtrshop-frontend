import type { CatalogFilterValues, CatalogQuery } from '~/types/catalog'
import type { Product } from '~/types/product'
import type { PaginatedResponse } from '~/types/api'

type CatalogProductsResponse = PaginatedResponse<Product> & {
    filters: CatalogFilterValues
}

export function useCatalogProducts(query: Ref<CatalogQuery>) {
    const api = useApi()

    const {
        data,
        pending,
        error,
        refresh,
    } = useAsyncData(
        'catalog:products',
        () => {
            return api<CatalogProductsResponse>('/api/products', {
                query: query.value,
            })
        },
        {
            watch: [query],
        },
    )

    const products = computed(() => data.value?.data ?? [])
    const meta = computed(() => data.value?.meta ?? null)
    const total = computed(() => data.value?.meta.total ?? 0)
    const lastPage = computed(() => data.value?.meta.last_page ?? 1)

    const filterValues = computed(() => data.value?.filters)

    return {
        products,
        meta,
        total,
        lastPage,
        filterValues,
        pending,
        error,
        refresh,
    }
}
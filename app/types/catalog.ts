import type {PaginatedResponse} from '~/types/api'
import type {Product} from '~/types/product'

export type CatalogViewMode = 'grid' | 'table'

export type CatalogSortKey = 'id' | 'name' | 'price' | 'stock' | 'rating'

export type CatalogSortOrder = 'asc' | 'desc'

export type CatalogSortOption = {
    label: string
    value: CatalogSortKey
    order: CatalogSortOrder
}

export type CatalogFilters = {
    name: string
    priceMin: number | null
    priceMax: number | null
    inStock: boolean
}

export type CatalogPriceBounds = {
    min_price: number | null
    max_price: number | null
}

export type CatalogResponse = PaginatedResponse<Product> & {
    filters?: CatalogPriceBounds
}

export const CATALOG_SORT_OPTIONS: CatalogSortOption[] = [
    { label: 'Сначала новые', value: 'id', order: 'desc' },
    { label: 'Название А-Я', value: 'name', order: 'asc' },
    { label: 'Название Я-А', value: 'name', order: 'desc' },
    { label: 'Цена по возрастанию', value: 'price', order: 'asc' },
    { label: 'Цена по убыванию', value: 'price', order: 'desc' },
    { label: 'Рейтинг выше', value: 'rating', order: 'desc' },
    { label: 'Остаток больше', value: 'stock', order: 'desc' },
] as const
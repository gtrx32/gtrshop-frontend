export const CATALOG_SORTS = ['id', 'name', 'price', 'stock', 'rating'] as const

export const CATALOG_SORT_ORDERS = ['asc', 'desc'] as const

export type CatalogViewMode = 'grid' | 'table'

export type CatalogSort = typeof CATALOG_SORTS[number]

export type CatalogSortOrder = typeof CATALOG_SORT_ORDERS[number]

export interface CatalogViewModeOption {
    label: string
    value: CatalogViewMode
}

export interface CatalogSortOption {
    label: string
    value: CatalogSort,
    order: CatalogSortOrder
}

export interface CatalogFilters {
    name: string
    price_min: number | null
    price_max: number | null
    in_stock: boolean
}

export interface CatalogFilterValues {
    price: {
        min: number | null
        max: number | null
    }
}

export interface CatalogQuery extends CatalogFilters {
    sort: CatalogSort,
    order: CatalogSortOrder,
    page: number,
    per_page: number,
}
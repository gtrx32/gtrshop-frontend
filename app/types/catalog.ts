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
    ratingMin: number | null
    ratingMax: number | null
    inStock: boolean
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

// todo: вернуть локальные типы в catalog/index.vue
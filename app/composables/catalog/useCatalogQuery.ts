import type {LocationQueryRaw} from "vue-router";
import {
    CATALOG_SORT_ORDERS,
    CATALOG_SORTS,
    type CatalogFilters, type CatalogQuery,
    type CatalogSort,
    type CatalogSortOption,
    type CatalogSortOrder
} from "~/types/catalog";

const DEFAULT_FILTERS: CatalogFilters = {
    name: '',
    price_min: null,
    price_max: null,
    in_stock: false
}

const DEFAULT_SORT: CatalogSort = 'id';
const DEFAULT_SORT_ORDER: CatalogSortOrder = 'desc';

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 15;
const PER_PAGE_OPTIONS = [6, 9, 12, 15];

const CATALOG_SORT_OPTIONS: CatalogSortOption[] = [
    {
        label: 'Сначала старые',
        value: 'id',
        order: 'asc'
    },
    {
        label: 'Сначала новые',
        value: 'id',
        order: 'desc'
    },
    {
        label: 'По названию А-Я',
        value: 'name',
        order: 'asc'
    },
    {
        label: 'По названию Я-А',
        value: 'name',
        order: 'desc'
    },
    {
        label: 'Сначала дешевле',
        value: 'price',
        order: 'asc'
    },
    {
        label: 'Сначала дороже',
        value: 'price',
        order: 'desc'
    },
    {
        label: 'С высоким рейтингом',
        value: 'rating',
        order: 'desc'
    },
    {
        label: 'Остаток больше',
        value: 'stock',
        order: 'desc'
    },
];

export function useCatalogQuery() {
    const route = useRoute();
    const router = useRouter();

    const filters = computed<CatalogFilters>(() => ({
        name: getString(route.query.name),
        price_min: getNumber(route.query.price_min),
        price_max: getNumber(route.query.price_max),
        in_stock: route.query.in_stock === '1',
    }))

    const sort = computed<CatalogSort>(() => {
        const value = getString(route.query.sort)
        return isValidCatalogSort(value) ? value : DEFAULT_SORT
    })

    const order = computed<CatalogSortOrder>(() => {
        const value = getString(route.query.order)
        return isValidCatalogSortOrder(value) ? value : DEFAULT_SORT_ORDER
    })

    const page = computed<number>(() => {
        return getPage(route.query.page)
    })

    const per_page = computed<number>(() => {
        return getPerPage(route.query.per_page)
    })

    const query = computed<CatalogQuery>(() => ({
        ...filters.value,
        sort: sort.value,
        order: order.value,
        page: page.value,
        per_page: per_page.value,
    }))

    function setFilters(value: CatalogFilters) {
        router.replace({
            query: normalizeQuery({
                ...route.query,
                name: value.name,
                price_min: value.price_min,
                price_max: value.price_max,
                in_stock: value.in_stock ? '1' : undefined,
                page: undefined,
            }),
        })
    }

    function setSort(option: CatalogSortOption) {
        router.replace({
            query: normalizeQuery({
                ...route.query,
                sort: option.value,
                order: option.order,
                page: undefined,
            }),
        })
    }

    function setPage(value: number) {
        router.push({
            query: normalizeQuery({
                ...route.query,
                page: value,
            }),
        })
    }

    function setPerPage(value: number) {
        router.replace({
            query: normalizeQuery({
                ...route.query,
                per_page: value,
                page: undefined,
            }),
        })
    }

    function resetFilters() {
        setFilters({ ...DEFAULT_FILTERS })
    }

    return {
        filters,
        sort,
        order,
        page,
        per_page,
        query,
        sortOptions: CATALOG_SORT_OPTIONS,
        perPageOptions: PER_PAGE_OPTIONS,
        setFilters,
        setSort,
        setPage,
        setPerPage,
        resetFilters,
    }
}

function getString(value: unknown): string {
    return typeof value === 'string' ? value : ''
}

function getNumber(value: unknown): number | null {
    if (typeof value !== 'string' || value === '') {
        return null
    }

    const number = Number(value)

    return Number.isFinite(number) ? number : null
}

function getPage(value: unknown): number {
    if (typeof value !== 'string') {
        return DEFAULT_PAGE
    }

    const page = Number(value)

    return Number.isInteger(page) && page > 0 ? page : DEFAULT_PAGE
}

function getPerPage(value: unknown): number {
    if (typeof value !== 'string') {
        return DEFAULT_PER_PAGE
    }

    const per_page = Number(value)

    return PER_PAGE_OPTIONS.includes(per_page) ? per_page : DEFAULT_PER_PAGE
}

function isValidCatalogSort(value: unknown): value is CatalogSort {
    return typeof value === 'string' && CATALOG_SORTS.includes(value as CatalogSort);
}

function isValidCatalogSortOrder(value: unknown): value is CatalogSortOrder {
    return typeof value === 'string' && CATALOG_SORT_ORDERS.includes(value as CatalogSortOrder)
}

function normalizeQuery(query: LocationQueryRaw): LocationQueryRaw {
    const result: LocationQueryRaw = {}

    for (const key in query) {
        const value = query[key]

        if (value === undefined) continue
        if (value === null) continue
        if (value === '') continue

        result[key] = value
    }

    return result
}
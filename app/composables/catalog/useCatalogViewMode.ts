import type {
    CatalogViewMode,
    CatalogViewModeOption,
} from '~/types/catalog'

const DEFAULT_VIEW_MODE: CatalogViewMode = 'grid'

const VIEW_MODE_OPTIONS: CatalogViewModeOption[] = [
    {
        label: 'Сетка',
        value: 'grid',
    },
    {
        label: 'Таблица',
        value: 'table',
    },
]

export function useCatalogViewMode() {
    const viewMode = useCookie<CatalogViewMode>('catalog-view-mode', {
        default: () => DEFAULT_VIEW_MODE,
    })

    function setViewMode(value: CatalogViewMode) {
        viewMode.value = value
    }

    return {
        viewMode,
        viewModeOptions: VIEW_MODE_OPTIONS,
        setViewMode,
    }
}
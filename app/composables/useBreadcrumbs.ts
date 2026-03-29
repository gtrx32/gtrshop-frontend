import {computed} from 'vue'

export interface BreadcrumbItem {
  label: string
  to?: string
}

export function useBreadcrumbs() {
  const store = useState<BreadcrumbItem[]>('breadcrumbs', () => [])

  function setBreadcrumbs(items: BreadcrumbItem[]) {
    store.value = items
  }

  const breadcrumbs = computed(() => {
    if (!store.value.length) return []

    const items: BreadcrumbItem[] = [
      {label: 'Главная', to: '/'},
      ...store.value,
    ]

    const lastItem = items[items.length - 1]
    if (lastItem) {
      items[items.length - 1] = {
        label: lastItem.label,
        to: undefined,
      }
    }

    return items
  })

  return {
    breadcrumbs,
    setBreadcrumbs,
  }
}

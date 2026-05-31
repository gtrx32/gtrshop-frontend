import type { Order } from '~/types/order'

export const useOrderItem = async () => {
    const api = useApi()
    const route = useRoute()

    const id = computed(() => String(route.params.id))

    const {
        data,
        pending,
        error,
        refresh,
    } = await useAsyncData(
        () => `profile:orders:show:${id.value}`,
        () => api<Order>(`api/orders/${id.value}`),
        { watch: [id] }
    )

    const order = computed(() => data.value)

    return {
        order,
        pending,
        error,
        refresh,
    }
}
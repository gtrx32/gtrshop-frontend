import type { Order } from '~/types/order'

export const useOrderList = () => {
    const api = useApi()

    const {
        data: orders,
        pending,
        error,
        refresh,
    } = useAsyncData(
        'profile:orders',
        () => api<Order[]>('/api/orders'),
        {
            default: () => [],
        },
    )

    return {
        orders,
        pending,
        error,
        refresh,
    }
}
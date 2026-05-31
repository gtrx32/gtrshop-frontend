import type { Order, StoreOrderPayload } from '~/types/order'

export const useOrderApi = () => {
    const api = useApi()

    const storeOrder = async (payload: StoreOrderPayload) => {
        return await api<Order>('/api/orders', {
            method: 'POST',
            body: payload,
        })
    }

    const cancelOrder = async (id: number | string) => {
        return await api(`/api/orders/${id}/cancel`, {
            method: 'PATCH',
        })
    }

    return {
        storeOrder,
        cancelOrder,
    }
}
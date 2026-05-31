import type { Order, StoreOrderPayload } from '~/types/order'

export const useOrderApi = () => {
    const api = useApi()

    const storeOrder = async (payload: StoreOrderPayload) => {
        return await api<Order>('/api/orders', {
            method: 'POST',
            body: payload,
        })
    }

    return { storeOrder }
}
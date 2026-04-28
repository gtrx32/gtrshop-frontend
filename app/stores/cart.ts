import type { Cart } from '~/types/cart'

export const useCartStore = defineStore('cart', () => {
    const api = useApi()

    const cart = ref<Cart | null>(null)
    const loaded = ref(false)
    const pending = ref(false)
    const pendingProductId = ref<number | null>(null)

    const loadCart = async () => {
        if (loaded.value) return cart.value

        pending.value = true

        try {
            cart.value = await api<Cart>('/api/cart', {
                method: 'GET',
            })

            loaded.value = true

            return cart.value
        } finally {
            pending.value = false
        }
    }

    const addToCart = async (productId: number, quantity = 1) => {
        if (pendingProductId.value === productId) return cart.value

        pendingProductId.value = productId

        try {
            cart.value = await api<Cart>('/api/cart/add', {
                method: 'POST',
                body: {
                    product_id: productId,
                    quantity,
                },
            })

            loaded.value = true

            return cart.value
        } finally {
            pendingProductId.value = null
        }
    }

    const removeFromCart = async (productId: number, quantity?: number) => {
        if (pendingProductId.value === productId) return cart.value

        pendingProductId.value = productId

        try {
            cart.value = await api<Cart>('/api/cart/remove', {
                method: 'POST',
                body: {
                    product_id: productId,
                    quantity,
                },
            })

            loaded.value = true

            return cart.value
        } finally {
            pendingProductId.value = null
        }
    }

    const clearCart = () => {
        cart.value = null
        loaded.value = false
        pending.value = false
        pendingProductId.value = null
    }

    const isProductPending = (productId: number) => {
        return pendingProductId.value === productId
    }

    return {
        cart,
        loaded,
        pending,
        pendingProductId,
        loadCart,
        addToCart,
        removeFromCart,
        isProductPending,
        clearCart,
    }
})
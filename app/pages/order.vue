<script lang="ts" setup>
import type { StoreOrderPayload } from '~/types/order'
import OrderItems from '~/components/orders/OrderItems.vue'
import OrderForm from '~/components/orders/OrderForm.vue'

type OrderFormPayload = Pick<StoreOrderPayload, 'delivery' | 'comment'>

definePageMeta({
  middleware: 'auth',
})

const cartStore = useCartStore()
const toast = useToast()
const { storeOrder } = useOrderApi()

await cartStore.loadCart()

const products = computed(() => {
  return cartStore.cart?.products ?? []
})

const quantity = computed(() => {
  return cartStore.cart?.total_quantity ?? 0
})

const total = computed(() => {
  return cartStore.cart?.total_price ?? 0
})

const hasItems = computed(() => {
  return quantity.value > 0
})

const pending = ref(false)

const submitOrder = async (payload: OrderFormPayload) => {
  if (!hasItems.value || pending.value) {
    return
  }

  pending.value = true

  try {
    const order = await storeOrder({
      items: products.value.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
      delivery: payload.delivery,
      comment: payload.comment,
    })

    cartStore.clearCart()

    toast.add({
      title: 'Заказ оформлен',
      description: 'Мы свяжемся с вами для подтверждения',
      color: 'success',
    })

    await navigateTo(`/profile/orders/${order.id}`)
  } catch {
    toast.add({
      title: 'Ошибка оформления',
      description: 'Попробуйте позже',
      color: 'error',
    })
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <div
      v-if="hasItems"
      class="flex flex-col gap-6"
  >
    <heading
        title="Оформление заказа"
        breadcrumbs
    />

    <OrderItems
        :items="products"
        :quantity="quantity"
        :total="total"
    />

    <OrderForm
        :loading="pending"
        @submit="submitOrder"
    />
  </div>

  <CartEmpty v-else />
</template>
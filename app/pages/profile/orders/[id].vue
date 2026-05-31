<script lang="ts" setup>
import { useOrderItem } from '~/composables/orders/useOrderItem'
import OrderItems from '~/components/orders/OrderItems.vue'
import OrderInfo from '~/components/orders/OrderInfo.vue'

definePageMeta({
  middleware: 'auth',
})

const {
  order,
  pending,
  error,
  refresh,
} = await useOrderItem()

const toast = useToast()
const { cancelOrder } = useOrderApi()

const cancelLoading = ref(false)

const { setBreadcrumbs } = useBreadcrumbs()

watch(
    () => order.value?.id,
    (id) => {
      setBreadcrumbs([
        { label: 'Профиль', to: '/profile' },
        { label: 'Мои заказы', to: '/profile/orders' },
        { label: id ? `Заказ №${id}` : 'Заказ' },
      ])
    },
    { immediate: true }
)

const products = computed(() => {
  return order.value?.products ?? []
})

const cancel = async () => {
  if (!order.value || cancelLoading.value) {
    return
  }

  cancelLoading.value = true

  try {
    await cancelOrder(order.value.id)
    await refresh()

    toast.add({
      title: 'Заказ отменен',
      color: 'success',
    })
  } catch {
    toast.add({
      title: 'Не удалось отменить заказ',
      description: 'Попробуйте позже',
      color: 'error',
    })
  } finally {
    cancelLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <heading
        :title="order ? `Заказ №${order.id}` : 'Заказ'"
        breadcrumbs
    />

    <spinner v-if="pending" />

    <div
        v-else-if="error || !order"
        class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gtr-soft px-6 py-16 text-center"
    >
      <div class="text-2xl font-medium text-gtr-base">
        Не удалось загрузить заказ
      </div>

      <u-button
          class="mt-5"
          variant="ghost"
          size="xl"
          @click="refresh"
      >
        Повторить
      </u-button>
    </div>

    <template v-else>
      <OrderInfo
          :order="order"
          :cancel-loading="cancelLoading"
          @cancel="cancel"
      />

      <OrderItems
          :items="products"
          :quantity="order.total_quantity"
          :total="order.total_price"
          title="Состав заказа"
      />

      <div class="flex justify-start">
        <u-button
            to="/profile/orders"
            icon="mdi:arrow-left"
            variant="ghost"
            size="xl"
        >
          Назад к заказам
        </u-button>
      </div>
    </template>
  </div>
</template>
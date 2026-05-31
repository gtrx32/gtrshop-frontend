<script lang="ts" setup>
import OrderList from '~/components/orders/OrderList.vue'
import { useOrderList } from '~/composables/orders/useOrderList'

definePageMeta({
  middleware: 'auth',
})

const { setBreadcrumbs } = useBreadcrumbs()

setBreadcrumbs([
  { label: 'Профиль', to: '/profile' },
  { label: 'Мои заказы' },
])

const {
  orders,
  pending,
  error,
  refresh,
} = useOrderList()

const hasOrders = computed(() => {
  return orders.value.length > 0
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <heading
        title="Мои заказы"
        breadcrumbs
    />

    <spinner v-if="pending" />

    <div
        v-else-if="error"
        class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gtr-soft px-6 py-16 text-center"
    >
      <div class="text-2xl font-medium text-gtr-base">
        Не удалось загрузить заказы
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

    <OrderList
        v-else-if="hasOrders"
        :orders="orders"
    />

    <div
        v-else
        class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gtr-soft px-6 py-16 text-center"
    >
      <div class="text-2xl font-medium text-gtr-base">
        Заказов пока нет
      </div>

      <div class="mt-2 max-w-md text-gtr-toned">
        Когда вы оформите заказ, он появится на этой странице.
      </div>

      <u-button
          to="/catalog"
          class="mt-5"
          variant="ghost"
          size="xl"
      >
        Перейти в каталог
      </u-button>
    </div>
  </div>
</template>
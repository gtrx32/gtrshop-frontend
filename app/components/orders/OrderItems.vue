<script lang="ts" setup>
import type { CartItem } from '~/types/cart'
import type { OrderItem as OrderItemType } from '~/types/order'
import OrderItem from '~/components/orders/OrderItem.vue'

defineProps<{
  items: CartItem[] | OrderItemType[]
  quantity: number
  total: number
  title?: string
}>()
</script>

<template>
  <div class="rounded-xl border border-gtr-soft bg-gtr-pale p-4 sm:p-6">
    <div class="flex items-center justify-between gap-4">
      <div class="text-2xl font-semibold text-gtr-base">
        {{ title ?? 'Товары в заказе' }}
      </div>

      <div class="text-gtr-muted">
        {{ quantity }} шт.
      </div>
    </div>

    <div class="mt-6 flex flex-col divide-y divide-gtr-soft">
      <OrderItem
          v-for="item in items"
          :key="item.product.id"
          :item="item"
      />
    </div>

    <div class="mt-6 flex items-center justify-between gap-4 border-t border-gtr-soft pt-6">
      <div class="text-lg font-semibold text-gtr-base">
        Итого
      </div>

      <div class="whitespace-nowrap text-2xl font-semibold leading-none text-gtr-base">
        {{ formatPrice(total) }}
      </div>
    </div>
  </div>
</template>
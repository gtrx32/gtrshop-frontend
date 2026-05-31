<script lang="ts" setup>
import type { Order } from '~/types/order'
import OrderCard from '~/components/orders/OrderCard.vue'

defineProps<{
  orders: Order[]
}>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <OrderCard
        v-for="order in orders"
        :key="order.id"
        :order="order"
    />
  </div>
</template>
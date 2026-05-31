<script lang="ts" setup>
import type { Order } from '~/types/order'

const props = defineProps<{
  order: Order
}>()

const products = computed(() => {
  return props.order.products ?? []
})

const previewProducts = computed(() => {
  return products.value.slice(0, 4)
})

const hiddenProductsCount = computed(() => {
  return Math.max(products.value.length - previewProducts.value.length, 0)
})

const statusTitle = computed(() => {
  return getOrderStatusTitle(props.order.status)
})

const statusClass = computed(() => {
  return getOrderStatusClass(props.order.status)
})
</script>

<template>
  <nuxt-link
      :to="`/profile/orders/${order.id}`"
      class="group block rounded-xl border border-gtr-soft bg-gtr-pale p-4 transition duration-200 hover:bg-gtr-fade/30 hover:shadow-[0_0_15px_0_var(--color-gtr-accent)] sm:p-5"
  >
    <div class="flex flex-col gap-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-3">
            <div class="text-xl font-semibold leading-tight text-gtr-base sm:text-2xl">
              Заказ №{{ order.id }}
            </div>

            <div
                class="rounded-full border px-3 py-1 text-sm"
                :class="statusClass"
            >
              {{ statusTitle }}
            </div>
          </div>

          <div class="mt-2 text-sm text-gtr-muted">
            {{ formatDate(order.created_at) }}
          </div>
        </div>

        <div class="whitespace-nowrap text-2xl font-semibold leading-none text-gtr-base sm:text-3xl">
          {{ formatPrice(order.total_price) }}
        </div>
      </div>

      <div class="border-y border-gtr-soft py-4">
        <div
            v-if="previewProducts.length"
            class="flex flex-wrap items-center gap-3"
        >
          <div
              v-for="item in previewProducts"
              :key="item.product.id"
              class="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gtr-fade sm:h-24 sm:w-24"
              :title="item.product.name"
          >
            <img
                :src="item.product.image ?? ''"
                :alt="item.product.name"
                class="h-full w-full object-cover"
            >

            <div class="absolute bottom-1.5 right-1.5 rounded-md bg-gtr-pale/90 px-2 py-0.5 text-sm font-medium text-gtr-base shadow-sm">
              ×{{ item.quantity }}
            </div>
          </div>

          <div
              v-if="hiddenProductsCount"
              class="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-gtr-fade text-lg font-medium text-gtr-muted sm:h-24 sm:w-24"
          >
            +{{ hiddenProductsCount }}
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between gap-4">
        <div class="text-sm text-gtr-muted">
          Нажмите, чтобы открыть заказ
        </div>

        <u-icon
            name="mdi:chevron-right"
            class="text-2xl text-gtr-muted transition duration-200 group-hover:translate-x-1 group-hover:text-gtr-base"
        />
      </div>
    </div>
  </nuxt-link>
</template>
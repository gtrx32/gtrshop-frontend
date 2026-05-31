<script lang="ts" setup>
import type { CartItem } from '~/types/cart'

defineProps<{
  item: CartItem
}>()
</script>

<template>
  <div class="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
    <nuxt-link
        :to="`/catalog/${item.product.slug}`"
        class="h-60 w-full shrink-0 overflow-hidden rounded-lg bg-gtr-fade sm:h-auto sm:w-32"
    >
      <img
          :src="item.product.image ?? ''"
          :alt="item.product.name"
          class="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
      >
    </nuxt-link>

    <div class="min-w-0 flex-1">
      <nuxt-link
          :to="`/catalog/${item.product.slug}`"
          class="line-clamp-2 text-lg font-medium leading-tight text-gtr-base hover:text-gtr-toned"
      >
        {{ item.product.name }}
      </nuxt-link>

      <div class="mt-2 text-sm text-gtr-muted">
        {{ item.quantity }} × {{ formatPrice(item.price) }}
      </div>
    </div>

    <div class="whitespace-nowrap text-xl font-medium text-gtr-base sm:text-right">
      {{ formatPrice(item.total) }}
    </div>
  </div>
</template>
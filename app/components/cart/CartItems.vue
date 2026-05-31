<script lang="ts" setup>
import type {CartItem} from '~/types/cart'

defineProps<{
  items: CartItem[]
}>()
</script>

<template>
  <div class="flex w-full flex-col gap-3">
    <CartItem
        v-for="item in items"
        :key="item.product.id"
        :item="item"
    />
  </div>
</template>
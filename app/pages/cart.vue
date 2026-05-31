<script lang="ts" setup>
import CartItems from "~/components/cart/CartItems.vue";

definePageMeta({
  middleware: 'auth',
})

const cartStore = useCartStore()
const products = computed(() => cartStore.cart?.products ?? [])
</script>

<template>
  <div v-if="products.length" class="flex flex-col lg:flex-row gap-6 lg:items-start">
    <div class="flex-1 flex flex-col gap-6">
      <CartItems :items="products"></CartItems>
      <CartBenefits></CartBenefits>
    </div>
    <CartSummary ></CartSummary>
  </div>
  <div v-else class="flex-1 flex flex-col">
    <CartEmpty></CartEmpty>
  </div>
</template>
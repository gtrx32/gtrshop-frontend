<script setup lang="ts">
interface CartAddButtonProps {
  productId: number
  stock: number
}

const props = defineProps<CartAddButtonProps>()

const cartStore = useCartStore()

const quantity = computed(() => {
  return cartStore.cart?.products?.find(item => item.product.id === props.productId)?.quantity ?? 0
})

const isInCart = computed(() => quantity.value > 0)
const isPending = computed(() => cartStore.isProductPending(props.productId))
const isOutOfStock = computed(() => props.stock <= 0)

const add = async () => {
  if (isPending.value || isOutOfStock.value || quantity.value >= props.stock) return
  await cartStore.addToCart(props.productId)
}

const remove = async () => {
  if (isPending.value || !isInCart.value) return
  await cartStore.removeFromCart(props.productId, 1)
}

const goToCart = async () => {
  await navigateTo('/cart')
}
</script>

<template>
  <u-button
      v-if="!isInCart"
      variant="ghost"
      size="md"
      block
      :class="{ 'opacity-30! cursor-not-allowed': isOutOfStock }"
      :loading="isPending"
      :disabled="isOutOfStock"
      @click.prevent.stop="add"
  >
    Добавить
  </u-button>

  <div
      v-else
      class="flex w-full min-w-0 items-stretch gap-2"
      @click.prevent.stop
  >
    <u-button
        variant="ghost"
        size="md"
        class="w-15 shrink-0"
        :loading="isPending"
        @click.prevent.stop="remove"
    >
      <u-icon
          v-if="!isPending"
          name="mdi:minus"
          class="text-lg"
      />
    </u-button>

    <u-button
        variant="ghost"
        size="md"
        class="min-w-14 flex-1"
        @click.prevent.stop="goToCart"
    >
      <u-icon
          name="mdi:cart-outline"
          class="text-lg"
      />

      <span>{{ quantity }}</span>
    </u-button>

    <u-button
        variant="ghost"
        size="md"
        class="w-15 shrink-0"
        :class="{ 'opacity-30! cursor-not-allowed': quantity >= stock }"
        :loading="isPending"
        :disabled="quantity >= stock"
        @click.prevent.stop="add"
    >
      <u-icon
          v-if="!isPending"
          name="mdi:plus"
          class="text-lg"
      />
    </u-button>
  </div>
</template>
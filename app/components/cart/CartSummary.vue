<script setup lang="ts">
const cartStore = useCartStore()

const itemsCount = computed(() => {
  return cartStore.cart?.products?.length ?? 0
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
</script>

<template>
  <div class="w-full self-start rounded-xl border border-gtr-soft bg-gtr-pale p-6 shadow-sm shadow-gtr-soft lg:w-80 lg:shrink-0 xl:sticky xl:top-24">
    <div class="flex items-center justify-between gap-4">
      <div class="text-2xl font-semibold text-gtr-base">
        Ваш заказ
      </div>

      <icon
          name="mdi:cart-outline"
          class="shrink-0 text-2xl text-gtr-muted"
      />
    </div>

    <div class="mt-6 flex flex-col gap-3 text-base">
      <div class="flex items-center justify-between gap-4">
        <span class="text-gtr-toned">
          Позиций
        </span>

        <span class="font-medium text-gtr-base">
          {{ itemsCount }}
        </span>
      </div>

      <div class="flex items-center justify-between gap-4">
        <span class="text-gtr-toned">
          Товаров
        </span>

        <span class="font-medium text-gtr-base">
          {{ quantity }}
        </span>
      </div>
    </div>

    <div class="my-6 h-px bg-gtr-soft" />

    <div class="flex items-center justify-between gap-4">
  <span class="text-lg font-semibold text-gtr-base">
    Итого
  </span>

      <span class="whitespace-nowrap text-2xl font-semibold leading-none text-gtr-base">
    {{ formatPrice(total) }}
  </span>
    </div>

    <div class="mt-7 flex flex-col gap-3">
      <u-button
          to="/order"
          block
          variant="ghost"
          size="xl"
          :disabled="!hasItems"
          :class="{ 'opacity-30! cursor-not-allowed': !hasItems }"
      >
        Оформить заказ
      </u-button>

      <u-button
          to="/catalog"
          block
          variant="ghost"
          size="xl"
      >
        Продолжить покупки
      </u-button>
    </div>
  </div>
</template>
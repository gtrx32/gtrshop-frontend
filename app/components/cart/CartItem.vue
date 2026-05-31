<script lang="ts" setup>
import type {CartItem} from '~/types/cart'

const props = defineProps<{
  item: CartItem
}>()

const cartStore = useCartStore()

const pending = computed(() => {
  return cartStore.isProductPending(props.item.product.id)
})

const add = async () => {
  if (pending.value || props.item.quantity >= props.item.product.stock) {
    return
  }

  await cartStore.addToCart(props.item.product.id)
}

const remove = async () => {
  if (pending.value) {
    return
  }

  await cartStore.removeFromCart(props.item.product.id, 1)
}

const removeAll = async () => {
  if (pending.value) {
    return
  }

  await cartStore.removeFromCart(props.item.product.id)
}
</script>

<template>
  <div class="w-full rounded-lg border border-gtr-soft bg-gtr-pale p-4 sm:p-5">
    <div class="flex flex-col gap-4 sm:min-h-32 sm:flex-row sm:gap-5">
      <nuxt-link
          :to="`/catalog/${item.product.slug}`"
          class="h-44 w-full shrink-0 overflow-hidden rounded-lg bg-gtr-fade sm:h-auto sm:w-32"
      >
        <img
            :src="item.product.image ?? ''"
            :alt="item.product.name"
            class="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
        >
      </nuxt-link>

      <div class="flex min-w-0 flex-1 flex-col">
        <nuxt-link
            :to="`/catalog/${item.product.slug}`"
            class="line-clamp-2 text-lg font-medium leading-tight text-gtr-base hover:text-gtr-toned sm:text-xl"
        >
          {{ item.product.name }}
        </nuxt-link>

        <div class="mt-1 text-sm text-gtr-muted">
          В наличии {{ item.product.stock }} шт.
        </div>

        <div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 sm:mt-auto sm:pt-4">
          <div class="whitespace-nowrap text-sm text-gtr-muted">
            {{ formatPrice(item.price) }} за шт.
          </div>

          <div class="flex items-stretch gap-2">
            <u-button
                variant="ghost"
                size="sm"
                class="h-9 w-11 shrink-0 justify-center"
                :loading="pending"
                @click="remove"
            >
              <u-icon
                  v-if="!pending"
                  name="mdi:minus"
                  class="text-lg"
              />
            </u-button>

            <div class="flex min-w-10 items-center justify-center text-lg font-medium text-gtr-base">
              {{ item.quantity }}
            </div>

            <u-button
                variant="ghost"
                size="sm"
                class="h-9 w-11 shrink-0 justify-center"
                :loading="pending"
                :disabled="item.quantity >= item.product.stock"
                :class="{ 'opacity-30! cursor-not-allowed': item.quantity >= item.product.stock }"
                @click="add"
            >
              <u-icon
                  v-if="!pending"
                  name="mdi:plus"
                  class="text-lg"
              />
            </u-button>
          </div>
        </div>
      </div>

      <div class="flex w-full items-end justify-between gap-4 sm:w-36 sm:shrink-0 sm:flex-col sm:items-end">
        <u-button
            variant="ghost"
            size="sm"
            color="error"
            icon="mdi:trash-can-outline"
            :loading="pending"
            @click="removeAll"
        >
          Удалить
        </u-button>

        <div class="order-first sm:order-none sm:mt-auto sm:text-right">
          <div class="text-sm text-gtr-muted">
            Итого
          </div>

          <div class="mt-1 whitespace-nowrap text-xl font-medium leading-none text-gtr-base sm:text-2xl">
            {{ formatPrice(item.total) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
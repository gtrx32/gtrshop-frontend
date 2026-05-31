<script lang="ts" setup>
import type { Order } from '~/types/order'

const props = defineProps<{
  order: Order
  cancelLoading?: boolean
}>()

const emit = defineEmits<{
  cancel: []
}>()

const confirmOpen = ref(false)

const paymentStatusTitles: Record<string, string> = {
  pending: 'Ожидание',
  paid: 'Оплачено',
  failed: 'Ошибка',
}

const deliveryStatusTitles: Record<string, string> = {
  pending: 'Ожидание',
  shipped: 'Отправлено',
  delivered: 'Доставлено',
  cancelled: 'Отменено',
}

const statusTitle = computed(() => {
  return getOrderStatusTitle(props.order.status)
})

const statusClass = computed(() => {
  return getOrderStatusClass(props.order.status)
})

const paymentStatus = computed(() => {
  const status = props.order.payment?.status

  return status ? paymentStatusTitles[status] ?? status : '—'
})

const deliveryStatus = computed(() => {
  const status = props.order.delivery?.status

  return status ? deliveryStatusTitles[status] ?? status : '—'
})

const canCancel = computed(() => {
  return props.order.status !== 'cancelled'
})

const openCancelConfirm = () => {
  if (!canCancel.value || props.cancelLoading) {
    return
  }

  confirmOpen.value = true
}

const confirmCancel = () => {
  if (!canCancel.value || props.cancelLoading) {
    return
  }

  emit('cancel')
}

watch(
    () => props.order.status,
    (status) => {
      if (status === 'cancelled') {
        confirmOpen.value = false
      }
    }
)
</script>

<template>
  <div class="rounded-xl border border-gtr-soft bg-gtr-pale p-4 sm:p-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div class="text-2xl font-semibold text-gtr-base">
          Заказ №{{ order.id }}
        </div>

        <div class="mt-2 text-sm text-gtr-muted">
          {{ formatDate(order.created_at) }}
        </div>
      </div>

      <div
          class="self-start rounded-full border px-3 py-1 text-sm"
          :class="statusClass"
      >
        {{ statusTitle }}
      </div>
    </div>

    <div class="mt-6 border-t border-gtr-soft pt-6">
      <div class="text-lg font-semibold text-gtr-base">
        Информация о заказе
      </div>

      <div class="mt-4 flex flex-col gap-3">
        <div class="flex items-center justify-between gap-4">
          <div class="text-gtr-muted">
            Оплата
          </div>

          <div class="font-medium text-gtr-base">
            {{ paymentStatus }}
          </div>
        </div>

        <div class="flex items-center justify-between gap-4">
          <div class="text-gtr-muted">
            Доставка
          </div>

          <div class="font-medium text-gtr-base">
            {{ deliveryStatus }}
          </div>
        </div>

        <div class="flex items-center justify-between gap-4">
          <div class="text-gtr-muted">
            Сумма заказа
          </div>

          <div class="whitespace-nowrap text-xl font-semibold text-gtr-base">
            {{ formatPrice(order.total_price) }}
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 border-t border-gtr-soft pt-6">
      <div class="text-lg font-semibold text-gtr-base">
        Данные доставки
      </div>

      <div class="mt-4 flex flex-col gap-3">
        <div class="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
          <div class="text-gtr-muted">
            Получатель
          </div>

          <div class="text-gtr-base sm:text-right">
            {{ order.delivery?.recipient_name ?? '—' }}
          </div>
        </div>

        <div class="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
          <div class="text-gtr-muted">
            Телефон
          </div>

          <div class="text-gtr-base sm:text-right">
            {{ order.delivery?.phone ?? '—' }}
          </div>
        </div>

        <div class="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
          <div class="text-gtr-muted">
            Email
          </div>

          <div class="text-gtr-base sm:text-right">
            {{ order.delivery?.email ?? '—' }}
          </div>
        </div>

        <div class="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
          <div class="text-gtr-muted">
            Адрес
          </div>

          <div class="text-gtr-base sm:text-right">
            {{ order.delivery?.address ?? '—' }}
          </div>
        </div>
      </div>
    </div>

    <div
        v-if="order.comment"
        class="mt-6 border-t border-gtr-soft pt-6"
    >
      <div class="text-lg font-semibold text-gtr-base">
        Комментарий
      </div>

      <div class="mt-2 text-gtr-toned">
        {{ order.comment }}
      </div>
    </div>

    <div
        v-if="canCancel"
        class="mt-6 flex justify-end border-t border-gtr-soft pt-6"
    >
      <u-button
          variant="ghost"
          color="error"
          size="xl"
          icon="mdi:close-circle-outline"
          :loading="cancelLoading"
          :disabled="cancelLoading"
          @click="openCancelConfirm"
      >
        Отменить заказ
      </u-button>
    </div>

    <u-modal
        v-model:open="confirmOpen"
        title="Отменить заказ?"
        description="После отмены заказ нельзя будет вернуть в работу."
        class="max-w-lg"
    >
      <template #body>
        <div class="flex flex-col gap-5">
          <div class="rounded-lg border border-gtr-error/40 bg-gtr-error/10 p-4 text-gtr-base">
            Вы действительно хотите отменить заказ №{{ order.id }}?
          </div>

          <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <u-button
                type="button"
                variant="ghost"
                :disabled="cancelLoading"
                @click="confirmOpen = false"
            >
              Не отменять
            </u-button>

            <u-button
                type="button"
                variant="ghost"
                color="error"
                :loading="cancelLoading"
                :disabled="cancelLoading"
                @click="confirmCancel"
            >
              Отменить заказ
            </u-button>
          </div>
        </div>
      </template>
    </u-modal>
  </div>
</template>
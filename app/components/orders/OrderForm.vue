<script lang="ts" setup>
import { z } from 'zod'
import type { StoreOrderPayload } from '~/types/order'

type OrderFormPayload = Pick<StoreOrderPayload, 'delivery' | 'comment'>

defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: OrderFormPayload]
}>()

const { user } = useAuth()

const form = reactive<OrderFormPayload>({
  delivery: {
    recipient_name: '',
    phone: '',
    email: '',
    address: '',
  },
  comment: '',
})

const errors = reactive({
  recipient_name: '',
  phone: '',
  email: '',
  address: '',
  comment: '',
})

const schema = z.object({
  delivery: z.object({
    recipient_name: z.string().trim().min(1, 'Введите имя получателя'),
    phone: z.string().trim().min(1, 'Введите номер телефона'),
    email: z.string().trim().email('Некорректный email'),
    address: z.string().trim().min(1, 'Введите адрес доставки'),
  }),
  comment: z.string().trim().max(1000, 'Максимум 1000 символов').optional().nullable(),
})

const clearErrors = () => {
  errors.recipient_name = ''
  errors.phone = ''
  errors.email = ''
  errors.address = ''
  errors.comment = ''
}

const validate = () => {
  clearErrors()

  const result = schema.safeParse(form)

  if (!result.success) {
    result.error.issues.forEach(err => {
      const key = err.path[err.path.length - 1] as keyof typeof errors
      errors[key] = err.message
    })

    return false
  }

  return true
}

const submit = () => {
  if (!validate()) {
    return
  }

  emit('submit', {
    delivery: {
      recipient_name: form.delivery.recipient_name.trim(),
      phone: form.delivery.phone.trim(),
      email: form.delivery.email.trim(),
      address: form.delivery.address.trim(),
    },
    comment: form.comment?.trim() || null,
  })
}

watchEffect(() => {
  if (user.value) {
    form.delivery.recipient_name = user.value.name ?? ''
    form.delivery.email = user.value.email ?? ''
  }
})
</script>

<template>
  <div class="rounded-xl border border-gtr-soft bg-gtr-pale p-4 sm:p-6">
    <div class="text-2xl font-semibold text-gtr-base">
      Данные доставки
    </div>

    <div class="mt-6 flex flex-col gap-6">
      <div class="flex flex-col gap-2">
        <label>Получатель</label>

        <u-input
            v-model="form.delivery.recipient_name"
            :ui="{ base: `rounded-none border-b border-gtr-toned focus:border-gtr-highlight ring-0 focus-visible:ring-0 text-md ${errors.recipient_name ? 'border-red-500' : ''}` }"
            @update:model-value="errors.recipient_name = ''"
        />

        <p
            v-if="errors.recipient_name"
            class="text-sm text-red-500"
        >
          {{ errors.recipient_name }}
        </p>
      </div>

      <div class="flex flex-col gap-2">
        <label>Номер телефона</label>

        <u-input
            v-model="form.delivery.phone"
            :ui="{ base: `rounded-none border-b border-gtr-toned focus:border-gtr-highlight ring-0 focus-visible:ring-0 text-md ${errors.phone ? 'border-red-500' : ''}` }"
            @update:model-value="errors.phone = ''"
        />

        <p
            v-if="errors.phone"
            class="text-sm text-red-500"
        >
          {{ errors.phone }}
        </p>
      </div>

      <div class="flex flex-col gap-2">
        <label>Электронная почта</label>

        <u-input
            v-model="form.delivery.email"
            :ui="{ base: `rounded-none border-b border-gtr-toned focus:border-gtr-highlight ring-0 focus-visible:ring-0 text-md ${errors.email ? 'border-red-500' : ''}` }"
            @update:model-value="errors.email = ''"
        />

        <p
            v-if="errors.email"
            class="text-sm text-red-500"
        >
          {{ errors.email }}
        </p>
      </div>

      <div class="flex flex-col gap-2">
        <label>Адрес доставки</label>

        <u-input
            v-model="form.delivery.address"
            :ui="{ base: `rounded-none border-b border-gtr-toned focus:border-gtr-highlight ring-0 focus-visible:ring-0 text-md ${errors.address ? 'border-red-500' : ''}` }"
            @update:model-value="errors.address = ''"
        />

        <p
            v-if="errors.address"
            class="text-sm text-red-500"
        >
          {{ errors.address }}
        </p>
      </div>

      <div class="flex flex-col gap-2">
        <label>Комментарий</label>

        <u-textarea
            v-model="form.comment"
            :ui="{ base: `rounded-none border-b border-gtr-toned focus:border-gtr-highlight ring-0 focus-visible:ring-0 text-md ${errors.comment ? 'border-red-500' : ''}` }"
            @update:model-value="errors.comment = ''"
        />

        <p
            v-if="errors.comment"
            class="text-sm text-red-500"
        >
          {{ errors.comment }}
        </p>
      </div>
    </div>

    <div class="mt-8 flex justify-center">
      <u-button
          variant="ghost"
          size="xl"
          class="min-w-56 px-6"
          :loading="loading"
          :disabled="loading"
          :class="{ 'opacity-30! cursor-not-allowed': loading }"
          @click="submit"
      >
        Подтвердить заказ
      </u-button>
    </div>
  </div>
</template>
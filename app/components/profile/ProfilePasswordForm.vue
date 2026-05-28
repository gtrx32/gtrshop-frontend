<script setup lang="ts">
interface ProfilePasswordFormProps {
  currentPassword: string
  password: string
  passwordConfirmation: string
  errors: {
    current_password: string
    password: string
    password_confirmation: string
  }
  pending?: boolean
}

defineProps<ProfilePasswordFormProps>()

const emit = defineEmits<{
  'update:current-password': [value: string]
  'update:password': [value: string]
  'update:password-confirmation': [value: string]
  'clear-error': [field: 'current_password' | 'password' | 'password_confirmation']
  submit: []
}>()

const showCurrentPassword = ref(false)
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)

const fieldUi = (error?: string) => ({
  base: `py-3 rounded-xl focus-visible:ring-0 focus-visible:shadow-[0_0_0_2px] focus-visible:shadow-gtr-soft transition duration-200 ${error ? 'border-gtr-error' : ''}`,
})

const updateCurrentPassword = (value: unknown) => {
  emit('update:current-password', String(value ?? ''))
  emit('clear-error', 'current_password')
}

const updatePassword = (value: unknown) => {
  emit('update:password', String(value ?? ''))
  emit('clear-error', 'password')
}

const updatePasswordConfirmation = (value: unknown) => {
  emit('update:password-confirmation', String(value ?? ''))
  emit('clear-error', 'password_confirmation')
}
</script>

<template>
  <form class="flex flex-col gap-6" @submit.prevent="emit('submit')">
    <div>
      <div class="text-2xl font-semibold">
        Смена пароля
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <label>Текущий пароль</label>

      <u-input
          :model-value="currentPassword"
          :type="showCurrentPassword ? 'text' : 'password'"
          size="xl"
          class="w-full"
          placeholder="Введите текущий пароль"
          :ui="fieldUi(errors.current_password)"
          @update:model-value="updateCurrentPassword"
      >
        <template #trailing>
          <u-button
              type="button"
              variant="link"
              size="md"
              class="rounded-lg mr-1"
              @click="showCurrentPassword = !showCurrentPassword"
          >
            <icon :name="showCurrentPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'"/>
          </u-button>
        </template>
      </u-input>

      <p v-if="errors.current_password" class="text-sm text-gtr-error">
        {{ errors.current_password }}
      </p>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <div class="flex flex-col gap-2">
        <label>Новый пароль</label>

        <u-input
            :model-value="password"
            :type="showPassword ? 'text' : 'password'"
            size="xl"
            class="w-full"
            placeholder="Введите новый пароль"
            :ui="fieldUi(errors.password)"
            @update:model-value="updatePassword"
        >
          <template #trailing>
            <u-button
                type="button"
                variant="link"
                size="md"
                class="rounded-lg mr-1"
                @click="showPassword = !showPassword"
            >
              <icon :name="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'"/>
            </u-button>
          </template>
        </u-input>

        <p v-if="errors.password" class="text-sm text-gtr-error">
          {{ errors.password }}
        </p>
      </div>

      <div class="flex flex-col gap-2">
        <label>Повторите новый пароль</label>

        <u-input
            :model-value="passwordConfirmation"
            :type="showPasswordConfirmation ? 'text' : 'password'"
            size="xl"
            class="w-full"
            placeholder="Повторите новый пароль"
            :ui="fieldUi(errors.password_confirmation)"
            @update:model-value="updatePasswordConfirmation"
        >
          <template #trailing>
            <u-button
                type="button"
                variant="link"
                size="md"
                class="rounded-lg mr-1"
                @click="showPasswordConfirmation = !showPasswordConfirmation"
            >
              <icon :name="showPasswordConfirmation ? 'mdi:eye-off-outline' : 'mdi:eye-outline'"/>
            </u-button>
          </template>
        </u-input>

        <p v-if="errors.password_confirmation" class="text-sm text-gtr-error">
          {{ errors.password_confirmation }}
        </p>
      </div>
    </div>

    <div class="flex justify-end">
      <u-button
          type="submit"
          variant="ghost"
          :loading="pending"
          :disabled="pending"
          class="px-6"
      >
        Изменить пароль
      </u-button>
    </div>
  </form>
</template>
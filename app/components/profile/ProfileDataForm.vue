<script setup lang="ts">
interface ProfileDataFormProps {
  name: string
  email: string
  errors: {
    name: string
    email: string
    avatar?: string
  }
  pending?: boolean
}

defineProps<ProfileDataFormProps>()

const emit = defineEmits<{
  'update:name': [value: string]
  'update:email': [value: string]
  'clear-error': [field: 'name' | 'email']
  submit: []
}>()

const fieldUi = (error?: string) => ({
  base: `py-3 rounded-xl focus-visible:ring-0 focus-visible:shadow-[0_0_0_2px] focus-visible:shadow-gtr-soft transition duration-200 ${error ? 'border-gtr-error' : ''}`,
})

const updateName = (value: unknown) => {
  emit('update:name', String(value ?? ''))
  emit('clear-error', 'name')
}

const updateEmail = (value: unknown) => {
  emit('update:email', String(value ?? ''))
  emit('clear-error', 'email')
}
</script>

<template>
  <form class="flex flex-col gap-6" @submit.prevent="emit('submit')">
    <div class="flex flex-col gap-2">
      <label>Имя</label>

      <u-input
          :model-value="name"
          size="xl"
          class="w-full"
          :ui="fieldUi(errors.name)"
          @update:model-value="updateName"
      />

      <p v-if="errors.name" class="text-sm text-gtr-error">
        {{ errors.name }}
      </p>
    </div>

    <div class="flex flex-col gap-2">
      <label>Email</label>

      <u-input
          :model-value="email"
          size="xl"
          class="w-full"
          :ui="fieldUi(errors.email)"
          @update:model-value="updateEmail"
      />

      <p v-if="errors.email" class="text-sm text-gtr-error">
        {{ errors.email }}
      </p>
    </div>

    <div class="flex justify-end">
      <u-button
          type="submit"
          variant="ghost"
          :loading="pending"
          :disabled="pending"
          class="px-6"
      >
        Сохранить изменения
      </u-button>
    </div>
  </form>
</template>
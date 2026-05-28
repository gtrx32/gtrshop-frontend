<script setup lang="ts">
interface ProfileProps {
  avatarSrc: string | null
  error?: string
}

defineProps<ProfileProps>()

const emit = defineEmits<{
  'select-avatar': [file: File]
}>()

const {user} = useAuth()

const input = ref<HTMLInputElement | null>(null)

const initials = computed(() => {
  return user.value?.name?.trim().slice(0, 1).toUpperCase() || 'U'
})

const openFileDialog = () => {
  input.value?.click()
}

const selectFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  target.value = ''

  if (!file) return

  emit('select-avatar', file)
}
</script>

<template>
  <div class="flex flex-col gap-6 md:flex-row md:items-center">
    <button
        type="button"
        class="group relative flex size-40 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gtr-fade text-5xl font-medium shadow-sm shadow-gtr-soft"
        @click="openFileDialog"
    >
      <img
          v-if="avatarSrc"
          :src="avatarSrc"
          :alt="user?.name ?? ''"
          class="h-full w-full object-cover"
      >

      <span v-else>
        {{ initials }}
      </span>

      <span class="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/55 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <icon name="mdi:camera-outline" class="text-3xl"/>
        <span class="text-sm font-medium">Изменить фото</span>
      </span>
    </button>

    <div class="flex min-w-0 flex-col gap-4">
      <div class="min-w-0">
        <div class="text-4xl font-semibold leading-tight break-all">
          {{ user?.name }}
        </div>

        <div class="mt-2 text-xl text-gtr-toned break-all">
          {{ user?.email }}
        </div>
      </div>

      <div>
        <input
            ref="input"
            type="file"
            accept="image/*"
            class="hidden"
            @change="selectFile"
        >

        <u-button
            type="button"
            variant="ghost"
            size="md"
            @click="openFileDialog"
        >
          <icon name="mdi:camera-outline" class="text-xl"/>
          Изменить фото
        </u-button>
      </div>

      <p v-if="error" class="text-sm text-gtr-error">
        {{ error }}
      </p>
    </div>
  </div>
</template>
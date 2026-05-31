<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false })

const props = defineProps<{
  loading?: boolean
  error?: unknown
}>()

const emit = defineEmits<{
  submit: [
    payload: {
      title: string
      comment: string
      rating: number
    },
  ]
}>()

const title = ref('')
const comment = ref('')
const rating = ref(5)

const ratingOptions = [5, 4, 3, 2, 1]

const canSubmit = computed(() => {
  return title.value.trim().length > 0
      && comment.value.trim().length > 0
      && rating.value >= 1
      && rating.value <= 5
})

const resetForm = () => {
  title.value = ''
  comment.value = ''
  rating.value = 5
}

const submit = () => {
  if (!canSubmit.value || props.loading) {
    return
  }

  emit('submit', {
    title: title.value.trim(),
    comment: comment.value.trim(),
    rating: rating.value,
  })
}

watch(open, (value) => {
  if (!value) {
    resetForm()
  }
})
</script>

<template>
  <u-modal
      v-model:open="open"
      title="Оставить отзыв"
      description="Оцените товар и напишите короткий отзыв."
      class="max-w-2xl"
  >
    <template #body>
      <form
          class="flex flex-col gap-5"
          @submit.prevent="submit"
      >
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gtr-base">
            Оценка
          </label>

          <u-select
              v-model="rating"
              :items="ratingOptions"
              :disabled="loading"
              class="w-32"
              color="neutral"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gtr-base">
            Заголовок
          </label>

          <u-input
              v-model="title"
              :disabled="loading"
              placeholder="Например: Отличный товар"
              class="w-full"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gtr-base">
            Комментарий
          </label>

          <u-textarea
              v-model="comment"
              :disabled="loading"
              :rows="6"
              placeholder="Расскажите, что понравилось или не понравилось"
              class="w-full"
          />
        </div>

        <div
            v-if="error"
            class="rounded-lg border border-gtr-error/40 bg-gtr-error/10 p-3 text-sm text-gtr-error"
        >
          Не удалось отправить отзыв.
        </div>

        <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <u-button
              type="button"
              variant="ghost"
              color="primary"
              :disabled="loading"
              @click="open = false"
          >
            Отмена
          </u-button>

          <u-button
              type="submit"
              color="primary"
              icon="mdi:send-outline"
              :loading="loading"
              :disabled="!canSubmit"
          >
            Отправить отзыв
          </u-button>
        </div>
      </form>
    </template>
  </u-modal>
</template>
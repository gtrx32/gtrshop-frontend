<script setup lang="ts">
import type { CatalogSortOption } from '~/types/catalog'

const props = defineProps<{
  modelValue?: CatalogSortOption
  options: CatalogSortOption[]
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CatalogSortOption]
}>()

const items = computed(() => {
  return props.options.map((option) => ({
    label: option.label,
    value: getSortKey(option),
  }))
})

const currentValue = computed(() => {
  return props.modelValue ? getSortKey(props.modelValue) : undefined
})

function getSortKey(option: CatalogSortOption) {
  return `${option.value}:${option.order}`
}

function updateSort(value: string | number | boolean | undefined) {
  if (value === undefined) return

  const key = String(value)

  const option = props.options.find((item) => {
    return getSortKey(item) === key
  })

  if (!option) return

  emit('update:modelValue', option)
}
</script>

<template>
  <u-select
      :model-value="currentValue"
      :items="items"
      :disabled="disabled"
      class="min-w-56"
      color="neutral"
      :ui="{
        base: 'rounded-lg border border-gtr-soft bg-white/70 text-gtr-base dark:bg-gtr-pale',
        content: 'max-h-none',
      }"
      @update:model-value="updateSort"
  />
</template>
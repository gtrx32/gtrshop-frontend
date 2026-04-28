<script setup lang="ts">
import type {
  CatalogViewMode,
  CatalogViewModeOption,
} from '~/types/catalog'

defineProps<{
  modelValue: CatalogViewMode
  options: CatalogViewModeOption[]
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CatalogViewMode]
}>()
</script>

<template>
  <u-tabs
      :model-value="modelValue"
      :items="options"
      :disabled="disabled"
      class="min-w-48"
      :ui="{
      list: 'rounded-lg border border-gtr-soft bg-white/70 p-1 dark:bg-gtr-pale',
      indicator: 'bg-gtr-contrast',
      trigger: 'text-gtr-toned data-[state=active]:text-gtr-pale'
    }"
      @update:model-value="emit('update:modelValue', $event as CatalogViewMode)"
  />
</template>
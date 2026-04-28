<script setup lang="ts">
defineProps<{
  page: number
  perPage: number
  perPageOptions: number[]
  total: number
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:page': [value: number]
  'update:perPage': [value: number]
}>()
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <u-pagination
        :page="page"
        :items-per-page="perPage"
        :sibling-count="1"
        :total="total"
        :disabled="loading"
        @update:page="emit('update:page', $event)"
    />

    <div class="flex items-center gap-4 text-sm text-gtr-toned">
      <div>
        Товаров на странице:
      </div>

      <u-select
          :model-value="perPage"
          :items="perPageOptions"
          :disabled="loading"
          class="min-w-20"
          color="neutral"
          @update:model-value="emit('update:perPage', Number($event))"
      />
    </div>
  </div>
</template>
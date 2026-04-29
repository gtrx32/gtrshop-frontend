<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div class="min-w-0 text-2xl font-semibold leading-tight">
      <slot name="title" />
    </div>

    <div
        v-if="$slots.actions"
        class="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end"
    >
      <slot name="actions" />
    </div>
  </div>
</template>
<template>
  <div class="flex flex-wrap items-center justify-between gap-2">
    <div class="min-w-0 flex-1 text-2xl font-semibold leading-tight">
      <slot name="title" />
    </div>

    <div
        v-if="$slots.actions"
        class="ml-auto flex flex-nowrap items-center gap-2"
    >
      <slot name="actions" />
    </div>
  </div>
</template>

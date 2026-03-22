<template>
  <div class="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
    <div class="text-center text-2xl font-semibold leading-tight sm:text-left">
      <slot name="title" />
    </div>

    <div
        v-if="$slots.actions"
        class="flex w-full flex-wrap items-center justify-center gap-2 sm:w-auto sm:justify-end"
    >
      <slot name="actions" />
    </div>
  </div>
</template>
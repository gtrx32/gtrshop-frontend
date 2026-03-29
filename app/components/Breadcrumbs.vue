<script setup lang="ts">
interface BreadcrumbsProps {
  center?: boolean
}

const {center = false} = defineProps<BreadcrumbsProps>()

const {breadcrumbs} = useBreadcrumbs()
</script>

<template>
  <nav v-if="breadcrumbs.length" class="flex flex-wrap items-center gap-2 text-sm text-gtr-toned" :class="{ 'justify-center': center }">
    <span v-for="(item, index) in breadcrumbs" :key="`${item.label}-${index}`" class="flex items-center gap-2">
      <nuxt-link v-if="item.to" :to="item.to" class="hover:text-gtr-base">
        {{ item.label }}
      </nuxt-link>
      <span v-else class="text-gtr-base font-medium">
        {{ item.label }}
      </span>
      <span v-if="index < breadcrumbs.length - 1" class="select-none text-gtr-dimmed">/</span>
    </span>
  </nav>
</template>
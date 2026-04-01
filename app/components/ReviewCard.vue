<script setup lang="ts">
import type { Review } from '~/types/review'

defineProps<{
  review: Review
}>()
</script>

<template>
  <article class="rounded-xl bg-gtr-fade/30 p-5 sm:p-6">
    <div class="space-y-4">
      <div class="flex items-center justify-between gap-3">
        <div class="flex min-w-0 items-center gap-3">
          <u-avatar
            :alt="review.user?.name ?? 'Покупатель'"
            :src="review.user?.avatar ?? undefined"
            :text="(review.user?.name ?? 'Покупатель').slice(0, 1)"
            size="xl"
            class="shrink-0"
          />

          <div class="min-w-0 pt-0.5">
            <div class="text-sm leading-5 text-gtr-toned">
              {{ review.user?.name ?? 'Покупатель' }}
            </div>
            <div class="text-sm leading-5 text-gtr-toned">
              {{ formatDate(review.created_at) }}
            </div>
          </div>
        </div>

        <div class="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-sm text-gtr-muted">
          <u-icon
            name="mdi:star"
            class="size-4 text-gtr-warning"
          />
          <span class="font-medium text-gtr-base">{{ review.rating.toFixed(1) }}</span>
        </div>
      </div>

      <div class="text-lg leading-7 font-medium text-gtr-base">
        {{ review.title }}
      </div>
    </div>

    <p class="mt-4 text-gtr-base leading-7">
      {{ review.comment }}
    </p>

    <div class="mt-5 flex flex-wrap items-center gap-3">
      <u-button
        variant="ghost"
        color="primary"
        size="md"
      >
        <u-icon name="mdi:thumb-up-outline" class="size-4" />
        <span>{{ review.likes }}</span>
      </u-button>

      <u-button
        variant="ghost"
        color="primary"
        size="md"
      >
        <u-icon name="mdi:thumb-down-outline" class="size-4" />
        <span>{{ review.dislikes }}</span>
      </u-button>
    </div>
  </article>
</template>

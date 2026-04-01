<script setup lang="ts">
import type { Product } from '~/types/product'

const api = useApi()
const route = useRoute()

const slug = computed(() => String(route.params.slug))

const { data } = await useAsyncData(
  () => `catalog:product:${slug.value}`,
  () => api<Product>(`api/products/${slug.value}`),
  { watch: [slug] }
)

const product = computed(() => data.value!)
const reviews = computed(() => product.value.reviews ?? [])
const reviewsTotal = computed(() => product.value.reviews_count ?? reviews.value.length)
const inStock = computed(() => product.value.stock > 0)
const isReviewsModalOpen = ref(false)

const ratingLabel = computed(() => formatRating(product.value.rating))
const reviewsLabel = computed(() => {
  return `${reviewsTotal.value} отзывов`
})
const stockText = computed(() => inStock.value ? `В наличии: ${product.value.stock}` : 'Нет в наличии')

const { setBreadcrumbs } = useBreadcrumbs()

watch(
  () => product.value.name,
  (name) => setBreadcrumbs([
    { label: 'Каталог', to: '/catalog' },
    { label: name },
  ]),
  { immediate: true }
)

useSeoMeta({
  title: () => `${product.value.name}`,
  description: () => product.value.description,
})
</script>

<template>
  <div class="space-y-8 lg:space-y-10">
    <heading
      :title="product.name"
      breadcrumbs
    />

    <section class="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
      <div class="overflow-hidden rounded-xl bg-gtr-fade/30 lg:min-w-0 lg:flex-[1.1]">
        <img
          :src="product.image ?? undefined"
          :alt="product.name"
          class="h-80 w-full object-cover sm:h-100 lg:h-120"
        >
      </div>

      <div class="flex flex-col gap-2 md:gap-6 lg:min-w-[320px] lg:flex-[0.9]">
        <div class="flex flex-wrap items-center justify-end gap-x-3 gap-y-2 text-sm">
          <div
            v-if="ratingLabel"
            class="flex flex-wrap items-center gap-1 text-gtr-muted"
          >
            <u-icon
              name="mdi:star"
              class="size-4 text-gtr-warning"
            />
            <span>{{ ratingLabel }}</span>
            <span>· {{ reviewsLabel }}</span>
          </div>
          <div
            v-else
            class="flex items-center gap-1 text-gtr-dimmed"
          >
            <u-icon
              name="mdi:star-outline"
              class="size-4"
            />
            <span>Нет отзывов</span>
          </div>
        </div>

        <div class="space-y-2">
          <div class="text-sm uppercase tracking-[0.18em] text-gtr-muted">
            Цена
          </div>
          <div class="text-4xl font-medium tracking-tight text-gtr-base">
            {{ formatPrice(product.price) }}
          </div>
        </div>

        <div class="text-sm leading-6 text-gtr-toned">
          {{ product.description }}
        </div>

        <div class="flex flex-col items-start gap-2">
          <div class="text-gtr-toned">
            {{ stockText }}
          </div>
          <u-button v-if="inStock">
            Добавить в корзину
          </u-button>
          <u-button v-else to="/contacts" variant="ghost" color="primary">
            Уточнить наличие
          </u-button>
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <subtitle>
        <template #title>Описание</template>
      </subtitle>

      <div class="text-gtr-base leading-7">
        <p>{{ product.description }}</p>
      </div>
    </section>

    <section class="space-y-4">
      <subtitle>
        <template #title>Отзывы</template>
        <template #actions>
          <u-button
            color="primary"
            variant="ghost"
            size="lg"
            :disabled="!reviewsTotal"
            @click="isReviewsModalOpen = true"
          >
            {{ reviewsTotal ? `Все отзывы (${reviewsTotal})` : 'Отзывы появятся позже' }}
          </u-button>
        </template>
      </subtitle>

      <reviews-widget :reviews="reviews" />
    </section>

    <reviews-modal
      v-model:open="isReviewsModalOpen"
      :product-slug="product.slug"
      :reviews-count="reviewsTotal"
    />

    <div class="flex justify-start">
      <u-button to="/catalog" icon="mdi:arrow-left">
        Назад в каталог
      </u-button>
    </div>
  </div>
</template>

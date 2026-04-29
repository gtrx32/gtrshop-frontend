<script setup lang="ts">
import { useCatalogProduct } from '~/composables/catalog/useCatalogProduct'
import ProductDetail from '~/components/catalog/detail/ProductDetail.vue'
import ProductReviews from '~/components/catalog/detail/ProductReviews.vue'

const route = useRoute()

const slug = computed(() => String(route.params.slug))

const {
  product,
  pending,
  error,
} = await useCatalogProduct(slug)

const previewReviews = computed(() => product.value?.reviews ?? [])
const reviewsTotal = computed(() => product.value?.reviews_count ?? previewReviews.value.length)

const { setBreadcrumbs } = useBreadcrumbs()

watch(
    () => product.value?.name,
    (name) => {
      if (!name) return

      setBreadcrumbs([
        { label: 'Каталог', to: '/catalog' },
        { label: name },
      ])
    },
    { immediate: true },
)

useSeoMeta({
  title: () => product.value?.name ?? 'Товар',
  description: () => product.value?.description ?? '',
})
</script>

<template>
  <div class="space-y-8 lg:space-y-10">
    <heading
        breadcrumbs
        :title="product?.name ?? 'Товар'"
    />

    <spinner v-if="pending" />

    <div
        v-else-if="error"
        class="py-12 text-center text-gtr-toned"
    >
      Не удалось загрузить товар.
    </div>

    <div
        v-else-if="!product"
        class="py-12 text-center text-gtr-toned"
    >
      Товар не найден.
    </div>

    <template v-else>
      <ProductDetail :product="product" />

      <section class="space-y-4">
        <subtitle>
          <template #title>
            Описание
          </template>
        </subtitle>

        <div class="leading-7 text-gtr-base">
          <p>{{ product.description }}</p>
        </div>
      </section>

      <ProductReviews
          :product-slug="product.slug"
          :reviews="previewReviews"
          :reviews-count="reviewsTotal"
          :can-review="product.can_review"
      />

      <div class="flex justify-start">
        <u-button
            to="/catalog"
            icon="mdi:arrow-left"
        >
          Назад в каталог
        </u-button>
      </div>
    </template>
  </div>
</template>
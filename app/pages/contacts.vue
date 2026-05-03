<script setup lang="ts">
const { setBreadcrumbs } = useBreadcrumbs()
setBreadcrumbs([{ label: 'Контакты' }])
</script>

<template>
  <div class="space-y-12">
    <heading
        title="Контакты"
        subtitle="Свяжитесь с нами любым удобным способом"
        breadcrumbs
    />
    <YandexMap :center="[53.235077, 34.354097]" :zoom="15">
      <div class="flex flex-col gap-3">
        <div class="font-semibold text-lg">Контакты</div>
        <div>
          <div class="text-md text-muted">Телефон</div>
          <div>+7 (999) 000-00-00</div>
        </div>
        <div>
          <div class="text-sm text-muted">Email</div>
          <div>info@gtrshop.ru</div>
        </div>
        <div>
          <div class="text-sm text-muted">Время работы</div>
          <div>09:00 - 18:00</div>
        </div>
        <div>
          <div class="text-sm text-muted">Адрес</div>
          <div>Улица Есенина, дом Каруселина</div>
        </div>
      </div>
    </YandexMap>
    <QuestionForm class="flex-1" />
  </div>
</template>
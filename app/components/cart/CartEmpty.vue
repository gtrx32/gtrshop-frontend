<script setup lang="ts">
</script>
<template>
  <div class="flex-1 flex flex-col gap-6 items-center justify-center">
    <div class="flex size-24 items-center justify-center rounded-full bg-gtr-fade">
      <icon class="text-5xl text-gtr-toned" name="mdi:cart-outline"/>
    </div>

    <div class="flex flex-col gap-3 items-center justify-center text-center">
      <div class="text-3xl font-semibold">
        Корзина пуста
      </div>
      <div class="text-gtr-toned">
        Пока вы ничего не выбрали, но это легко исправить
      </div>
    </div>

    <u-button
        class="px-6"
        size="xl"
        to="/catalog"
        variant="ghost"
    >
      Перейти в каталог
    </u-button>
  </div>
</template>
<script setup lang="ts">
const items = 3;
</script>

<template>
  <div class="glm-loader">
    <div
      v-for="item in items"
      :key="item"
      class="glm-loader__item"
      :style="{ '--_glm-loader-item-delay': `${item * 0.15}s` }"
    />
    <div
      v-for="item in items"
      :key="item"
      class="glm-loader__shadow"
      :style="{ '--_glm-loader-item-delay': `${item * 0.15}s` }"
    />
  </div>
</template>

<style scoped lang="scss">
.glm-loader {
  display: grid;
  grid-template-rows: repeat(2, min-content);
  grid-template-columns: repeat(3, min-content);
  column-gap: 0.5rem;
  row-gap: 1.5rem;
  justify-items: center;
  filter: blur(1.5px);

  &__item {
    animation: bounce infinite 1s var(--_glm-loader-item-delay) ease-in-out alternate;
    box-shadow: 0 0 8px 0 $primary-75;
    border-radius: var(--border-radius-pill);
    background: $primary-50;
    width: 0.75rem;
    height: 0.75rem;
  }

  &__shadow {
    animation: scale infinite 1s var(--_glm-loader-item-delay) ease-in-out alternate;
    box-shadow: 0 0 8px -2px $primary-75;
    border-radius: 50%;
    background: $primary-50;

    width: 1rem;
    height: 0.4rem;
  }
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(2.65rem);
  }
}

@keyframes scale {
  60% {
    transform: scale(1);
  }

  100% {
    transform: scale(0);
  }
}
</style>

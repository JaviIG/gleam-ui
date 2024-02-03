<script setup lang="ts">
const items = 3;
</script>

<template>
  <svg class="" viewBox="0 0 64 64">
    <filter id="blur">
      <feGaussianBlur stdDeviation="5" in="SourceGraphic" result="BLUR"></feGaussianBlur>
    </filter>

    <circle class="glm-loader__background" cx="32" cy="32" r="32" fill="red" />
    <rect
      v-for="item in items"
      :key="item"
      :style="{ '--_glm-loader-item-index': item }"
      class="glm-loader__item"
      width="32"
      height="32"
      rx="8"
      x="16"
      y="16"
    />
  </svg>
</template>

<style scoped lang="scss">
.glm-loader {
  aspect-ratio: 1;

  &__background {
    fill: var(--background-color-3);
  }
  &__item {
    //transform: translateY(calc(8px * (2 - var(--_glm-loader-item-index, 0)))) rotateX(45deg) rotateZ(45deg);
    transform-origin: 32px 32px;
    animation: loader infinite 0.75s calc(-0.25s * var(--_glm-loader-item-index, 0)) ease-in-out
      alternate;
    fill: transparentize($primary-50, 50%);
    mix-blend-mode: screen;
  }
}

@keyframes loader {
  0% {
    transform: translateY(calc(8px * (2 - var(--_glm-loader-item-index, 0)))) rotateX(45deg)
      rotateZ(45deg) scale(0.75);
  }

  100% {
    transform: translateY(calc(8px * (2 - var(--_glm-loader-item-index, 0)))) rotateX(45deg)
      rotateZ(45deg) scale(1);
  }
}
</style>

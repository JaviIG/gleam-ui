<script setup lang="ts">
const items = 3;
</script>

<template>
  <div class="glm-loader">
    <div
      v-for="item in items"
      :key="item"
      class="glm-loader__item"
      :style="{ '--_glm-loader-item-index': item }"
    />
  </div>
</template>

<style scoped lang="scss">
.glm-loader {
  position: relative;
  gap: 4px;
  border-radius: var(--border-radius-pill);
  background: var(--background-color-3);
  padding: 0.2rem;
  width: 2rem;
  height: 2rem;

  &__item {
    position: absolute;
    animation: loader infinite 0.75s calc(-0.25s * var(--_glm-loader-item-index)) ease-in-out
      alternate;
    inset: 0.3rem;
    inset-block: calc((var(--_glm-loader-item-index) * -0.3rem) + 0.9rem);
    width: 1.4rem;
    height: 1.4rem;

    &:after {
      display: block;
      transform: rotateX(45deg) rotateZ(45deg);
      backdrop-filter: blur(2px) brightness(1.5) saturate(1.75);
      border-radius: 0.25rem;
      background: transparentize($primary-50, 50%);
      width: 100%;
      height: 100%;
      content: '';
    }

    &:nth-child(2) {
    }
  }
}

@keyframes loader {
  0% {
    transform: scale(0.5);
  }

  100% {
    transform: scale(0.75);
  }
}
</style>

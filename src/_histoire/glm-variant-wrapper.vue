<script lang="ts" setup>
import GlmBox from '../components/GlmBox.vue';

const isStory = location.pathname === '/__sandbox.html';
</script>

<template>
  <div v-if="isStory" class="glm-variant-wrapper">
    <GlmBox class="glm-variant-wrapper__box" blur="m">
      <slot />
    </GlmBox>
  </div>
  <div v-else>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.glm-variant-wrapper {
  border-radius: var(--border-radius-xl);
  background: url('/images/purple-bg.jpg');
  background-size: cover;
  padding: #{$spacing-2xl};
  width: 100%;
  min-height: 100vh;

  &__box {
    min-height: 256px;
  }
}
</style>

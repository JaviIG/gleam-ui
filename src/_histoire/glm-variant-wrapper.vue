<script lang="ts" setup>
import GlmBox from '../components/GlmBox.vue';
</script>

<template>
  <div class="glm-variant-wrapper">
    <GlmBox blur="m">
      <slot />
    </GlmBox>
  </div>
</template>

<style lang="scss" scoped>
.glm-variant-wrapper {
  border-radius: var(--border-radius-xl);
  background: url('/images/sunset-living-room.jpg');
  background-size: cover;
  padding: var(--spacing-2xl);
  width: 100%;
  height: 100%;
}
</style>

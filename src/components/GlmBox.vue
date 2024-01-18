<script setup lang="ts">
withDefaults(
  defineProps<{
    level?: '1' | '2' | '3';
    tag?: string;
    size?: 's' | 'm' | 'l';
    blur?: false | 's' | 'm' | 'l';
  }>(),
  {
    level: '1',
    tag: 'div',
    size: 'm',
    blur: false,
  },
);
</script>

<template>
  <component
    :is="tag"
    class="glm-box"
    :class="[
      `glm-box--level-${level}`,
      `glm-box--size-${size}`,
      { [`glm-box--blur-${blur}`]: !!blur },
    ]"
  >
    <slot />
  </component>
</template>

<style lang="scss" scoped>
.glm-box {
  &--level-1 {
    @extend %box-1;
  }
  &--level-2 {
    @extend %box-2;
  }
  &--level-3 {
    @extend %box-3;
  }

  &--size-s {
    border-radius: var(--border-radius-s);
    padding: var(--spacing-s);
  }
  &--size-m {
    border-radius: var(--border-radius-m);
    padding: var(--spacing-m);
  }
  &--size-l {
    border-radius: var(--border-radius-l);
    padding: var(--spacing-l);
  }

  &--blur-s {
    @extend %blur-s;
  }

  &--blur-m {
    @extend %blur-m;
  }

  &--blur-l {
    @extend %blur-l;
  }
}
</style>

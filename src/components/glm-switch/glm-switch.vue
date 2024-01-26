<script setup lang="ts">
import type { SwitchStatus } from '@/components/glm-switch/glm-switch.utils';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    status?: SwitchStatus;
  }>(),
  {
    status: 'idle',
  }
);

const emit = defineEmits<{
  'update:modelValue': [boolean];
}>();

function emitUpdateModelValue() {
  if (props.status === 'readonly' || props.status === 'disabled') return;
  emit('update:modelValue', !props.modelValue);
}
</script>

<template>
  <button
    class="glm-switch"
    :class="[`glm-switch--${status}`, { 'glm-switch--on': modelValue }]"
    role="switch"
    :aria-checked="modelValue"
    :aria-readonly="status === 'readonly'"
    :disabled="props.status === 'disabled'"
    @click="emitUpdateModelValue"
  >
    <span class="glm-switch__thumb" />
  </button>
</template>

<style scoped lang="scss">
$height: 1.75rem;
.glm-switch {
  @extend %box-3;
  display: flex;
  transition: 0.25s ease-out;
  cursor: var(--_glm-switch-cursor, pointer);
  box-sizing: content-box;
  box-shadow: 0 0.5rem 1rem -0.75rem var(--_glm-switch-shadow-color, transparent);
  border-radius: var(--border-radius-pill);
  background: var(--_glm-switch-background, $neutral-10);
  padding: $spacing-2xs;
  aspect-ratio: 2;
  max-width: max-content;
  height: $height;

  &:hover:not(:disabled, [aria-readonly='true']) {
    background: var(--_glm-switch-background-hover, $neutral-20);
  }

  &:focus-visible {
    @include outline;
  }

  &--on {
    --glm-thumb-color: #{$neutral-95};
    --glm-thumb-x: translateX(100%);
    --_glm-switch-shadow-color: var(--control-success-shadow-color);
    --_glm-switch-background: var(--control-success-background);
    --_glm-switch-background-hover: var(--control-success-background-hover);
  }

  &--readonly {
    --_glm-switch-cursor: default;
    opacity: 0.7;
    filter: grayscale(0.25);
  }

  &--disabled {
    --_glm-switch-cursor: default;
    opacity: 0.7;
    filter: grayscale(0.5) brightness(0.4);
  }

  &__thumb {
    display: block;
    transform: var(--glm-thumb-x);
    transition: 0.25s ease-out;
    border-radius: 50%;
    background: var(--glm-thumb-color, $neutral-75);
    aspect-ratio: 1;
    height: $height;
  }
}
</style>

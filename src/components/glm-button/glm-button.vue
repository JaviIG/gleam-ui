<script lang="ts" setup>
import { type Anchor, type Button, GlmInternalLink, type LinkKind } from '../component.utils';
import type { ButtonSize, ButtonVariant } from './glm-button.utils';
import GlmSpinner from '@/components/icons/glm-spinner.vue';
import { isObject } from '@/utils/object';
import { isInternalLink } from '@/utils/string';
import { computed } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

const props = withDefaults(
  defineProps<{
    to?: string | RouteLocationRaw;
    kind?: LinkKind | Button;
    size?: ButtonSize;
    variant?: ButtonVariant;
    onlyIcon?: boolean;
    disabled?: boolean;
    loading?: boolean;
  }>(),
  {
    variant: 'primary',
    size: 'm',
    kind: (props): any => {
      if (!props.to) return 'button';
      if (isObject(props.to) || isInternalLink(props.to)) return 'internal-link';
      return 'external-link';
    },
  }
);

const emit = defineEmits<{
  click: [MouseEvent];
}>();

defineSlots<{
  default: () => any;
  spinner?: () => any;
}>();

const componentAs = computed((): GlmInternalLink | Button | Anchor => {
  if (props.kind === 'external-link') return 'a';
  else if (props.kind === 'internal-link') return GlmInternalLink;
  else return 'button';
});

const buttonAttrs = computed(() => ({
  [props.kind === 'button' ? 'disabled' : 'aria-disabled']: props.disabled,
  tabindex: props.disabled ? -1 : undefined,
  [componentAs.value === 'a' ? 'href' : 'to']: props.to,
}));

function emitClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  } else {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
}
</script>

<template>
  <component
    :is="componentAs"
    :class="[
      `glm-button--variant-${variant}`,
      `glm-button--size-${size}`,
      {
        'glm-button--only-icon': onlyIcon,
        'glm-button--disabled': disabled,
        'glm-button--loading': loading,
      },
    ]"
    class="glm-button"
    v-bind="buttonAttrs"
    @click="emitClick"
  >
    <slot v-if="loading" name="spinner">
      <GlmSpinner class="glm-button__spinner" />
    </slot>
    <slot v-if="!loading || !onlyIcon" />
  </component>
</template>

<style lang="scss" scoped>
.glm-button {
  display: flex;
  position: relative;
  flex-flow: row nowrap;
  align-items: center;
  gap: var(--spacing-s);
  transition: all 0.25s ease-out;
  cursor: pointer;
  box-shadow:
    inset 0 0.125rem 0.25rem -0.125rem var(--neutral-color-100-75),
    0 0.25rem var(--_glm-button-shadow-blur, 0) -0.25rem var(--_glm-button-shadow-color);
  border-radius: var(--border-radius-pill);
  background: var(--_glm-button-background);
  padding: var(--_glm-button-padding);
  width: max-content;
  font-size: var(--_glm-button-font-size);
  line-height: var(--_glm-button-line-height);
  white-space: nowrap;

  &:after {
    display: block;
    position: absolute;
    mask: linear-gradient(135deg, black 0%, transparent 30%, transparent 70%, black);
    inset: 0;
    border: solid 1px var(--border-color-3);
    border-radius: inherit;
    pointer-events: none;
    content: '';
  }

  &__spinner {
    animation: spin infinite 3s $ease-in-out-back;
  }

  // Theme variants
  &--variant-primary {
    --_glm-button-background: var(--neutral-color-75-50);
    --_glm-button-background-hover: var(--neutral-color-75-75);
    --_glm-button-shadow-color: var(--neutral-color-75-50);
  }

  &--variant-success {
    --_glm-button-background: var(--success-color-50-85);
    --_glm-button-background-hover: var(--success-color-50);
    --_glm-button-shadow-color: var(--success-color-50-75);
  }

  &--variant-error {
    --_glm-button-background: var(--error-color-50-85);
    --_glm-button-background-hover: var(--error-color-50);
    --_glm-button-shadow-color: var(--error-color-50-75);
  }

  // Size Variants
  &--size-s {
    --_glm-button-padding: var(--spacing-xs) var(--spacing-m);
    --_glm-button-line-height: 1rem;
    --_glm-button-font-size: var(--font-size-s);
  }

  &--size-m {
    --_glm-button-padding: var(--spacing-s) var(--spacing-l);
    --_glm-button-line-height: 2rem;
    --_glm-button-font-size: var(--font-size-m);
  }

  &--size-l {
    --_glm-button-padding: var(--spacing-m) var(--spacing-l);
    --_glm-button-line-height: 2.25rem;
    --_glm-button-font-size: var(--font-size-l);
  }

  // Status
  &:hover {
    --_glm-button-shadow-blur: 1rem;
    --_glm-button-background: var(--_glm-button-background-hover);
  }

  &:active {
    transform: scale(0.98);
    filter: brightness(90%);
  }

  &--disabled {
    opacity: 0.5;
    cursor: default;
    pointer-events: none;
  }

  &--loading {
    opacity: 0.9;
    cursor: default;
    pointer-events: none;
  }

  &--only-icon {
    aspect-ratio: 1;
    --_glm-button-font-size: 1lh;
  }
}

@keyframes spin {
  from {
    transform: rotate(0turn);
  }
  to {
    transform: rotate(4turn);
  }
}
</style>

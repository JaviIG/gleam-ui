<script lang="ts" setup>
import { type Anchor, type Button, GlmInternalLink, type LinkKind } from '../component.utils';
import type { ButtonSize, ButtonStatus, ButtonStatuses, ButtonVariant } from './glm-button.utils';
import GlmLoader from '@/components/glm-loader/glm-loader.vue';
import GlmSpinner from '@/components/icons/glm-spinner.vue';
import { useId } from '@/composables/id.composable';
import { isObject } from '@/utils/object';
import { isInternalLink } from '@/utils/string';
import { computed, ref } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

const props = withDefaults(
  defineProps<{
    to?: string | RouteLocationRaw;
    kind?: LinkKind | Button;
    size?: ButtonSize;
    variant?: ButtonVariant;
    iconOnly?: boolean;
    status?: ButtonStatus;
    ariaLabel?: string;
  }>(),
  {
    variant: 'default',
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
  loader?: () => any;
  label?: () => any;
}>();

const id = useId('glm-button', ['label']);

const controlRef = ref<HTMLElement>();
const isDisabled = computed(() => props.status === 'disabled');
const isLoading = computed(() => props.status === 'loading');

const componentAs = computed((): GlmInternalLink | Button | Anchor => {
  if (props.kind === 'external-link') return 'a';
  else if (props.kind === 'internal-link') return GlmInternalLink;
  else return 'button';
});

const buttonAttrs = computed(() => ({
  [props.kind === 'button' ? 'disabled' : 'aria-disabled']: isDisabled.value,
  tabindex: isDisabled.value ? -1 : undefined,
  [componentAs.value === 'a' ? 'href' : 'to']: props.to,
}));

function emitClick(event: MouseEvent) {
  if (!isDisabled.value && !isLoading.value) {
    emit('click', event);
  } else {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
}

defineExpose({
  controlRef,
});
</script>

<template>
  <component
    :is="componentAs"
    :class="[
      `glm-button--variant-${variant}`,
      `glm-button--size-${size}`,
      `glm-button--${status}`,
      {
        'glm-button--only-icon': iconOnly,
      },
    ]"
    ref="controlRef"
    class="glm-button"
    v-bind="buttonAttrs"
    :aria-labelledby="ariaLabel ? id.label : undefined"
    @click="emitClick"
  >
    <slot v-if="isLoading" name="loader">
      <GlmLoader class="glm-button__spinner" />
    </slot>
    <slot v-if="!isLoading || !iconOnly" />
    <span v-if="ariaLabel" :id="id.label" class="glm-button__label">{{ ariaLabel }}</span>
  </component>
</template>

<style lang="scss">
.glm-button {
  display: flex;
  position: relative;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  gap: #{$spacing-s};
  transition: all 0.25s ease-out;
  cursor: pointer;
  box-shadow:
    inset 0 0.125rem 0.25rem -0.125rem var(--control-inset-shadow-color),
    0 0.25rem var(--_glm-button-shadow-blur, 0) -0.25rem var(--_glm-button-shadow-color);
  border-radius: var(--border-radius-pill);
  background: var(--_glm-button-background);
  padding: var(--_glm-button-padding);
  width: max-content;
  color: var(--font-color-lightest);
  font-size: var(--_glm-button-font-size);
  line-height: var(--_glm-button-line-height);
  white-space: nowrap;

  &__label {
    @include sr-only();
  }

  // Theme variants
  &--variant-default {
    --_glm-button-background: var(--control-default-background);
    --_glm-button-background-hover: var(--control-default-background-hover);
    --_glm-button-shadow-color: var(--control-default-shadow-color);
  }

  &--variant-primary {
    --_glm-button-background: var(--control-primary-background);
    --_glm-button-background-hover: var(--control-primary-background-hover);
    --_glm-button-shadow-color: var(--control-primary-shadow-color);
  }

  &--variant-success {
    --_glm-button-background: var(--control-success-background);
    --_glm-button-background-hover: var(--control-success-background-hover);
    --_glm-button-shadow-color: var(--control-success-shadow-color);
  }

  &--variant-error {
    --_glm-button-background: var(--control-error-background);
    --_glm-button-background-hover: var(--control-error-background-hover);
    --_glm-button-shadow-color: var(--control-error-shadow-color);
  }

  &--variant-default,
  &--variant-success,
  &--variant-error {
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
  }

  &--variant-transparent {
    --_glm-button-background-hover: var(--control-transparent-background-hover);
  }

  // Size Variants

  &--size-s {
    --_glm-button-padding: #{$spacing-xs} #{$spacing-m};
    --_glm-button-line-height: 1rem;
    --_glm-button-font-size: var(--font-size-s);

    --_glm-button-icon-padding: #{$spacing-s};
    --_glm-button-icon-font-size: var(--font-size-xl);
  }

  &--size-m {
    --_glm-button-padding: #{$spacing-s} #{$spacing-l};
    --_glm-button-line-height: 1.25rem;
    --_glm-button-font-size: var(--font-size-m);

    --_glm-button-icon-padding: #{$spacing-m};
    --_glm-button-icon-font-size: var(--font-size-2xl);
  }

  &--size-l {
    --_glm-button-padding: #{$spacing-m} #{$spacing-xl};
    --_glm-button-line-height: 1.5rem;
    --_glm-button-font-size: var(--font-size-l);

    --_glm-button-icon-padding: #{$spacing-l};
    --_glm-button-icon-font-size: var(--font-size-3xl);
  }

  // Status
  &:hover,
  &:focus-visible {
    --_glm-button-shadow-blur: 1rem;
    --_glm-button-background: var(--_glm-button-background-hover);
  }
  &:focus-visible {
    @include outline();
  }

  &:active {
    transform: scale(0.98);
    filter: brightness(90%);
  }

  &--disabled {
    opacity: 0.8;
    filter: grayscale(0.25) brightness(0.8);
    cursor: default;
    pointer-events: none;
  }

  &--loading {
    opacity: 0.9;
    filter: grayscale(0.05) brightness(0.95);
    cursor: default;
    pointer-events: none;
  }

  &--only-icon {
    aspect-ratio: 1;
    --_glm-button-padding: var(--_glm-button-icon-padding);
    --_glm-button-font-size: var(--_glm-button-icon-font-size);
  }
}
</style>

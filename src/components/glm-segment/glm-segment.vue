<script generic="T" lang="ts" setup>
import type { SegmentSize, SegmentVariant } from '@/components/glm-segment/glm-segment.utils';
import { computed, nextTick, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: T;
    options: T[];
    size?: SegmentSize;
    variant?: SegmentVariant;
  }>(),
  { size: 'm', variant: 'primary' }
);

const emit = defineEmits<{
  'update:modelValue': [T];
}>();

const listRef = ref<HTMLElement>();

const activeItemIndex = computed(() =>
  props.options.findIndex((item) => item === props.modelValue)
);

function emitClick(value: T) {
  emit('update:modelValue', value);
}

watch(activeItemIndex, async (current, previous) => {
  if (!listRef.value) return;
  const listElement = listRef.value;
  await nextTick();
  const previousActive = listElement.children[previous] as HTMLElement;
  const currentActive = listElement.children[current] as HTMLElement;
  flip(previousActive, currentActive);
});

function flip(previous: HTMLElement, current: HTMLElement) {
  const previousBounds = previous.getBoundingClientRect();
  const currentBounds = current.getBoundingClientRect();
  const dx = previousBounds.x - currentBounds.x;
  const previousWidth = previousBounds.width;
  current.style.setProperty('--_glm-segment-active-width', `${previousWidth}px`);
  current.style.setProperty('--_glm-segment-active-x', `${dx}px`);
  current.style.setProperty('--_glm-segment-active-transition', `none`);
  current.getBoundingClientRect();
  current.style.removeProperty('--_glm-segment-active-transition');
  current.style.removeProperty('--_glm-segment-active-width');
  current.style.removeProperty('--_glm-segment-active-x');
}

defineSlots<{
  item?: (scope: { item: T }) => any;
}>();
</script>

<template>
  <div
    class="glm-segment"
    :class="[`glm-segment--sizes-${size}`, `glm-segment--variant-${variant}`]"
  >
    <ul ref="listRef" class="glm-segment__list" role="group">
      <li v-for="(item, index) in options" :key="index" class="glm-segment__item">
        <button
          :class="{ 'glm-segment__button--active': item === modelValue }"
          :aria-pressed="item === modelValue"
          class="glm-segment__button"
          @click="emitClick(item)"
        >
          <span class="glm-segment__label">
            <slot name="item" :item="item">{{ item }}</slot>
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.glm-segment {
  border: solid 1px var(--border-color-1);
  border-radius: var(--border-radius-pill);
  background: var(--_glm-segment-background);
  padding: var(--_glm-segment-external-padding);
  width: max-content;

  &__list {
    display: flex;
    flex-flow: row nowrap;
    border-radius: var(--border-radius-pill);
    overflow: hidden;
  }

  &__item {
    flex: 1 0 auto;
  }

  &__button {
    position: relative;
    transition: all 0.25s ease-in-out;
    cursor: pointer;
    border-radius: var(--border-radius-pill);
    padding-inline: var(--_glm-segment-padding-inline);
    padding-block: var(--_glm-segment-padding-block);
    width: 100%;
    color: var(--font-color-light);
    font-size: var(--font-size-m);
    text-align: center;

    &:focus-visible {
      @include outline;
      outline-offset: -4px;
    }

    &::after {
      position: absolute;
      transform: translateX(var(--_glm-segment-active-x, 0px));
      backdrop-filter: var(--_glm-segment-item-active-blur);
      transition: var(--_glm-segment-active-transition, all) 0.5s $ease-in-out-back;
      inset: 0;
      border-radius: var(--border-radius-pill);
      background: var(--_glm-segment-active-background);
      width: var(--_glm-segment-active-width, 100%);
      height: 100%;
    }

    &--active {
      color: var(--font-color-lightest);
      &:after {
        content: '';
      }
    }
  }

  &__label {
    position: relative;
    z-index: 1;
  }

  // Variants
  &--variant-primary {
    --_glm-segment-background: var(--input-default-background);
    --_glm-segment-active-background: var(--control-primary-background);
  }

  &--variant-neutral {
    --_glm-segment-active-background: var(--background-color-1);
    --_glm-segment-item-active-blur: blur(var(--blur-m));
  }

  // Sizes
  &--sizes-m {
    --_glm-segment-external-padding: #{$spacing-2xs};
    --_glm-segment-padding-inline: #{$spacing-s};
    --_glm-segment-padding-block: #{$spacing-xs};
  }

  &--sizes-l {
    --_glm-segment-external-padding: #{$spacing-xs};
    --_glm-segment-padding-inline: #{$spacing-m};
    --_glm-segment-padding-block: #{$spacing-s};
  }
}
</style>

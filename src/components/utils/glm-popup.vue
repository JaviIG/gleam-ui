<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{ tag?: string; container?: HTMLElement; trigger: HTMLElement | undefined }>(),
  {
    tag: 'div',
    container: () => window?.document?.body, // Keep optional chaining for SSR
  }
);

const targetRef = ref<HTMLElement>();

const elements = computed(
  (): Partial<FitElementOptions> => ({
    container: props.container,
    target: targetRef.value,
    trigger: props.trigger,
  })
);
watch(elements, ({ container, target, trigger }) => {
  if (container && target && trigger) {
    fitElement({ container, target, trigger });
  }
});

function fitElement({ container, target, trigger }: FitElementOptions) {
  const containerBounds = container.getBoundingClientRect();
  const targetBounds = target.getBoundingClientRect();
  const triggerBounds = trigger.getBoundingClientRect();

  if (triggerBounds.left + targetBounds.width < containerBounds.right) {
    target.style.insetInline = '0 auto';
  } else if (triggerBounds.right - targetBounds.width > containerBounds.left) {
    target.style.insetInline = 'auto 0';
  }

  if (triggerBounds.top + targetBounds.height < containerBounds.bottom) {
    target.style.insetBlock = '100% auto';
  } else if (triggerBounds.bottom - targetBounds.height > containerBounds.top) {
    target.style.insetBlock = 'auto 100%';
  }
}

type FitElementOptions = {
  container: HTMLElement;
  target: HTMLElement;
  trigger: HTMLElement;
};
</script>

<template>
  <component :is="tag" ref="targetRef">
    <slot />
  </component>
</template>

<style lang="scss" scoped></style>

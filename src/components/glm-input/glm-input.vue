<script lang="ts" setup>
import type { ExtractProps } from '@/components/component.utils';
import type { ButtonSize } from '@/components/glm-button/glm-button.utils';
import GlmButton from '@/components/glm-button/glm-button.vue';
import type { InputSize, InputStatus } from '@/components/glm-input/glm-input.utils';
import GlmClear from '@/components/icons/glm-clear.vue';
import { useId } from '@/composables/id.composable';
import { computed, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    size?: InputSize;
    type?: 'email' | 'date' | 'text' | 'password' | 'search' | 'tel' | 'url' | 'time';
    status?: InputStatus;
    clearAriaLabel?: string;
  }>(),
  {
    size: 'm',
    type: 'text',
    status: 'idle',
    clearAriaLabel: 'Clear', // TODO Combine input label here: `Clear search box`
  }
);

const modelValue = defineModel<string>();

const emit = defineEmits<{}>();

defineSlots<{
  placeholder?: () => any;
  start?: () => any;
  end?: () => any;
}>();
const isEmpty = computed(() => !modelValue.value);

const id = useId('glm-input', ['placeholder']);

const hasFocus = ref(false);
const controlRef = ref<HTMLInputElement>();

function clearValue() {
  modelValue.value = '';
  controlRef.value!.focus();
}

const inputSizeToButtonSize: Record<InputSize, ButtonSize> = {
  m: 's',
  l: 'm',
};
const slotScope = computed(
  (): SlotScope => ({
    iconProps: {
      class: 'glm-input__icon',
    },
    buttonProps: {
      size: inputSizeToButtonSize[props.size],
      onClick: stopPropagation,
    },
  })
);

type SlotScope = {
  iconProps: {
    class: string;
  };
  buttonProps: ExtractProps<typeof GlmButton>;
};

function stopPropagation(event: Event) {
  event.stopPropagation();
}

function focusInput() {
  controlRef.value!.focus();
}

defineExpose({
  id,
  hasFocus,
  controlRef,
});
</script>

<template>
  <div
    :class="[
      `glm-input--size-${size}`,
      { [`glm-input--status-${status}`]: !!status, 'glm-input--focus': hasFocus },
    ]"
    class="glm-input"
    @click="focusInput"
  >
    <div class="glm-input__start">
      <slot name="start" v-bind="slotScope" />
    </div>
    <input
      ref="controlRef"
      v-model="modelValue"
      class="glm-input__control"
      type="text"
      :aria-describedby="id.placeholder"
      @focus="hasFocus = true"
      @blur="hasFocus = false"
    />
    <div class="glm-input__end">
      <GlmButton
        v-show="modelValue"
        icon-only
        variant="transparent"
        v-bind="slotScope.buttonProps"
        :aria-label="clearAriaLabel"
        @click="clearValue"
      >
        <GlmClear />
      </GlmButton>
      <slot name="end" v-bind="slotScope" />
    </div>
    <p v-show="isEmpty" :id="id.placeholder" class="glm-input__placeholder">
      <slot name="placeholder" />
    </p>
  </div>
</template>

<style lang="scss">
.glm-input {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-areas: 'start input end';
  transition: 0.25s ease-out;
  box-shadow:
    inset 0.2rem 0.2rem 0.2rem -0.125rem var(--input-default-shadow-inset-color),
    0.2rem 0.2rem 0.25rem -0.2rem var(--input-default-shadow-color);
  border-radius: var(--border-radius-pill);
  background: var(--_glm-input-background, var(--input-default-background));
  padding-block: var(--_glm-input-padding);
  font-size: var(--_glm-input-font-size);
  line-height: var(--_glm-input-line-height);

  &__placeholder {
    @extend %ellipsis;
    grid-area: input;
    color: var(--font-color-faded);
  }

  &__control {
    grid-area: input;
    z-index: 1;
    outline: none;
    color: var(--_glm-input-color, var(--font-color-light));
  }

  &__start {
    padding-inline: var(--_glm-input-start-padding);
  }

  &__icon {
    color: var(--font-color-light);
    font-size: var(--_glm-input-icon-size);
  }

  &__start,
  &__end {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: #{$spacing-xs};
    margin-block: calc(-1 * var(--_glm-input-padding));
  }

  // Sizes
  &--size-m {
    --_glm-input-padding: #{$spacing-4xs};
    --_glm-input-line-height: 2.5rem;
    --_glm-input-font-size: var(--font-size-m);
    --_glm-input-start-padding: #{$spacing-l $spacing-2xs};
    --_glm-input-icon-size: var(--font-size-l);
  }

  &--size-l {
    --_glm-input-padding: #{$spacing-2xs};
    --_glm-input-line-height: 2.75rem;
    --_glm-input-font-size: var(--font-size-l);
    --_glm-input-start-padding: #{$spacing-xl $spacing-xs};
    --_glm-input-icon-size: var(--font-size-xl);
  }

  // Status
  &--status-error {
    --_glm-input-background: var(--input-error-background);
    --_glm-input-background-focus: var(--input-error-background-focus);
    --_glm-input-border-color: var(--input-error-border-color);
  }

  &--focus {
    --_glm-input-background: var(
      --_glm-input-background-focus,
      var(--input-default-background-focus)
    );
    --_glm-input-color: var(--_glm-input-color-focus, var(--font-color-lightest));
    @include outline();
  }
}
</style>

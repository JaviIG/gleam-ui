<script lang="ts" setup>
import type { ButtonSize, ButtonStatus } from '@/components/glm-button/glm-button.utils';
import GlmButton from '@/components/glm-button/glm-button.vue';
import type {
  InputSize,
  InputStatus,
  InputGenericSlotScope,
} from '@/components/glm-input/glm-input.utils';
import GlmLoader from '@/components/glm-loader/glm-loader.vue';
import GlmClear from '@/components/icons/glm-clear.vue';
import { useId } from '@/composables/id.composable';
import { computed, readonly, ref } from 'vue';

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

const emit = defineEmits<{
  blur: [FocusEvent];
  focus: [FocusEvent];
  keydown: [KeyboardEvent];
  keyup: [KeyboardEvent];
}>();

const modelValue = defineModel<string>();

const isEmpty = computed(() => !modelValue.value);

const id = useId('glm-input', ['placeholder']);

const hasFocus = ref(false);
const controlRef = ref<HTMLInputElement>();

function clearValue() {
  if (props.status === 'readonly' || props.status === 'disabled') return;
  modelValue.value = '';
  controlRef.value!.focus();
}

const inputSizeToButtonSize: Record<InputSize, ButtonSize> = {
  m: 's',
  l: 'm',
};

const inputStatusToButtonStatus: Record<InputStatus, ButtonStatus> = {
  disabled: 'disabled',
  readonly: 'disabled',
  error: 'idle',
  idle: 'idle',
  loading: 'idle',
};
const slotScope = computed(
  (): InputGenericSlotScope => ({
    iconProps: {
      class: 'glm-input__icon',
    },
    buttonProps: {
      size: inputSizeToButtonSize[props.size],
      status: inputStatusToButtonStatus[props.status],
      onClick: stopPropagation,
    },
  })
);

function stopPropagation(event: Event) {
  event.stopPropagation();
}

function focusInput() {
  controlRef.value!.focus();
}

function onBlur(event: FocusEvent) {
  hasFocus.value = false;
  emit('blur', event);
}

function onFocus(event: FocusEvent) {
  hasFocus.value = true;
  emit('focus', event);
}

function onKeydown(event: KeyboardEvent) {
  emit('keydown', event);
}

function onKeyup(event: KeyboardEvent) {
  emit('keyup', event);
}

defineExpose({
  id,
  hasFocus,
  controlRef,
});

defineSlots<{
  placeholder?: () => any;
  start?: (scope: InputGenericSlotScope) => any;
  end?: (scope: InputGenericSlotScope) => any;
  loader?: (scope: InputGenericSlotScope) => any;
}>();
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
      :readonly="status === 'readonly'"
      @focus="onFocus"
      @blur="onBlur"
      @keydown="onKeydown"
      @keyup="onKeyup"
    />
    <div class="glm-input__end">
      <slot v-if="status === 'loading'" name="loader" v-bind="slotScope">
        <GlmLoader class="glm-input__loader" />
      </slot>
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

  &__loader {
    margin-inline: $spacing-2xs;
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

  &--status-disabled {
    opacity: 0.8;
    filter: grayscale(0.5) brightness(0.5);
    cursor: default;
    pointer-events: none;
  }

  &--status-readonly {
    opacity: 0.8;
    filter: grayscale(0.2);
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

<script lang="ts" setup>
import { clamp } from '../../utils/number';
import GlmButton from '../glm-button/glm-button.vue';
import GlmInput from '../glm-input/glm-input.vue';
import GlmMinus from '../icons/glm-minus.vue';
import GlmPlus from '../icons/glm-plus.vue';
import GlmButtonGroup from '../utils/glm-button-group.vue';
import type { AmountGenericSlotScope, AmountSize, AmountStatus } from './glm-amount.utils';
import { computed, ref, watch } from 'vue';

defineOptions({ inheritAttrs: false });
const props = withDefaults(
  defineProps<{
    size?: AmountSize;
    status?: AmountStatus;
    min?: number;
    max?: number;
    clearAriaLabel?: string;
    incrementAriaLabel?: string;
    decrementAriaLabel?: string;
  }>(),
  {
    min: 0,
    max: Number.MAX_SAFE_INTEGER,
    incrementAriaLabel: 'Increment', // TODO Combine amount label here: `Increment units`
    decrementAriaLabel: 'Decrement',
  }
);

const inputRef = ref<InstanceType<typeof GlmInput>>();
const modelValue = defineModel<number | null>();
const internalModelValue = ref(modelValue.value?.toString() ?? '');
watch(modelValue, (value) => {
  if (parseFloat(internalModelValue.value) !== modelValue.value) {
    internalModelValue.value = value?.toString() ?? '';
  }
});
watch(internalModelValue, (value) => {
  modelValue.value = value ? parseFloat(value) : null;
});

const isDecrementDisabled = computed(
  () => modelValue.value != null && modelValue.value <= props.min
);
const isIncrementDisabled = computed(
  () => modelValue.value != null && modelValue.value >= props.max
);

function increment(event: MouseEvent | KeyboardEvent) {
  if (modelValue.value == null) {
    trySetValue(props.min);
  } else if (modelValue.value < props.min) {
    trySetValue(props.min);
  } else {
    trySetValue(modelValue.value + getIncrementQuantity(event));
  }
}

function decrement(event: MouseEvent | KeyboardEvent) {
  if (modelValue.value == null) {
    trySetValue(props.min);
  } else if (modelValue.value > props.max) {
    trySetValue(props.max);
  } else {
    trySetValue(modelValue.value - getIncrementQuantity(event));
  }
}

function getIncrementQuantity(event: MouseEvent | KeyboardEvent) {
  return event.shiftKey ? 5 : 1;
}

function trySetValue(value: number) {
  modelValue.value = clamp(value, [props.min, props.max]);
}

function preventInvalidKeys(event: InputEvent) {
  if (event.data && !event.data.match(/^\d*$/g)) {
    event.preventDefault();
  }
}

defineExpose({
  id: computed(() => inputRef.value?.id),
  hasFocus: computed(() => inputRef.value?.hasFocus),
  controlRef: computed(() => inputRef.value?.controlRef),
});

defineSlots<{
  placeholder?: () => any;
  start?: (scope: AmountGenericSlotScope) => any;
  loader?: (scope: AmountGenericSlotScope) => any;
}>();
</script>

<template>
  <GlmInput
    v-bind="$attrs"
    v-model="internalModelValue"
    class="glm-amount"
    input-class="glm-amount__input"
    :size="size"
    :status="status"
    :clear-aria-label="clearAriaLabel"
    @beforeinput="preventInvalidKeys"
    @keydown.up.prevent="increment"
    @keydown.down.prevent="decrement"
  >
    <template #start="scope">
      <slot name="start" v-bind="scope" />
    </template>
    <template #end="{ buttonProps }">
      <GlmButtonGroup>
        <GlmButton
          icon-only
          :aria-label="decrementAriaLabel"
          v-bind="buttonProps"
          :status="isDecrementDisabled ? 'disabled' : undefined"
          @click="decrement"
          @mousedown.prevent
        >
          <GlmMinus />
        </GlmButton>
        <GlmButton
          icon-only
          :aria-label="incrementAriaLabel"
          v-bind="buttonProps"
          :status="isIncrementDisabled ? 'disabled' : undefined"
          @click="increment"
          @mousedown.prevent
        >
          <GlmPlus />
        </GlmButton>
      </GlmButtonGroup>
    </template>
    <template #placeholder>
      <slot name="placeholder" />
    </template>
  </GlmInput>
</template>

<style lang="scss">
.glm-amount {
  &__input {
    appearance: none;
    &::-webkit-inner-spin-button {
      display: none;
    }
  }
}
</style>

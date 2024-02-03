<script generic="T extends string" lang="ts" setup>
import type { ExtractExposed } from '@/components/component.utils';
import GlmLoader from '@/components/glm-loader/glm-loader.vue';
import type {
  SelectLoaderSlotScope,
  SelectSize,
  SelectStatus,
} from '@/components/glm-select/glm-select.utils';
import GlmChevronDownIcon from '@/components/icons/glm-chevron-down-icon.vue';
import GlmExpandTransition from '@/components/transitions/glm-expand-transition.vue';
import GlmListbox from '@/components/utils/glm-listbox.vue';
import GlmPopup from '@/components/utils/glm-popup.vue';
import { useId } from '@/composables/id.composable';
import { useLooper } from '@/composables/looper.composable';
import { contains } from '@/utils/string';
import { computed, nextTick, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue?: T;
    items: T[];
    size?: SelectSize;
    status?: SelectStatus;
  }>(),
  {
    size: 'm',
    status: 'idle',
  }
);

const emit = defineEmits<{
  'update:modelValue': [T];
}>();

const searchValue = ref('');

const ids = useId('glm-select', ['listbox', 'option', 'placeholder']);

const activeDescendant = computed(() =>
  activeIndex.value === -1 ? '' : `${ids.option}-${activeIndex.value}`
);

const filteredItems = computed(() => {
  if (!searchValue.value) return props.items;
  const value = searchValue.value;
  return props.items.filter((item) => contains(item, value));
});

const {
  activeIndex,
  highlightNext,
  highlightPrevious,
  highlightFirst,
  highlightLast,
  active: highlightedItem,
} = useLooper(filteredItems);

function getKey(item: T) {
  return item;
}

const inputRef = ref<HTMLInputElement>();
const triggerRef = ref<HTMLElement>();
const listboxRef = ref<ExtractExposed<typeof GlmListbox>>();

const isOpen = ref(false);
const hasFocus = ref(false);

function selectHighlighted() {
  if (highlightedItem.value === null) return;
  emit('update:modelValue', highlightedItem.value);
  closeDropdown();
}

function selectItem(item: T) {
  emit('update:modelValue', item);
  closeDropdown();
}

function closeDropdown() {
  isOpen.value = false;
  hasFocus.value = false;
}

async function closeDropdownAndFocusTrigger() {
  isOpen.value = false;
  hasFocus.value = false;
  await nextTick();
  triggerRef.value!.focus();
}

async function openDropdown(index?: number) {
  if (props.status === 'disabled' || props.status === 'readonly') return;
  isOpen.value = true;
  searchValue.value = '';
  await nextTick();
  activeIndex.value =
    index !== undefined
      ? index
      : props.modelValue !== undefined
        ? props.items.indexOf(props.modelValue)
        : -1;
  inputRef.value!.focus();
}

const slotScope = computed(
  (): SelectLoaderSlotScope => ({
    iconProps: {
      class: 'glm-select__loader',
    },
  })
);

defineExpose({
  // id,
  controlRef: inputRef,
});

defineSlots<{
  placeholder?: () => any;
  item?: (scope: { item: T }) => any;
  loader?: (scope: SelectLoaderSlotScope) => any;
  'no-items'?: () => any;
}>();

function scrollSelectedItem() {
  listboxRef.value!.scrollActiveItemIntoView();
}
</script>

<template>
  <div
    :class="[
      `glm-select--size-${size}`,
      {
        [`glm-select--status-${status}`]: !!status,
        'glm-select--focus': hasFocus,
        'glm-select--open': isOpen,
      },
    ]"
    class="glm-select"
  >
    <div class="glm-select__trigger-wrapper">
      <input
        v-if="isOpen"
        ref="inputRef"
        v-model="searchValue"
        :aria-activedescendant="activeDescendant"
        :aria-controls="ids.listbox"
        :aria-describedby="ids.placeholder"
        aria-expanded="true"
        aria-haspopup="listbox"
        class="glm-select__input"
        role="combobox"
        @blur="closeDropdown"
        @focus="hasFocus = true"
        @keydown.up.prevent="highlightPrevious"
        @keydown.down.prevent="highlightNext"
        @keydown.enter.prevent="selectHighlighted"
        @keydown.esc.prevent="closeDropdownAndFocusTrigger"
        @keydown.home.prevent="highlightFirst"
        @keydown.end.prevent="highlightLast"
      />
      <button
        v-else
        ref="triggerRef"
        :aria-describedby="ids.placeholder"
        class="glm-select__trigger"
        role="combobox"
        @blur="hasFocus = false"
        @click="openDropdown()"
        @focus="hasFocus = true"
      >
        <slot v-if="modelValue" :item="modelValue as T" name="item">
          {{ modelValue }}
        </slot>
      </button>
      <p
        v-show="isOpen ? !searchValue : !modelValue"
        :id="ids.placeholder"
        class="glm-select__placeholder"
      >
        <slot name="placeholder">&ZeroWidthSpace;</slot>
      </p>

      <slot v-if="status === 'loading'" name="loader" v-bind="slotScope">
        <GlmLoader class="glm-select__loader" />
      </slot>

      <GlmChevronDownIcon class="glm-select__chevron" />
    </div>

    <GlmExpandTransition @after-enter="scrollSelectedItem">
      <GlmPopup v-if="isOpen" class="glm-select__popup" :trigger="triggerRef">
        <GlmListbox
          ref="listboxRef"
          :active-index="activeIndex"
          :get-key="getKey"
          :ids="ids"
          :items="filteredItems"
          class="glm-select__suggestions"
          @mousedown.prevent
          @click:item="selectItem"
        >
          <template #item="{ item }">
            <slot :item="item" name="item">
              {{ item }}
            </slot>
          </template>
          <template #no-items>
            <slot name="no-items"> No options match your search</slot>
          </template>
        </GlmListbox>
      </GlmPopup>
    </GlmExpandTransition>
  </div>
</template>

<style lang="scss">
.glm-select {
  position: relative;

  &__trigger-wrapper {
    display: grid;
    grid-template-columns: 1fr min-content min-content;
    grid-template-areas: 'control loader chevron';
    align-items: center;
    transition: 0.25s ease-out;
    cursor: var(--_glm-select-cursor);
    outline: var(--_glm-select-outline);
    box-shadow:
      inset 0.2rem 0.2rem 0.2rem -0.125rem var(--input-default-shadow-inset-color),
      0.2rem 0.2rem 0.25rem -0.2rem var(--input-default-shadow-color);
    border-radius: var(--border-radius-pill);
    background: var(--_glm-select-background, var(--input-default-background));
    color: var(--_glm-select-color, var(--font-color-light));
    font-size: var(--_glm-select-font-size);
    line-height: var(--_glm-select-line-height);
  }

  &__input {
    grid-area: control;
    z-index: 1;
    outline: none;
  }

  &__trigger {
    display: flex;
    grid-area: control;
    grid-row: 1;
    grid-column: 1/3;
    flex-flow: row nowrap;
    align-items: center;
    gap: $spacing-m;
    cursor: inherit;
    height: 100%;
  }

  &__placeholder {
    grid-area: control;
    color: var(--font-color-faded);
  }

  &__input,
  &__trigger,
  &__placeholder {
    padding-inline-start: var(--_glm-select-start-padding);
    padding-block: var(--_glm-select-padding);
  }

  &__input,
  &__trigger {
    z-index: 1;
  }

  &__loader {
    grid-area: loader;
    margin-inline: $spacing-2xs;
  }

  &__chevron {
    grid-area: chevron;
    transform: rotateX(var(--_glm-select-chevron-rotation));
    transition: transform 0.25s ease-in-out;
    margin-inline: $spacing-m;
    color: var(--font-color-faded);
    font-size: var(--_glm-select-icon-size);
  }

  &__popup {
    @extend %box-3, %blur-m;
    position: absolute;
    z-index: 2;
    margin-block: $spacing-m;
    border-radius: var(--border-radius-l);
    width: 100%;
    overflow: hidden;
  }

  &__suggestions {
    width: 100%;
  }

  // Sizes
  &--size-m {
    --_glm-select-padding: #{$spacing-4xs};
    --_glm-select-line-height: 2.5rem;
    --_glm-select-font-size: var(--font-size-m);
    --_glm-select-start-padding: #{$spacing-xl};
    --_glm-select-icon-size: var(--font-size-xl);
  }

  &--size-l {
    --_glm-select-padding: #{$spacing-2xs};
    --_glm-select-line-height: 2.75rem;
    --_glm-select-font-size: var(--font-size-l);
    --_glm-select-start-padding: #{$spacing-2xl};
    --_glm-select-icon-size: var(--font-size-2xl);
  }

  // Status
  &--status-error {
    --_glm-select-background: var(--input-error-background);
    --_glm-select-background-focus: var(--input-error-background-focus);
    --_glm-select-border-color: var(--input-error-border-color);
  }

  &--status-disabled {
    opacity: 0.8;
    pointer-events: none;
    --_glm-select-cursor: default;
    filter: grayscale(0.5) brightness(0.5);
  }

  &--status-readonly {
    opacity: 0.8;
    --_glm-select-cursor: default;
    filter: grayscale(0.2);
  }

  &--focus {
    --_glm-select-background: var(
      --_glm-select-background-focus,
      var(--input-default-background-focus)
    );
    --_glm-select-color: var(--_glm-select-color-focus, var(--font-color-lightest));
    --_glm-select-outline: #{$outline-value};
  }

  &--open {
    --_glm-select-chevron-rotation: 180deg;
  }
}
</style>

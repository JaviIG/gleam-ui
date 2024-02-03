<script lang="ts" setup>
import { useId } from '../../composables/id.composable';
import GlmButton from '../glm-button/glm-button.vue';
import GlmChevronDownIcon from '../icons/glm-chevron-down-icon.vue';
import GlmExpandTransition from '../transitions/glm-expand-transition.vue';
import GlmPopup from '../utils/glm-popup.vue';
import { DropdownApiKey, type DropdownMenuVariant } from './glm-dropdown-menu.utils';
import { computed, onMounted, provide, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    variant?: DropdownMenuVariant;
    iconOnly?: boolean;
  }>(),
  {}
);
const ids = useId('dropdown-menu', ['items']);

// Expand/Collapse
const isExpanded = ref(false);
const listRef = ref<HTMLElement>();
const triggerRef = ref<InstanceType<typeof GlmButton>>();

function toggle() {
  isExpanded.value = !isExpanded.value;
}

function collapse() {
  isExpanded.value = false;
}

function expand() {
  isExpanded.value = true;
}

function collapseAndFocusTrigger() {
  collapse();
  triggerRef.value?.controlRef?.focus();
}

// Navigation
const itemsElements = computed(() => {
  if (!listRef.value) return [];
  return Array.from(listRef.value.querySelectorAll<HTMLElement>('.glm-dropdown-menu-action'));
});

watch(itemsElements, (elements) => {
  elements.at(0)?.focus();
});

function focusNext() {
  const current = document.activeElement;
  if (!current) return;
  const elements = itemsElements.value;
  const currentIndex = elements.indexOf(current as HTMLElement);
  const nextIndex = currentIndex >= elements.length - 1 ? 0 : currentIndex + 1;
  elements[nextIndex]?.focus();
}

function focusPrevious() {
  const current = document.activeElement;
  if (!current) return;
  const elements = itemsElements.value;
  const currentIndex = elements.indexOf(current as HTMLElement);
  const nextIndex = currentIndex <= 0 ? elements.length - 1 : currentIndex - 1;
  elements[nextIndex]?.focus();
}

function focusFirst() {
  itemsElements.value.at(0)?.focus();
}

function focusLast() {
  itemsElements.value.at(-1)?.focus();
}

provide(DropdownApiKey, { collapse: collapseAndFocusTrigger });
defineSlots<{ trigger: () => any; items: () => any }>();
</script>

<template>
  <div
    :class="[
      {
        'glm-dropdown-menu--expanded': isExpanded,
      },
    ]"
    class="glm-dropdown-menu"
  >
    <GlmButton
      ref="triggerRef"
      :aria-controls="ids.items"
      :aria-expanded="isExpanded"
      :tabindex="isExpanded ? -1 : 0"
      aria-haspopup="true"
      size="m"
      v-bind="props"
      @click="toggle"
      @mousedown.prevent
    >
      <slot name="trigger" />
      <GlmChevronDownIcon v-if="!iconOnly" class="glm-dropdown-menu__chevron" />
    </GlmButton>
    <glm-expand-transition>
      <glm-popup
        v-if="isExpanded"
        :trigger="triggerRef?.controlRef"
        class="glm-dropdown-menu__items-list-wrapper"
      >
        <ul
          :id="ids.items"
          ref="listRef"
          class="glm-dropdown-menu__items-list"
          role="menu"
          @focusin="expand"
          @focusout="collapse"
          @keydown.down="focusNext"
          @keydown.up="focusPrevious"
          @keydown.esc="collapseAndFocusTrigger"
          @keydown.home="focusFirst"
          @keydown.end="focusLast"
          @mousedown.prevent
        >
          <slot name="items" />
        </ul>
      </glm-popup>
    </glm-expand-transition>
  </div>
</template>

<style lang="scss" scoped>
.glm-dropdown-menu {
  position: relative;

  &__items-list-wrapper {
    @extend %box-3, %blur-m;
    position: absolute;
    top: 100%;
    z-index: 2;
    margin-block: $spacing-m;
    border-radius: var(--border-radius-l);
    overflow: hidden;
  }

  &__items-list {
    display: flex;
    flex-flow: column nowrap;
    border-radius: inherit;
    max-height: 256px;
    overflow: auto;
    @include scrollbar();
  }

  &__chevron {
    transform: rotateX(var(--_glm-dropdown-menu-chevron-rotation));
    transition: transform 0.25s ease-in-out;
    color: var(--font-color-faded);
    font-size: var(--font-size-xl);
  }

  // Status
  &--expanded {
    --_glm-dropdown-menu-chevron-rotation: 180deg;
  }
}
</style>

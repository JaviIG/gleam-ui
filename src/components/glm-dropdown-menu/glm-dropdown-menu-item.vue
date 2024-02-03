<script generic="T" lang="ts" setup>
import { DropdownApiKey } from '@/components/glm-dropdown-menu/glm-dropdown-menu.utils';
import { inject } from 'vue';

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
  }>(),
  {}
);

const emit = defineEmits<{
  click: [MouseEvent];
}>();
const slots = defineSlots<{
  default: () => any;
}>();

function emitClick(event: MouseEvent) {
  if (props.disabled) return;
  emit('click', event);
  dropdownApi.collapse();
}

const dropdownApi = inject(DropdownApiKey)!;

function focus(event: Event) {
  (event.target as HTMLElement).focus();
}
</script>

<template>
  <li
    :class="{
      'glm-dropdown-menu-item--disabled': disabled,
    }"
    class="glm-dropdown-menu-item"
  >
    <button
      :aria-disabled="disabled"
      class="glm-dropdown-menu-item__action glm-dropdown-menu-action"
      role="menuitem"
      tabindex="-1"
      @click="emitClick"
      @mouseenter="focus"
      @pointerdown="focus"
    >
      <slot />
    </button>
  </li>
</template>

<style lang="scss" scoped>
.glm-dropdown-menu-item {
  &__action {
    transition: background-color 0.25s ease-in-out;
    cursor: pointer;
    background: transparent;
    padding: $spacing-s $spacing-xl;
    width: 100%;
    color: var(--font-color-light);
    white-space: nowrap;
    &:focus {
      background: transparentize($neutral-95, 10%);
      color: var(--font-color-lightest);
    }
  }
}

.glm-dropdown-menu-action {
}
</style>

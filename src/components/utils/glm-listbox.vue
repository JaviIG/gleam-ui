<script setup lang="ts" generic="T">
import { ref, watch } from 'vue';

const props = defineProps<{
  activeIndex: number;
  ids: {
    listbox: string;
    option: string;
  };
  items: T[];
  getKey: (item: T) => string | number | symbol;
}>();

const emit = defineEmits<{
  'click:item': [T];
}>();

const listboxRef = ref<HTMLElement>();

watch(() => props.activeIndex, scrollActiveItemIntoView);

function scrollActiveItemIntoView() {
  if (props.activeIndex === -1) return;
  if (!listboxRef.value) return;
  const listItem = listboxRef.value?.children.item(props.activeIndex);
  if (!listItem) return;
  scrollIntoViewIfNeeded({
    parent: listboxRef.value,
    child: listItem as HTMLElement,
  });
}

function scrollIntoViewIfNeeded({ parent, child }: ScrollIntoViewOptions) {
  const parentBounds = parent.getBoundingClientRect();
  const childBounds = child.getBoundingClientRect();
  if (isBelow({ parent: parentBounds, child: childBounds })) {
    const parentBottom = parentBounds.top + parentBounds.height;
    const childBottom = childBounds.top + childBounds.height;
    parent.scrollTop += childBottom - parentBottom;
  } else if (isAbove({ parent: parentBounds, child: childBounds })) {
    parent.scrollTop += childBounds.top - parentBounds.top;
  }
}

function isBelow({ parent, child }: IsVisibleOptions) {
  const parentBottom = parent.top + parent.height;
  const childBottom = child.top + child.height;
  return childBottom > parentBottom;
}

function isAbove({ parent, child }: IsVisibleOptions) {
  const parentTop = parent.top;
  const childTop = child.top;
  return childTop < parentTop;
}

type ScrollIntoViewOptions = {
  parent: HTMLElement;
  child: HTMLElement;
};

type IsVisibleOptions = {
  parent: DOMRect;
  child: DOMRect;
};

function emitClick(item: T) {
  emit('click:item', item);
}

defineSlots<{
  item: (scope: { item: T }) => any;
  'no-items': () => any;
}>();

defineExpose({
  scrollActiveItemIntoView,
});
</script>

<template>
  <ul :id="ids.listbox" ref="listboxRef" class="glm-listbox" role="listbox">
    <li
      v-for="(item, index) in items"
      :id="`${ids.option}-${index}`"
      :key="getKey(item)"
      class="glm-listbox__item"
      :class="{
        'glm-listbox__item--active': index === activeIndex,
      }"
      role="option"
      @click="emitClick(item)"
    >
      <slot name="item" :item="item" />
    </li>

    <li v-if="!items.length" class="glm-listbox__item">
      <slot name="no-items" />
    </li>
  </ul>
</template>

<style lang="scss">
.glm-listbox {
  display: flex;
  flex-flow: column nowrap;
  border-radius: inherit;
  max-height: 256px;
  overflow: auto;
  @include scrollbar();

  &__item {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: $spacing-m;
    cursor: pointer;
    padding: $spacing-s $spacing-xl;
    color: var(--font-color-light);

    &:hover,
    &--active {
      background: transparentize($neutral-95, 10%);
      color: var(--font-color-lightest);
    }
  }
}
</style>

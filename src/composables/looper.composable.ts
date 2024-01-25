import { computed, isRef, ref, unref, watch } from 'vue';
import type { MaybeRef } from 'vue';

export function useLooper<T>(data: MaybeRef<T[]>) {
  const activeIndex = ref(-1);
  const active = computed(() => {
    if (activeIndex.value === -1) return null;
    return unref(data)[activeIndex.value];
  });

  function highlightNext() {
    const itemsLength = unref(data).length;
    activeIndex.value = activeIndex.value >= itemsLength - 1 ? 0 : activeIndex.value + 1;
  }

  function highlightPrevious() {
    const itemsLength = unref(data).length;
    activeIndex.value = activeIndex.value <= 0 ? itemsLength - 1 : activeIndex.value - 1;
  }

  function highlightFirst() {
    activeIndex.value = 0;
  }

  function highlightLast() {
    activeIndex.value = unref(data).length - 1;
  }

  if (isRef(data)) {
    watch(data, () => {
      activeIndex.value = -1;
    });
  }

  return {
    activeIndex,
    active,
    highlightNext,
    highlightPrevious,
    highlightFirst,
    highlightLast,
  };
}

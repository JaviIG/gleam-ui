<script setup lang="ts">
function expand(el: Element) {
  if (!(el instanceof HTMLElement)) return;
  el.style.height = '0px';
  el.style.height = `${el.scrollHeight}px`;
}

function collapse(el: Element) {
  if (!(el instanceof HTMLElement)) return;
  el.style.height = `${el.clientHeight}px`;
  el.getBoundingClientRect();
  el.style.height = `0px`;
}

function clean(el: Element) {
  if (!(el instanceof HTMLElement)) return;
  el.style.height = '';
}
</script>

<template>
  <transition
    name="glm-expand-transition-"
    @enter="expand"
    @leave="collapse"
    @after-enter="clean"
    @after-leave="clean"
  >
    <slot />
  </transition>
</template>

<style lang="scss">
.glm-expand-transition {
  &--enter-active,
  &--leave-active {
    transition: height 0.15s ease-in-out;
  }
}
</style>

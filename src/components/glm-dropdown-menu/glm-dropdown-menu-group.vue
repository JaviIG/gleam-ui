<script generic="T" lang="ts" setup>
withDefaults(
  defineProps<{
    name: string;
  }>(),
  {}
);

defineSlots<{
  default: () => any;
}>();
</script>

<template>
  <li class="glm-dropdown-menu-group">
    <ul :aria-label="name" role="group">
      <slot />
    </ul>
  </li>
</template>

<style lang="scss" scoped>
.glm-dropdown-menu-group {
  display: flex;
  flex-flow: column nowrap;
  border-inline: none;

  &:after,
  &:before {
    opacity: 0.1;
    margin-block: $spacing-2xs;
    background: $neutral-95;
    background-clip: content-box;
    padding-inline: $spacing-m;
    width: 100%;
    height: 1px;
  }

  :has(+ *) {
    &:after {
      content: '';
    }
  }

  * + & {
    &:before {
      content: '';
    }
  }
}

.glm-dropdown-menu-action {
  color: white;
}
</style>

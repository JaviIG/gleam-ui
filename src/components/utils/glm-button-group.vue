<script setup lang="ts"></script>

<template>
  <div class="glm-button-group">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.glm-button-group {
  display: flex;
  flex-flow: row nowrap;
  :not(:first-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  :not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
}
</style>

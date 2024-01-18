<script setup lang="ts">
import GlmBox from '@/components/GlmBox.vue';
</script>

<template>
  <div class="glm-demo">
    <glm-box level="1" blur="m" class="box">
      <glm-box level="2">
        <glm-box level="3" />
      </glm-box>
    </glm-box>
  </div>
</template>

<style lang="scss" scoped>
.glm-demo {
  display: grid;
  place-items: center;
  background: url('/images/sunset-living-room.jpg') center center;
  background-size: cover;
  width: 100vw;
  height: 100vh;
}

.box {
  width: 256px;
  height: 256px;
}
</style>

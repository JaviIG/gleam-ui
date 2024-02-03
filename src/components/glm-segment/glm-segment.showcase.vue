<script lang="ts" setup>
import type { ExtractProps } from '../component.utils';
import { SegmentSizes, SegmentVariants } from './glm-segment.utils';
import GlmSegment from './glm-segment.vue';
import { reactive } from 'vue';

const options = ['Small', 'Medium', 'Large'];
const testCases = SegmentVariants.flatMap((variant) =>
  SegmentSizes.flatMap((size) => ({
    props: reactive<ExtractProps<typeof GlmSegment>>({
      variant,
      size,
      modelValue: options[0],
      options,
    }),
  }))
);

function getTitle(props: ExtractProps<typeof GlmSegment>) {
  return Object.entries(props)
    .map((entry) => entry.join('='))
    .join(' - ');
}
</script>

<template>
  <div class="glm-showcase">
    <GlmSegment
      v-for="({ props }, index) in testCases"
      :key="index"
      v-bind="props"
      v-model="props.modelValue"
      :title="getTitle(props)"
      data-testid="glm-segment"
    />
  </div>
</template>

<style lang="scss" scoped>
.glm-showcase {
  display: flex;
  flex-flow: column nowrap;
  gap: 2rem;
}
</style>

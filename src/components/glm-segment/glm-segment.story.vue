<script lang="ts" setup>
import type { ExtractProps } from '../component.utils';
import GlmSegmentShowcase from './glm-segment.showcase.vue';
import { SegmentSizes, SegmentVariants } from './glm-segment.utils';
import GlmSegment from './glm-segment.vue';
import { reactive } from 'vue';

type Props = ExtractProps<typeof GlmSegment<string>>;
const state = reactive<Props>({
  modelValue: 'Small',
  options: ['Small', 'Medium', 'Large'],
  size: 'm',
  variant: 'primary',
});
</script>
<template>
  <Story auto-props-disabled title="GlmSegment">
    <Variant title="Default">
      <template #controls>
        <HstButtonGroup v-model="state.size" :options="SegmentSizes" title="Size" />
        <HstButtonGroup v-model="state.variant" :options="SegmentVariants" title="Variant" />
      </template>
      <GlmSegment v-bind="state" v-model="state.modelValue" />
    </Variant>
    <Variant title="All">
      <GlmSegmentShowcase />
    </Variant>
  </Story>
</template>

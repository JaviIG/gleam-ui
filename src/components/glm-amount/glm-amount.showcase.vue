<script lang="ts" setup>
import type { ExtractProps } from '../component.utils';
import GlmFileIcon from '../icons/glm-file-icon.vue';
import { AmountSizes, AmountStatuses } from './glm-amount.utils';
import GlmAmount from './glm-amount.vue';

const testCases = AmountStatuses.flatMap((status) =>
  AmountSizes.flatMap((size) =>
    [true, false].flatMap((startIcon) =>
      [null, 0, 5, 10].flatMap((modelValue) => ({
        props: {
          status,
          size,
          modelValue,
          min: 0,
          max: 10,
        },
        startIcon,
      }))
    )
  )
);

function getTitle(props: ExtractProps<typeof GlmAmount>) {
  return Object.entries(props)
    .map((entry) => entry.join('='))
    .join(' - ');
}
</script>

<template>
  <div class="glm-showcase">
    <GlmAmount
      v-for="({ startIcon, props }, index) in testCases"
      :key="index"
      :title="getTitle(props)"
      data-testid="glm-amount"
      v-bind="props"
    >
      <template v-if="startIcon" #start="{ iconProps }">
        <GlmFileIcon v-bind="iconProps" />
      </template>

      <template #placeholder> Search in Albums</template>
    </GlmAmount>
  </div>
</template>

<style lang="scss" scoped>
.glm-showcase {
  display: flex;
  flex-flow: column nowrap;
  gap: 2rem;
}
</style>

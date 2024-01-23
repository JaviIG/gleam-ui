<script setup lang="ts">
import type { ExtractProps } from '@/components/component.utils';
import { ButtonSizes, ButtonVariants } from '@/components/glm-button/glm-button.utils';
import GlmButton from '@/components/glm-button/glm-button.vue';
import GlmLike from '@/components/icons/glm-like.vue';

const testCases = ButtonVariants.flatMap((variant) =>
  (['idle', 'disabled', 'loading'] as const).flatMap((status) =>
    ButtonSizes.flatMap((size) =>
      [false, true].flatMap((iconOnly) => ({
        size,
        variant,
        iconOnly,
        disabled: status === 'disabled',
        loading: status === 'loading',
      }))
    )
  )
);

function getTitle(props: ExtractProps<typeof GlmButton>) {
  return Object.entries(props)
    .map((entry) => entry.join('='))
    .join(' - ');
}
</script>

<template>
  <div class="glm-showcase">
    <GlmButton
      v-for="(testCase, index) in testCases"
      :key="index"
      v-bind="testCase"
      data-testid="glm-button"
      :title="getTitle(testCase)"
    >
      <template v-if="testCase.iconOnly"><GlmLike /></template>
      <template v-else>Click me</template>
    </GlmButton>
  </div>
</template>

<style scoped lang="scss">
.glm-showcase {
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
  gap: 2rem;
}
</style>

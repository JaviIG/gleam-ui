<script setup lang="ts">
import type { ExtractProps } from '../component.utils';
import GlmLike from '../icons/glm-like.vue';
import { ButtonSizes, ButtonStatuses, ButtonVariants } from './glm-button.utils';
import GlmButton from './glm-button.vue';

const testCases = ButtonVariants.flatMap((variant) =>
  ButtonStatuses.flatMap((status) =>
    ButtonSizes.flatMap((size) =>
      [false, true].flatMap(
        (iconOnly): ExtractProps<typeof GlmButton> => ({
          size,
          variant,
          iconOnly,
          status,
        })
      )
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
    <div v-for="(props, index) in testCases" :key="index" class="glm-showcase__case">
      <label class="glm-showcase__label">{{ getTitle(props) }}</label>
      <GlmButton v-bind="props" data-testid="glm-button" :title="getTitle(props)">
        <template v-if="props.iconOnly"><GlmLike /></template>
        <template v-else>Click me</template>
      </GlmButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.glm-showcase {
  display: flex;
  flex-flow: row wrap;
  gap: 1.5rem;

  &__case {
    display: flex;
    flex-flow: column nowrap;
    gap: $spacing-m;
    padding: $spacing-xs 0;
  }

  &__label {
    color: var(--font-color-light);
    font-size: var(--font-size-l);
  }
}
</style>

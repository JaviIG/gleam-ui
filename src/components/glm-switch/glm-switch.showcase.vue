<script lang="ts" setup>
import { SwitchStatuses } from './glm-switch.utils';
import type { ExtractProps } from '@/components/component.utils';
import GlmSwitch from '@/components/glm-switch/glm-switch.vue';
import { reactive } from 'vue';

const testCases = SwitchStatuses.flatMap((status) =>
  [false, true].flatMap((modelValue) => ({
    props: reactive<ExtractProps<typeof GlmSwitch>>({
      status,
      modelValue,
    }),
  }))
);

function getTitle(props: ExtractProps<typeof GlmSwitch>) {
  return Object.entries(props)
    .filter(([name]) => name !== 'items')
    .map((entry) => entry.join(': '))
    .join(' - ');
}
</script>

<template>
  <div class="glm-showcase">
    <div v-for="({ props }, index) in testCases" :key="index" class="glm-showcase__case">
      <label class="glm-showcase__label">{{ getTitle(props) }}</label>
      <GlmSwitch
        v-bind="props"
        v-model="props.modelValue"
        data-testid="glm-switch"
        :title="getTitle(props)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.glm-showcase {
  display: flex;
  flex-flow: column nowrap;
  gap: 2rem;

  &__case {
    display: flex;
    flex-flow: column nowrap;
    gap: $spacing-m;
    padding: $spacing-s 0;
  }

  &__label {
    color: var(--font-color-light);
    font-size: var(--font-size-l);
  }
}
</style>

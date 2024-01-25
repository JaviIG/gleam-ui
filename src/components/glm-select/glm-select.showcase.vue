<script lang="ts" setup>
import { CountriesList } from '@/_histoire/mocks/countries';
import type { ExtractProps } from '@/components/component.utils';
import { InputSizes, InputStatuses } from '@/components/glm-input/glm-input.utils';
import GlmSelect from '@/components/glm-select/glm-select.vue';
import { reactive } from 'vue';

const testCases = InputStatuses.flatMap((status) =>
  InputSizes.flatMap((size) =>
    [undefined, 'Spain'].flatMap((modelValue) => ({
      props: reactive<ExtractProps<typeof GlmSelect>>({
        status,
        size,
        modelValue,
        items: CountriesList,
      }),
    }))
  )
);

function getTitle(props: ExtractProps<typeof GlmSelect>) {
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
      <GlmSelect
        v-model="props.modelValue"
        :title="getTitle(props)"
        data-testid="glm-select"
        v-bind="props"
      >
        <template #placeholder>Pick a country</template>
      </GlmSelect>
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

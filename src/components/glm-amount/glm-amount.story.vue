<script lang="ts" setup>
import GlmSearch from '../icons/glm-search.vue';
import GlmAmountShowcase from './glm-amount.showcase.vue';
import { AmountSizes, AmountStatuses } from './glm-amount.utils';
import GlmAmount from './glm-amount.vue';
import { reactive } from 'vue';

type Props = InstanceType<typeof GlmAmount>['$props'];
const state = reactive<Props>({
  status: 'idle',
  modelValue: null,
  size: 'm',
  min: 0,
  max: 100,
});
</script>
<template>
  <Story auto-props-disabled title="GlmAmount">
    <Variant title="Default">
      <template #controls>
        <HstButtonGroup v-model="state.size" :options="AmountSizes" title="Size" />
        <HstButtonGroup v-model="state.status" :options="AmountStatuses" title="Status" />
        <HstNumber v-model="state.min" title="Min" />
        <HstNumber v-model="state.max" title="Max" />
      </template>
      <GlmAmount v-bind="state" v-model="state.modelValue">
        <template #placeholder>Quantity</template>
      </GlmAmount>
    </Variant>

    <Variant title="With Controls">
      <template #controls>
        <HstButtonGroup v-model="state.size" :options="AmountSizes" title="Size" />
        <HstButtonGroup v-model="state.status" :options="AmountStatuses" title="Status" />
      </template>

      <GlmAmount v-bind="state" v-model="state.modelValue">
        <template #start="{ iconProps }">
          <GlmSearch v-bind="iconProps" variant="transparent" />
        </template>
        <template #placeholder>Quantity</template>
      </GlmAmount>
    </Variant>

    <Variant title="All">
      <GlmAmountShowcase />
    </Variant>
  </Story>
</template>

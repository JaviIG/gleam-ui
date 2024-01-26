<script lang="ts" setup>
import GlmSelectShowcase from './glm-select.showcase.vue';
import { SelectSizes, SelectStatuses } from './glm-select.utils';
import GlmSelect from './glm-select.vue';
import { CountriesList } from '@/_histoire/mocks/countries';
import type { ExtractProps } from '@/components/component.utils';
import GlmLike from '@/components/icons/glm-like.vue';
import { reactive } from 'vue';

type Props = ExtractProps<typeof GlmSelect<string>>;
const state = reactive<Props>({
  modelValue: '',
  items: CountriesList,
  size: 'm',
  status: 'idle',
});
</script>
<template>
  <Story auto-props-disabled title="GlmSelect">
    <Variant title="Default">
      <template #controls>
        <HstButtonGroup v-model="state.size" :options="SelectSizes" title="Size" />
        <HstButtonGroup v-model="state.status" :options="SelectStatuses" title="Status" />
      </template>
      <GlmSelect v-bind="state" v-model="state.modelValue">
        <template #placeholder>Select a country</template>
        <template #item="{ item }">
          <GlmLike />
          <span>{{ item }}</span>
        </template>
      </GlmSelect>
    </Variant>
    <Variant title="All">
      <GlmSelectShowcase />
    </Variant>
  </Story>
</template>

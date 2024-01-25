<script lang="ts" setup>
import GlmSelectShowcase from './glm-select.showcase.vue';
import GlmSelect from './glm-select.vue';
import { CountriesList } from '@/_histoire/mocks/countries';
import type { ExtractProps } from '@/components/component.utils';
import GlmLike from '@/components/icons/glm-like.vue';
import { reactive } from 'vue';

type Props = ExtractProps<typeof GlmSelect<string>>;
const state = reactive<Props>({
  modelValue: '',
  items: CountriesList,
});
</script>
<template>
  <Story title="GlmSelect">
    <Variant title="Default">
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

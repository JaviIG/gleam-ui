<script lang="ts" setup>
import GlmButton from '../glm-button/glm-button.vue';
import GlmLike from '../icons/glm-like.vue';
import GlmSearch from '../icons/glm-search.vue';
import GlmInputShowcase from './glm-input.showcase.vue';
import { InputSizes, InputStatuses } from './glm-input.utils';
import GlmInput from './glm-input.vue';
import { reactive } from 'vue';

type Props = InstanceType<typeof GlmInput>['$props'];
const state = reactive<Props>({
  status: 'idle',
  modelValue: '',
  size: 'm',
});
</script>
<template>
  <Story auto-props-disabled title="GlmInput">
    <Variant title="Default">
      <template #controls>
        <HstButtonGroup v-model="state.size" :options="InputSizes" title="Size" />
        <HstButtonGroup v-model="state.status" :options="InputStatuses" title="Status" />
      </template>
      <GlmInput v-bind="state">
        <template #placeholder> Search in Albums</template>
      </GlmInput>
    </Variant>

    <Variant title="With Controls">
      <template #controls>
        <HstButtonGroup v-model="state.size" :options="InputSizes" title="Size" />
        <HstButtonGroup v-model="state.status" :options="InputStatuses" title="Status" />
      </template>

      <GlmInput v-bind="state">
        <template #start="{ iconProps }">
          <GlmSearch variant="transparent" v-bind="iconProps" />
        </template>
        <template #placeholder> Search in Albums</template>
        <template #end="{ buttonProps }">
          <GlmButton icon-only variant="transparent" v-bind="buttonProps">
            <GlmLike />
          </GlmButton>
        </template>
      </GlmInput>
    </Variant>

    <Variant title="All">
      <GlmInputShowcase />
    </Variant>
  </Story>
</template>

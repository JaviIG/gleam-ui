<script lang="ts" setup>
import GlmSwitchShowcase from './glm-switch.showcase.vue';
import GlmSwitch from './glm-switch.vue';
import type { ExtractProps } from '@/components/component.utils';
import GlmLike from '@/components/icons/glm-like.vue';
import { reactive } from 'vue';

type Props = ExtractProps<typeof GlmSwitch>;
const state = reactive<Props>({
  modelValue: false,
});
</script>
<template>
  <Story title="GlmSwitch">
    <Variant title="Default">
      <GlmSwitch v-model="state.modelValue" v-bind="state">
        <template #placeholder>Switch a country</template>
        <template #item="{ item }">
          <GlmLike />
          <span>{{ item }}</span>
        </template>
      </GlmSwitch>
    </Variant>
    <Variant title="All">
      <GlmSwitchShowcase />
    </Variant>
  </Story>
</template>

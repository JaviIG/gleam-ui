<script lang="ts" setup>
import GlmSwitchShowcase from './glm-switch.showcase.vue';
import GlmSwitch from './glm-switch.vue';
import type { ExtractProps } from '@/components/component.utils';
import { reactive } from 'vue';

type Props = ExtractProps<typeof GlmSwitch>;
const state = reactive<Props>({
  modelValue: false,
});
</script>
<template>
  <Story title="GlmSwitch">
    <Variant title="Default">
      <GlmSwitch v-bind="state" v-model="state.modelValue" />
    </Variant>
    <Variant title="All">
      <GlmSwitchShowcase />
    </Variant>
  </Story>
</template>

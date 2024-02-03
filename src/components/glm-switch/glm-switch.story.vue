<script lang="ts" setup>
import type { ExtractProps } from '../component.utils';
import GlmSwitchShowcase from './glm-switch.showcase.vue';
import GlmSwitch from './glm-switch.vue';
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

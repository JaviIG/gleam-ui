<script lang="ts" setup>
import GlmButtonShowcase from './glm-button.showcase.vue';
import GlmButton from './glm-button.vue';
import {
  ButtonSizes,
  ButtonStatuses,
  ButtonVariants,
} from '@/components/glm-button/glm-button.utils';
import GlmLike from '@/components/icons/glm-like.vue';
import { logEvent } from 'histoire/client';
import { reactive } from 'vue';

type Props = InstanceType<typeof GlmButton>['$props'];
const state = reactive<Props>({
  kind: 'button',
  size: 'm',
  variant: 'primary',
  status: 'idle',
  iconOnly: false,
});
const kindOptions = ['button', 'external-link', 'internal-link'];
</script>
<template>
  <Story auto-props-disabled title="GlmButton">
    <Variant title="Default">
      <template #controls>
        <HstButtonGroup v-model="state.kind" :options="kindOptions" title="Kind" />
        <HstButtonGroup v-model="state.size" :options="ButtonSizes" title="Size" />
        <HstButtonGroup v-model="state.variant" :options="ButtonVariants" title="Variant" />
        <HstButtonGroup v-model="state.status" :options="ButtonStatuses" title="Status" />
        <HstCheckbox v-model="state.iconOnly" title="Only Icon" />
      </template>
      <GlmButton v-bind="state" @click="logEvent('click', $event)">
        <GlmLike v-if="state.iconOnly" />
        <template v-else> Click me</template>
      </GlmButton>
    </Variant>

    <Variant title="All">
      <GlmButtonShowcase />
    </Variant>
  </Story>
</template>

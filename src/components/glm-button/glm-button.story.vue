<script lang="ts" setup>
import GlmVariantWrapper from '../../_histoire/glm-variant-wrapper.vue';
import GlmButtonShowcase from './glm-button.showcase.vue';
import GlmButton from './glm-button.vue';
import { ButtonSizes, ButtonVariants } from '@/components/glm-button/glm-button.utils';
import GlmLike from '@/components/icons/glm-like.vue';
import { logEvent } from 'histoire/client';
import { reactive } from 'vue';

type Props = InstanceType<typeof GlmButton>['$props'];
const state = reactive<Props>({
  kind: 'button',
  size: 'm',
  variant: 'primary',
  disabled: false,
  loading: false,
  iconOnly: false,
});
const kindOptions = ['button', 'external-link', 'internal-link'];
const sizeOptions = ButtonSizes;
const variantOptions = ButtonVariants;
</script>
<template>
  <Story title="GlmButton" auto-props-disabled>
    <Variant title="Default">
      <template #controls>
        <HstButtonGroup v-model="state.kind" title="Kind" :options="kindOptions" />
        <HstButtonGroup v-model="state.size" title="Size" :options="sizeOptions" />
        <HstButtonGroup v-model="state.variant" title="Variant" :options="variantOptions" />
        <HstCheckbox v-model="state.iconOnly" title="Only Icon" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.loading" title="Loading" />
      </template>
      <GlmButton v-bind="state" @click="logEvent('click', $event)">
        <GlmLike v-if="state.iconOnly" />
        <template v-else> Click me </template>
      </GlmButton>
    </Variant>

    <Variant title="All">
      <GlmButtonShowcase />
    </Variant>
  </Story>
</template>

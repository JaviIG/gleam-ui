<script lang="ts" setup>
import { ButtonSizes, ButtonVariants } from '@/components/glm-button/glm-button.utils';
import GlmButton from '@/components/glm-button/glm-button.vue';
import GlmInputShowcase from '@/components/glm-input/glm-input.showcase.vue';
import GlmInput from '@/components/glm-input/glm-input.vue';
import GlmLike from '@/components/icons/glm-like.vue';
import { reactive } from 'vue';

type Props = InstanceType<typeof GlmInput>['$props'];
const state = reactive<Props>({
  status: 'idle',
  modelValue: '',
  size: 'm',
});
const kindOptions = ['button', 'external-link', 'internal-link'];
const sizeOptions = ButtonSizes;
const variantOptions = ButtonVariants;
</script>
<template>
  <Story title="GlmInput">
    <Variant title="Default">
      <GlmInput v-bind="state">
        <template #placeholder> Search in Albums </template>
      </GlmInput>
    </Variant>

    <Variant title="With Controls">
      <GlmInput v-bind="state">
        <template #start
          ><GlmButton variant="transparent" icon-only size="s"><GlmLike /></GlmButton
        ></template>
        <template #placeholder> Search in Albums </template>
        <template #end
          ><GlmButton variant="transparent" icon-only size="s"><GlmLike /></GlmButton
        ></template>
      </GlmInput>
    </Variant>

    <Variant title="All">
      <GlmInputShowcase />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import type { ExtractProps } from '../component.utils';
import GlmButton from '../glm-button/glm-button.vue';
import GlmFileIcon from '../icons/glm-file-icon.vue';
import GlmSearch from '../icons/glm-search.vue';
import { InputSizes, InputStatuses } from './glm-input.utils';
import GlmInput from './glm-input.vue';

const testCases = InputStatuses.flatMap((status) =>
  InputSizes.flatMap((size) =>
    [true, false].flatMap((startIcon) =>
      [true, false].flatMap((searchAction) =>
        ['', 'Some text'].flatMap((modelValue) => ({
          status,
          size,
          modelValue,
          startIcon,
          searchAction,
        }))
      )
    )
  )
);

function getTitle(props: ExtractProps<typeof GlmInput>) {
  return Object.entries(props)
    .map((entry) => entry.join('='))
    .join(' - ');
}
</script>

<template>
  <div class="glm-showcase">
    <GlmInput
      v-for="({ startIcon, searchAction, ...props }, index) in testCases"
      :key="index"
      v-bind="props"
      data-testid="glm-input"
      :title="getTitle(props)"
    >
      <template v-if="startIcon" #start="{ iconProps }">
        <GlmFileIcon v-bind="iconProps" />
      </template>

      <template #placeholder> Search in Albums </template>

      <template v-if="searchAction" #end="{ buttonProps }">
        <GlmButton variant="primary" v-bind="buttonProps" icon-only>
          <GlmSearch />
        </GlmButton>
      </template>
    </GlmInput>
  </div>
</template>

<style scoped lang="scss">
.glm-showcase {
  display: flex;
  flex-flow: column nowrap;
  gap: 2rem;
}
</style>

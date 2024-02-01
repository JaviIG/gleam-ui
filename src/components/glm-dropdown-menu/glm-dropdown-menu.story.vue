<script lang="ts" setup>
// import GlmDropdownMenuShowcase from './glm-dropdown-menu.showcase.vue';
import GlmDropdownMenuGroup from './glm-dropdown-menu-group.vue';
import GlmDropdownMenuItem from './glm-dropdown-menu-item.vue';
import GlmDropdownMenuShowcase from './glm-dropdown-menu.showcase.vue';
import { DropdownMenuVariants } from './glm-dropdown-menu.utils';
import GlmDropdownMenu from './glm-dropdown-menu.vue';
import type { ExtractProps } from '@/components/component.utils';
import { logEvent } from 'histoire/client';
import { reactive } from 'vue';

type Props = ExtractProps<typeof GlmDropdownMenu>;
const state = reactive<Props>({
  variant: 'primary',
});
</script>
<template>
  <Story auto-props-disabled title="GlmDropdownMenu">
    <Variant title="Default">
      <template #controls>
        <HstButtonGroup v-model="state.variant" :options="DropdownMenuVariants" title="Variant" />
      </template>
      <GlmDropdownMenu>
        <template #trigger>User</template>
        <template #items>
          <GlmDropdownMenuItem @click="logEvent('click', $event)">Edit profile</GlmDropdownMenuItem>
          <GlmDropdownMenuItem @click="logEvent('click', $event)">Sign out</GlmDropdownMenuItem>
          <GlmDropdownMenuGroup name="Danger Zone">
            <GlmDropdownMenuItem @click="logEvent('click', $event)"
              >Remove account</GlmDropdownMenuItem
            >
          </GlmDropdownMenuGroup>
        </template>
      </GlmDropdownMenu>
    </Variant>
    <Variant title="All">
      <GlmDropdownMenuShowcase />
    </Variant>
  </Story>
</template>

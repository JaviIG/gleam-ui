<script lang="ts" setup>
import GlmDropdownMenu from './glm-dropdown-menu.vue';
import type { ExtractProps } from '@/components/component.utils';
import GlmDropdownMenuGroup from '@/components/glm-dropdown-menu/glm-dropdown-menu-group.vue';
import GlmDropdownMenuItem from '@/components/glm-dropdown-menu/glm-dropdown-menu-item.vue';
import { DropdownMenuVariants } from '@/components/glm-dropdown-menu/glm-dropdown-menu.utils';
import GlmLike from '@/components/icons/glm-like.vue';
import { reactive } from 'vue';

const options = ['Small', 'Medium', 'Large'];
const testCases = DropdownMenuVariants.flatMap((variant) =>
  [true, false].flatMap((iconOnly) => ({
    props: reactive<ExtractProps<typeof GlmDropdownMenu>>({
      variant,
      iconOnly,
    }),
  }))
);

function getTitle(props: ExtractProps<typeof GlmDropdownMenu>) {
  return Object.entries(props)
    .map((entry) => entry.join('='))
    .join(' - ');
}
</script>

<template>
  <div class="glm-showcase">
    <GlmDropdownMenu
      v-for="({ props }, index) in testCases"
      :key="index"
      v-bind="props"
      :title="getTitle(props)"
      data-testid="glm-dropdown-menu"
    >
      <template #trigger>
        <template v-if="props.iconOnly">
          <GlmLike />
        </template>
        <template v-else> User </template>
      </template>

      <template #items>
        <GlmDropdownMenuGroup name="Edit">
          <GlmDropdownMenuItem>View Profile</GlmDropdownMenuItem>
          <GlmDropdownMenuItem>Edit profile</GlmDropdownMenuItem>
        </GlmDropdownMenuGroup>
        <GlmDropdownMenuGroup name="Danger zone">
          <GlmDropdownMenuItem>Disable account</GlmDropdownMenuItem>
          <GlmDropdownMenuItem>Delete account</GlmDropdownMenuItem>
        </GlmDropdownMenuGroup>
        <GlmDropdownMenuGroup name="Sign out">
          <GlmDropdownMenuItem>Sign out</GlmDropdownMenuItem>
        </GlmDropdownMenuGroup>
      </template>
    </GlmDropdownMenu>
  </div>
</template>

<style lang="scss" scoped>
.glm-showcase {
  display: flex;
  flex-flow: column nowrap;
  gap: 2rem;
}
</style>

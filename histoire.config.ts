import { HstVue } from '@histoire/plugin-vue';
import { defineConfig } from 'histoire';

export default defineConfig({
  plugins: [HstVue()],
  setupFile: './histoire.setup.ts',
  collectMaxThreads: 6,
  storyMatch: ['./src/components/**/*.story.vue'],
});

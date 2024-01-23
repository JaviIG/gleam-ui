import GlmVariantWrapper from './src/_histoire/glm-variant-wrapper.vue';
import './src/assets/reset.scss';
import './src/assets/theme.scss';
import '@fontsource/source-sans-pro/300.css';
import '@fontsource/source-sans-pro/400.css';
import '@fontsource/source-sans-pro/600.css';
import { defineSetupVue3 } from '@histoire/plugin-vue';

export const setupVue3 = defineSetupVue3(({ addWrapper }) => {
  addWrapper(GlmVariantWrapper);
});

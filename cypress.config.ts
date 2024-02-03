import { defineConfig } from 'cypress';
import { configureVisualRegression } from 'cypress-visual-regression/dist/plugin';

export default defineConfig({
  component: {
    specPattern: 'src/{components,composables}/**/*.cy.{ts,tsx}',
    env: {
      visualRegression: {
        type: 'regression', // 'regression' | 'base'
      },
    },
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
    setupNodeEvents(on) {
      configureVisualRegression(on);
    },
  },
});

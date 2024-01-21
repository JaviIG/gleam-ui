import { GlmInternalLink } from '@/components/component.utils';
import type { Component, Plugin } from 'vue';

export const GleamPlugin: Plugin<GleamPluginOptions> = {
  install: (app, options) => {
    app.component(GlmInternalLink, options.linkComponent);
  },
};

export type GleamPluginOptions = {
  linkComponent: Component;
};

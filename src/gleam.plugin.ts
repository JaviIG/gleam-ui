import { GlmInternalLink } from './components/component.utils';
import type { Component, Plugin } from 'vue';

export const GleamPlugin: Plugin<GleamPluginOptions> = {
  install: (app, options) => {
    if (options.linkComponent) app.component(GlmInternalLink, options.linkComponent);
  },
};

export type GleamPluginOptions = {
  linkComponent?: Component;
};

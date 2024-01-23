import GlmButton from './glm-button.vue';
import type { ExtractProps, ExtractSlots } from '@/components/component.utils';
import GlmButtonShowcase from '@/components/glm-button/glm-button.showcase.vue';
import GlmLike from '@/components/icons/glm-like.vue';
import { GleamPlugin, type GleamPluginOptions } from '@/gleam.plugin';
import { RouterLink, createRouter, createMemoryHistory } from 'vue-router';

export type RenderOptions = {
  props: ExtractProps<typeof GlmButton>;
  slots: ExtractSlots<typeof GlmButton>;
};
export function renderButton({ props = {}, slots }: RenderOptions) {
  const options: GleamPluginOptions = { linkComponent: RouterLink };
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/internal-link-route',
        component: {},
      },
    ],
  });
  cy.mount(() => <GlmButton {...props}>{slots}</GlmButton>, {
    global: {
      plugins: [router, [GleamPlugin, options]],
    },
  });
  return {
    get root() {
      return cy.get('.glm-button');
    },
    get spinner() {
      return cy.get('.glm-button__spinner');
    },
  };
}

describe('GlmButton', () => {
  it('renders text', () => {
    const button = renderButton({
      props: {},
      slots: { default: () => 'Click Me' },
    });
    button.root.should('have.text', 'Click Me');
  });

  it('renders an external link link when a `to` is passed', () => {
    const button = renderButton({
      props: {
        to: 'https://google.es',
      },
      slots: { default: () => 'Link' },
    });
    button.root
      .should('have.attr', 'href', 'https://google.es')
      .invoke('prop', 'tagName')
      .should('be.equal', 'A');
  });

  it('renders an internal link when a `to` is passed', () => {
    const button = renderButton({
      props: {
        to: {
          path: '/internal-link-route',
        },
      },
      slots: { default: () => 'Internal link' },
    });
    button.root
      .should('have.attr', 'href', '/internal-link-route')
      .invoke('prop', 'tagName')
      .should('be.equal', 'A');
  });

  it('adds an spinner when loading', () => {
    const button = renderButton({
      props: {
        loading: true,
      },
      slots: { default: () => 'Click Me' },
    });
    button.spinner.should('be.visible');
    button.root.should('have.text', 'Click Me');
  });

  it('hides icon when iconOnly and loading', () => {
    const button = renderButton({
      props: {
        loading: true,
        iconOnly: true,
      },
      slots: { default: () => <GlmLike data-testId="custom-icon" /> },
    });
    button.spinner.should('be.visible');
    cy.getByTestId('custom-icon').should('not.exist');
  });

  it.skip('screenshots', () => {
    cy.mount(() => <GlmButtonShowcase />);
    cy.getByTestId('glm-button')
      .should('have.length.greaterThan', 0)
      .each((button) => {
        cy.wrap(button).compareSnapshot(button.attr('title')!);
      });
  });
});

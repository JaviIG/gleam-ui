import GlmSwitchShowcase from './glm-switch.showcase.vue';
import GlmSwitch from './glm-switch.vue';
import type { ExtractProps } from '../component.utils';
import { GleamPlugin, type GleamPluginOptions } from '../../gleam.plugin';
import { ref } from 'vue';

export type RenderOptions = {
  props: ExtractProps<typeof GlmSwitch>;
};

export function renderSwitchObject({ props: { modelValue = false, ...props } }: RenderOptions) {
  const options: GleamPluginOptions = {};
  const modelValueRef = ref(modelValue);
  cy.mount(
    () => (
      <GlmSwitch
        modelValue={modelValueRef.value}
        onUpdate:modelValue={(value) => {
          modelValueRef.value = value;
        }}
        {...props}
      />
    ),
    {
      global: {
        plugins: [[GleamPlugin, options]],
      },
    }
  );
  return {
    get modelValue() {
      return cy.wrap(modelValueRef).its('value');
    },
    get root() {
      return cy.get('.glm-switch');
    },
    shouldBeSelected() {
      this.root.should('have.attr', 'aria-checked', 'true');
      this.modelValue.should('be.equal', true);
    },
    shouldBeUnselected() {
      this.root.should('have.attr', 'aria-checked', 'false');
      this.modelValue.should('be.equal', false);
    },
  };
}

describe('GlmSwitch', () => {
  describe('mouse navigation', () => {
    it('updates value on click', () => {
      const switchObject = renderSwitchObject({
        props: {
          modelValue: false,
        },
      });

      switchObject.shouldBeUnselected();
      switchObject.root.realClick();
      switchObject.shouldBeSelected();
      switchObject.root.realClick();
      switchObject.shouldBeUnselected();
    });
  });

  describe('keyboard navigation', () => {
    it('updates value with Space', () => {
      const switchObject = renderSwitchObject({
        props: {
          modelValue: false,
        },
      });

      switchObject.shouldBeUnselected();
      switchObject.root.focus().realPress('Space');
      switchObject.shouldBeSelected();
      switchObject.root.realPress('Space');
      switchObject.shouldBeUnselected();
    });

    it('updates value with Enter', () => {
      const switchObject = renderSwitchObject({
        props: {
          modelValue: false,
        },
      });

      switchObject.shouldBeUnselected();
      switchObject.root.focus().realPress('{enter}');
      switchObject.shouldBeSelected();
      switchObject.root.focus().realPress('{enter}');
      switchObject.shouldBeUnselected();
    });
  });

  it.skip('screenshots', () => {
    cy.mount(() => <GlmSwitchShowcase />);
    cy.getByTestId('glm-switchObject')
      .should('have.length.greaterThan', 0)
      .each((switchObject) => {
        cy.wrap(switchObject).compareSnapshot(switchObject.attr('title')!);
      });
  });
});

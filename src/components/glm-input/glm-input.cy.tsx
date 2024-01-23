import GlmInput from './glm-input.vue';
import type { ExtractProps, ExtractSlots } from '@/components/component.utils';
import GlmInputShowcase from '@/components/glm-input/glm-input.showcase.vue';
import { GleamPlugin, type GleamPluginOptions } from '@/gleam.plugin';
import { type MaybeRef, ref, unref } from 'vue';

export type RenderOptions = {
  props: Omit<ExtractProps<typeof GlmInput>, 'modelValue'> & { modelValue?: MaybeRef<string> };
  slots: ExtractSlots<typeof GlmInput>;
};

export function renderInput({ props: { modelValue, ...props } = {}, slots }: RenderOptions) {
  const options: GleamPluginOptions = {};
  cy.mount(
    () => (
      <GlmInput modelValue={unref(modelValue)} {...props}>
        {slots}
      </GlmInput>
    ),
    {
      global: {
        plugins: [[GleamPlugin, options]],
      },
    }
  );
  return {
    get root() {
      return cy.get('.glm-input');
    },
    get input() {
      return cy.findByRole('textbox');
    },
    get placeholder() {
      return this.input.then(($input) => cy.get(`#${$input.attr('aria-describedby')}`));
    },
    get clearInput() {
      return cy.findByLabelText('Clear');
    },
  };
}

describe('GlmInput', () => {
  it('updates value', () => {
    const modelValue = ref('First');
    const input = renderInput({
      props: {
        modelValue,
        // @ts-expect-error `defineModel` inference is failing
        'onUpdate:modelValue': (value: string) => (modelValue.value = value),
      },
      slots: { placeholder: () => 'Type something' },
    });
    input.input.should('have.value', 'First');
    input.input.type(' Second');
    input.input.should('have.value', 'First Second');
    cy.wrap(modelValue).should('have.property', 'value', 'First Second');
  });

  it('renders placeholder', () => {
    const input = renderInput({
      props: {},
      slots: { placeholder: () => 'Type something' },
    });
    input.placeholder.should('be.visible').should('have.text', 'Type something');

    input.input.type('Something');
    input.placeholder.should('not.be.visible').should('have.text', 'Type something');
  });

  it('clears and focus the input when clicking the clear button', () => {
    const modelValue = ref('');
    const input = renderInput({
      props: {
        modelValue,
        // @ts-expect-error `defineModel` inference is failing
        'onUpdate:modelValue': (value: string) => (modelValue.value = value),
      },
      slots: { placeholder: () => 'Type something' },
    });

    input.input.click().type('Something').blur();
    input.input.should(($input) => {
      expect($input[0].ownerDocument.activeElement).to.be.equal($input[0].ownerDocument.body);
    });
    cy.wrap(modelValue).should('have.property', 'value', 'Something');

    input.clearInput.click();
    input.input.should('have.value', '').should(($input) => {
      expect($input[0].ownerDocument.activeElement).to.be.equal($input[0]);
    });
    cy.wrap(modelValue).should('have.property', 'value', '');
  });

  it.skip('screenshots', () => {
    cy.mount(() => <GlmInputShowcase />);
    cy.getByTestId('glm-input')
      .should('have.length.greaterThan', 0)
      .each((input) => {
        cy.wrap(input).compareSnapshot(input.attr('title')!);
      });
  });
});

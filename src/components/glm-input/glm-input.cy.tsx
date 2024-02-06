import { GleamPlugin, type GleamPluginOptions } from '../../gleam.plugin';
import type { ExtractProps, ExtractSlots } from '../component.utils';
import GlmInputShowcase from './glm-input.showcase.vue';
import GlmInput from './glm-input.vue';
import { ref } from 'vue';

export type RenderOptions = {
  props: ExtractProps<typeof GlmInput>;
  slots: ExtractSlots<typeof GlmInput>;
};

export function renderInput({ props: { modelValue, ...props } = {}, slots }: RenderOptions) {
  const options: GleamPluginOptions = {};
  const modelValueRef = ref(modelValue);
  cy.mount(
    () => (
      <GlmInput
        modelValue={modelValueRef.value}
        {...props}
        // @ts-expect-error `defineModel` inference is failing
        onUpdate:modelValue={(value: string) => (modelValueRef.value = value)}
      >
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
    get value() {
      return cy.wrap(modelValueRef).its('value');
    },
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
    const input = renderInput({
      props: {
        modelValue: 'First',
      },
      slots: { placeholder: () => 'Type something' },
    });
    input.input.should('have.value', 'First');
    input.input.type(' Second');
    input.input.should('have.value', 'First Second');
    input.value.should('equal','First Second');
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
    const input = renderInput({
      props: {
        modelValue: '',
      },
      slots: { placeholder: () => 'Type something' },
    });

    input.input.realClick().type('Something').blur();
    input.input.should('not.have.focus');
    input.value.should('equal', 'Something');

    input.clearInput.realClick();
    input.input.should('have.value', '').should('have.focus');
    input.value.should('equal', '');
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

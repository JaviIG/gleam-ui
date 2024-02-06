import { GleamPlugin, type GleamPluginOptions } from '../../gleam.plugin';
import type { ExtractProps, ExtractSlots } from '../component.utils';
import GlmAmountShowcase from './glm-amount.showcase.vue';
import GlmAmount from './glm-amount.vue';
import { ref } from 'vue';

export type RenderOptions = {
  props: ExtractProps<typeof GlmAmount>;
  slots?: ExtractSlots<typeof GlmAmount>;
};

export function renderAmount({ props: { modelValue, ...props } = {}, slots = {} }: RenderOptions) {
  const options: GleamPluginOptions = {};
  const modelValueRef = ref(modelValue);
  cy.mount(
    () => (
      <GlmAmount
        modelValue={modelValueRef.value}
        // @ts-expect-error `defineModel` inference is failing
        onUpdate:modelValue={(value: number) => {
          modelValueRef.value = value;
        }}
        {...props}
      >
        {slots}
      </GlmAmount>
    ),
    {
      global: {
        plugins: [[GleamPlugin, options]],
      },
    }
  );
  return {
    get value() {
      return cy.wrap(modelValueRef).then(model => model.value);
    },
    get root() {
      return cy.get('.glm-amount');
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
    get incrementButton() {
      return cy.findByLabelText('Increment');
    },
    get decrementButton() {
      return cy.findByLabelText('Decrement');
    },
    shouldHaveValue(value: number | null | undefined) {
      this.value.should('equal', value);
      this.input.should('have.value', value == null ? '' : value.toFixed());
    },
  };
}

describe('GlmAmount', () => {
  it('updates value', () => {
    const amount = renderAmount({
      props: {
        modelValue: 1,
      },
      slots: { placeholder: () => 'Type something' },
    });
    amount.input.should('have.value', 1);
    amount.input.focus().realType('23');
    amount.shouldHaveValue(123);
  });

  it('renders placeholder', () => {
    const amount = renderAmount({
      props: {},
      slots: { placeholder: () => 'Quantity' },
    });
    amount.placeholder.should('be.visible').should('have.text', 'Quantity');

    amount.input.type('123');
    amount.placeholder.should('not.be.visible').should('have.text', 'Quantity');
  });

  it('clears and focus the input when clicking the clear button', () => {
    const amount = renderAmount({
      props: {
        modelValue: null,
      },
      slots: { placeholder: () => 'Type something' },
    });

    amount.input.realClick().realType('123');
    amount.input.blur();
    amount.shouldHaveValue(123)

    amount.clearInput.realClick();
    amount.input.should('have.value', '').should('have.focus');
    amount.value.should('equal', null);
  });

  describe('keyboard', () => {
    it('increments up to the maximum value', () => {
      const amount = renderAmount({
        props: {
          modelValue: null,
          min: 10,
          max: 20,
        },
      });

      amount.shouldHaveValue(null);

      amount.input.realClick().realPress('ArrowUp');
      amount.shouldHaveValue(10);

      amount.input.realClick().realPress('ArrowUp');
      amount.shouldHaveValue(11);

      amount.input.realClick().realPress(['Shift', 'ArrowUp']);
      amount.shouldHaveValue(16);

      amount.input.realClick().realPress(['Shift', 'ArrowUp']);
      amount.shouldHaveValue(20);
      amount.incrementButton.should('be.disabled');
    });
    it('decrements up to the minimum value', () => {
      const amount = renderAmount({
        props: {
          modelValue: 30,
          min: 10,
          max: 20,
        },
      });

      amount.shouldHaveValue(30);

      amount.input.realClick().realPress('ArrowDown');
      amount.shouldHaveValue(20);

      amount.input.realClick().realPress('ArrowDown');
      amount.shouldHaveValue(19);

      amount.input.realClick().realPress(['Shift', 'ArrowDown']);
      amount.shouldHaveValue(14);

      amount.input.realClick().realPress(['Shift', 'ArrowDown']);
      amount.shouldHaveValue(10);
      amount.decrementButton.should('be.disabled');
    });
  });

  describe('spinner', () => {
    it('increments up to the maximum value', () => {
      const amount = renderAmount({
        props: {
          modelValue: null,
          min: 10,
          max: 20,
        },
      });

      amount.shouldHaveValue(null);

      amount.incrementButton.realClick();
      amount.shouldHaveValue(10);

      amount.incrementButton.realClick();
      amount.shouldHaveValue(11);

      amount.incrementButton.realClick({ shiftKey: true });
      amount.shouldHaveValue(16);

      amount.incrementButton.realClick({ shiftKey: true });
      amount.shouldHaveValue(20);
      amount.incrementButton.should('be.disabled');
    });
    it('decrements up to the minimum value', () => {
      const amount = renderAmount({
        props: {
          modelValue: 30,
          min: 10,
          max: 20,
        },
      });

      amount.shouldHaveValue(30);

      amount.decrementButton.realClick();
      amount.shouldHaveValue(20);

      amount.decrementButton.realClick();
      amount.shouldHaveValue(19);

      amount.decrementButton.realClick({ shiftKey: true });
      amount.shouldHaveValue(14);

      amount.decrementButton.realClick({ shiftKey: true });
      amount.shouldHaveValue(10);
      amount.decrementButton.should('be.disabled');
    });
  });

  it.skip('screenshots', () => {
    cy.mount(() => <GlmAmountShowcase />);
    cy.getByTestId('glm-amount')
      .should('have.length.greaterThan', 0)
      .each((input) => {
        cy.wrap(input).compareSnapshot(input.attr('title')!);
      });
  });
});

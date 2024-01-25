import GlmSelect from './glm-select.vue';
import { CountriesList } from '@/_histoire/mocks/countries';
import type { ExtractProps, ExtractSlots } from '@/components/component.utils';
import GlmSelectShowcase from '@/components/glm-select/glm-select.showcase.vue';
import { GleamPlugin, type GleamPluginOptions } from '@/gleam.plugin';
import { ref } from 'vue';

export type RenderOptions = {
  props: ExtractProps<typeof GlmSelect>;
  slots?: ExtractSlots<typeof GlmSelect>;
};

export function renderSelect({ props: { modelValue = '', ...props }, slots }: RenderOptions) {
  const options: GleamPluginOptions = {};
  const modelValueRef = ref(modelValue);
  cy.mount(
    () => (
      <GlmSelect
        modelValue={modelValueRef.value}
        onUpdate:modelValue={(value) => {
          modelValueRef.value = value;
        }}
        {...props}
      >
        {slots}
      </GlmSelect>
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
      return cy.get('.glm-select');
    },
    get trigger() {
      return cy.findByRole('combobox');
    },
    get input() {
      return cy.findByRole('combobox');
    },
    get listbox() {
      return cy.findByRole('listbox');
    },
    get options() {
      return cy.findAllByRole('option');
    },
    get placeholder() {
      return this.input.then(($select) => cy.get(`#${$select.attr('aria-describedby')}`));
    },
    get clearInput() {
      return cy.findByLabelText('Clear');
    },
    nthOptionShouldBeHighlighted(index: number) {
      this.options
        .eq(index)
        .should('have.class', 'glm-listbox__item--active')
        .then(($option) => {
          this.input.should(($input) => {
            expect($option.attr('id')).to.equal($input.attr('aria-activedescendant'));
          });
        });
    },
    shouldHaveValue(value: string) {
      this.modelValue.should('be.equal', value);
      this.trigger.should('have.text', value);
    },
  };
}

describe('GlmSelect', () => {
  describe('mouse navigation', () => {
    it('updates value on click', () => {
      const select = renderSelect({
        props: {
          items: CountriesList,
        },
      });

      select.trigger.click();
      select.listbox.findByText('Spain').click();
      select.shouldHaveValue('Spain');
    });

    it('closes when losing focus', () => {
      const select = renderSelect({
        props: {
          items: CountriesList,
        },
      });

      select.trigger.click();
      select.listbox.should('be.visible');
      cy.document()
        .then((doc) => doc.body)
        .click('bottom');
      select.listbox.should('not.exist');
    });
  });

  describe('keyboard navigation', () => {
    it('navigates with arrows and selects a value with enter', () => {
      const select = renderSelect({
        props: {
          items: CountriesList,
        },
      });
      select.trigger.click();

      select.input.type('{downArrow}');
      select.nthOptionShouldBeHighlighted(0);
      select.input.type('{downArrow}');
      select.nthOptionShouldBeHighlighted(1);
      // Loops to last
      select.input.type('{upArrow}'.repeat(2));
      select.nthOptionShouldBeHighlighted(CountriesList.length - 1);
      select.input.type('{upArrow}');
      select.nthOptionShouldBeHighlighted(CountriesList.length - 2);
      // Loops to first
      select.input.type('{downArrow}'.repeat(4));
      select.nthOptionShouldBeHighlighted(2);
      select.input.type('{enter}');
      select.shouldHaveValue(CountriesList[2]);
    });

    it('navigates with arrows and reset to previous value pressing esc', () => {
      const select = renderSelect({
        props: {
          items: CountriesList,
        },
      });

      select.trigger.click();
      select.input.type('{downArrow}'.repeat(3)).type('{enter}');
      select.shouldHaveValue(CountriesList[2]);

      select.trigger.click();
      select.input.type('{downArrow}'.repeat(6)).type(`{esc}`);
      select.shouldHaveValue(CountriesList[2]);
    });

    it('focuses first element with home and last with end', () => {
      const select = renderSelect({
        props: {
          items: CountriesList,
        },
      });

      select.trigger.click();
      select.input.type('{downArrow}'.repeat(3));
      select.nthOptionShouldBeHighlighted(2);
      select.input.type('{end}');
    });
  });

  describe('search', () => {
    it('filters list items when typing', () => {
      const select = renderSelect({
        props: {
          items: CountriesList,
        },
        slots: { placeholder: () => 'Type something' },
      });

      select.trigger.click();
      select.input.type('níT'); // intentional casing and accent
      select.options.should('have.length', 3);
      select.input.type('{downArrow}');
      select.nthOptionShouldBeHighlighted(0);
      select.input.type('{downArrow}');
      select.nthOptionShouldBeHighlighted(1);
      select.input.type('{downArrow}');
      select.nthOptionShouldBeHighlighted(2);
      select.input.type('{downArrow}');
      select.nthOptionShouldBeHighlighted(0);
      select.input.type('{upArrow}');
      select.nthOptionShouldBeHighlighted(2);
      // Select United States
      select.input.type('{enter}');
      select.listbox.should('not.exist');
      select.shouldHaveValue('United States');
      // Open again and assert united states is highlighted
      select.trigger.click();
      select.input.should('have.value', '');
      select.input.should('have.value', '');
      select.nthOptionShouldBeHighlighted(CountriesList.indexOf('United States'));
    });
  });
  describe('slots', () => {
    it('customises placeholder', () => {
      const select = renderSelect({
        props: {
          items: CountriesList,
        },
        slots: { placeholder: () => 'Type something' },
      });
      select.placeholder.should('have.text', 'Type something');
    });
    it('customises item', () => {
      const select = renderSelect({
        props: {
          items: CountriesList,
        },
        slots: { item: ({ item }) => ['Option: ', item] },
      });

      select.trigger.click();
      select.options.each(($option, index) => {
        cy.wrap($option).should('have.text', `Option: ${CountriesList[index]}`);
      });
    });
    it('customises empty search', () => {
      const select = renderSelect({
        props: {
          items: CountriesList,
        },
        slots: { 'no-items': () => 'There are no items' },
      });

      select.trigger.click();
      select.input.type('There is no country that matches this string');
      select.listbox.should('have.text', 'There are no items');
    });
  });

  it.skip('screenshots', () => {
    cy.mount(() => <GlmSelectShowcase />);
    cy.getByTestId('glm-select')
      .should('have.length.greaterThan', 0)
      .each((select) => {
        cy.wrap(select).compareSnapshot(select.attr('title')!);
      });
  });
});

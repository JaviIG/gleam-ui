import GlmSegmentShowcase from './glm-segment.showcase.vue';
import GlmSegment from './glm-segment.vue';
import type { ExtractProps, ExtractSlots } from '@/components/component.utils';
import { GleamPlugin, type GleamPluginOptions } from '@/gleam.plugin';
import { type Ref, ref } from 'vue';

export type RenderOptions<SomeKind> = {
  props: ExtractProps<typeof GlmSegment<SomeKind>>;
  slots?: ExtractSlots<typeof GlmSegment<SomeKind>>;
};
const DefaultOptions = ['Small', 'Medium', 'Large'];

export function renderSegment<SomeKind>({
  props: { modelValue, ...props },
  slots = {},
}: RenderOptions<SomeKind>) {
  const options: GleamPluginOptions = {};
  const modelValueRef = ref(modelValue) as Ref<SomeKind>;
  cy.mount(
    () => (
      <GlmSegment
        modelValue={modelValueRef.value}
        {...props}
        onUpdate:modelValue={(value) => (modelValueRef.value = value)}
      >
        {slots}
      </GlmSegment>
    ),
    {
      global: {
        plugins: [[GleamPlugin, options]],
      },
    }
  );
  return {
    get root() {
      return cy.get('.glm-segment');
    },
    get items() {
      return cy.findAllByRole('button');
    },
    get modelValue() {
      return cy.wrap(modelValueRef).its('value');
    },
    getButtonWithText(value: SomeKind) {
      return this.items.eq(props.options.indexOf(value));
    },
    shouldHaveValue(value: SomeKind) {
      this.modelValue.should('be.equal', value);
      this.items.eq(props.options.indexOf(value)).should('have.attr', 'aria-pressed', 'true');
    },
    shouldBeUnselected(value: SomeKind) {
      this.items.eq(props.options.indexOf(value)).should('have.attr', 'aria-pressed', 'false');
    },
  };
}

describe('GlmSegment', () => {
  it('renders all items', () => {
    const segment = renderSegment({
      props: {
        modelValue: DefaultOptions[0],
        options: DefaultOptions,
      },
    });

    segment.items.should('have.length', DefaultOptions.length);
    segment.items.each(($item, index) => {
      expect($item).to.have.text(DefaultOptions[index]);
    });
  });

  describe('mouse', () => {
    it('updates value when clicking', () => {
      const segment = renderSegment({
        props: {
          modelValue: DefaultOptions[0],
          options: DefaultOptions,
        },
      });
      segment.shouldHaveValue(DefaultOptions[0]);
      segment.shouldBeUnselected(DefaultOptions[1]);
      segment.shouldBeUnselected(DefaultOptions[2]);

      segment.getButtonWithText(DefaultOptions[1]).realClick();
      segment.shouldHaveValue(DefaultOptions[1]);
      segment.shouldBeUnselected(DefaultOptions[0]);
      segment.shouldBeUnselected(DefaultOptions[2]);
    });
  });

  describe('keyboard', () => {
    it('updates value when using enter key', () => {
      const segment = renderSegment({
        props: {
          modelValue: DefaultOptions[0],
          options: DefaultOptions,
        },
      });
      segment.shouldHaveValue(DefaultOptions[0]);
      segment.shouldBeUnselected(DefaultOptions[1]);
      segment.shouldBeUnselected(DefaultOptions[2]);

      segment.getButtonWithText(DefaultOptions[1]).focus().realPress('Enter');
      segment.shouldHaveValue(DefaultOptions[1]);
      segment.shouldBeUnselected(DefaultOptions[0]);
      segment.shouldBeUnselected(DefaultOptions[2]);
    });

    it('updates value when using Space key', () => {
      const segment = renderSegment({
        props: {
          modelValue: DefaultOptions[0],
          options: DefaultOptions,
        },
      });
      segment.shouldHaveValue(DefaultOptions[0]);
      segment.shouldBeUnselected(DefaultOptions[1]);
      segment.shouldBeUnselected(DefaultOptions[2]);

      segment.getButtonWithText(DefaultOptions[1]).focus().realPress('Space');
      segment.shouldHaveValue(DefaultOptions[1]);
      segment.shouldBeUnselected(DefaultOptions[0]);
      segment.shouldBeUnselected(DefaultOptions[2]);
    });
  });

  describe('slots', () => {
    it('customises `item` slot', () => {
      const segment = renderSegment({
        props: {
          modelValue: DefaultOptions[0],
          options: DefaultOptions,
        },
        slots: {
          item(scope) {
            return ['▶', scope.item];
          },
        },
      });
      segment.shouldHaveValue(DefaultOptions[0]);
      segment.items.each(($item, index) => {
        expect($item).to.have.text(`▶${DefaultOptions[index]}`);
      });
    });
  });

  it.skip('screenshots', () => {
    cy.mount(() => <GlmSegmentShowcase />);
    cy.getByTestId('glm-segment')
      .should('have.length.greaterThan', 0)
      .each((segment) => {
        cy.wrap(segment).compareSnapshot(segment.attr('title')!);
      });
  });
});

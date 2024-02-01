import GlmDropdownMenuShowcase from './glm-dropdown-menu.showcase.vue';
import GlmDropdownMenu from './glm-dropdown-menu.vue';
import type { ExtractProps, ExtractSlots } from '@/components/component.utils';
import GlmDropdownMenuGroup from '@/components/glm-dropdown-menu/glm-dropdown-menu-group.vue';
import GlmDropdownMenuItem from '@/components/glm-dropdown-menu/glm-dropdown-menu-item.vue';
import { GleamPlugin, type GleamPluginOptions } from '@/gleam.plugin';

export type RenderOptions = {
  props?: ExtractProps<typeof GlmDropdownMenu>;
  slots: ExtractSlots<typeof GlmDropdownMenu>;
};

export function renderDropdownMenu({ props, slots }: RenderOptions) {
  const options: GleamPluginOptions = {};
  cy.mount(() => <GlmDropdownMenu {...props}>{slots}</GlmDropdownMenu>, {
    global: {
      plugins: [[GleamPlugin, options]],
    },
  });
  return {
    get root() {
      return cy.get('.glm-dropdownMenu');
    },
    getTrigger(label: string) {
      return cy.findByRole('button', { name: label });
    },
    get itemsList() {
      return cy.findByRole('menu');
    },
    get items() {
      return cy.findAllByRole('menuitem');
    },
  };
}

describe('GlmDropdownMenu', () => {
  describe('individual items', () => {
    describe('keyboard', () => {
      it('closes when losing focus', () => {
        const dropdownMenu = renderDropdownMenu({
          slots: {
            trigger: () => 'Menu Trigger',
            items: () => [
              <GlmDropdownMenuItem>Option 1</GlmDropdownMenuItem>,
              <GlmDropdownMenuItem>Option 2</GlmDropdownMenuItem>,
              <GlmDropdownMenuItem>Option 3</GlmDropdownMenuItem>,
            ],
          },
        });
        dropdownMenu.getTrigger('Menu Trigger').focus().realPress('Enter');
        dropdownMenu.itemsList.should('be.visible');

        cy.realPress('Tab');
        dropdownMenu.itemsList.should('not.exist');
      });

      it('closes when pressing Esc', () => {
        const dropdownMenu = renderDropdownMenu({
          slots: {
            trigger: () => 'Menu Trigger',
            items: () => [
              <GlmDropdownMenuItem>Option 1</GlmDropdownMenuItem>,
              <GlmDropdownMenuItem>Option 2</GlmDropdownMenuItem>,
              <GlmDropdownMenuItem>Option 3</GlmDropdownMenuItem>,
            ],
          },
        });
        dropdownMenu.getTrigger('Menu Trigger').focus().realPress('Enter');
        dropdownMenu.itemsList.should('be.visible');

        cy.realPress('Escape');
        dropdownMenu.itemsList.should('not.exist');
        dropdownMenu.getTrigger('Menu Trigger').should('be.focused');
      });

      it('loops when using arrows', () => {
        const dropdownMenu = renderDropdownMenu({
          slots: {
            trigger: () => 'Menu Trigger',
            items: () => [
              <GlmDropdownMenuItem>Option 1</GlmDropdownMenuItem>,
              <GlmDropdownMenuItem>Option 2</GlmDropdownMenuItem>,
              <GlmDropdownMenuItem>Option 3</GlmDropdownMenuItem>,
            ],
          },
        });
        dropdownMenu.getTrigger('Menu Trigger').focus().realPress('Enter');
        dropdownMenu.items.eq(0).should('be.focused');

        cy.realPress('ArrowDown');
        dropdownMenu.items.eq(1).should('be.focused');

        cy.realPress('ArrowDown');
        dropdownMenu.items.eq(2).should('be.focused');

        // Loop
        cy.realPress('ArrowDown');
        dropdownMenu.items.eq(0).should('be.focused');

        // Loop back
        cy.realPress('ArrowUp');
        dropdownMenu.items.eq(2).should('be.focused');
      });

      it('focuses first/last items when Home/End are pressed', () => {
        const dropdownMenu = renderDropdownMenu({
          slots: {
            trigger: () => 'Menu Trigger',
            items: () => [
              <GlmDropdownMenuItem>Option 1</GlmDropdownMenuItem>,
              <GlmDropdownMenuItem>Option 2</GlmDropdownMenuItem>,
              <GlmDropdownMenuItem>Option 3</GlmDropdownMenuItem>,
            ],
          },
        });
        dropdownMenu.getTrigger('Menu Trigger').focus().realPress('Enter');
        dropdownMenu.items.eq(0).should('be.focused');

        cy.realPress('End');
        dropdownMenu.items.eq(2).should('be.focused');

        cy.realPress('Home');
        dropdownMenu.items.eq(0).should('be.focused');
      });

      it('selects an item using enter', () => {
        const spy = cy.spy().as('second-item-click-listener');
        const dropdownMenu = renderDropdownMenu({
          slots: {
            trigger: () => 'Menu Trigger',
            items: () => [
              <GlmDropdownMenuItem>Option 1</GlmDropdownMenuItem>,
              <GlmDropdownMenuItem onClick={spy}>Option 2</GlmDropdownMenuItem>,
              <GlmDropdownMenuItem>Option 3</GlmDropdownMenuItem>,
            ],
          },
        });
        dropdownMenu.getTrigger('Menu Trigger').focus().realPress('Enter');
        dropdownMenu.items.eq(0).should('be.focused');

        cy.realPress('ArrowDown');
        cy.get('@second-item-click-listener').should('not.have.been.called');
        dropdownMenu.items.eq(1).should('be.focused').realPress('Enter');
        cy.get('@second-item-click-listener').should('have.been.calledOnce');
        dropdownMenu.itemsList.should('not.exist');
        dropdownMenu.getTrigger('Menu Trigger').should('be.focused');
      });

      it('selects an item using space', () => {
        const spy = cy.spy().as('second-item-click-listener');
        const dropdownMenu = renderDropdownMenu({
          slots: {
            trigger: () => 'Menu Trigger',
            items: () => [
              <GlmDropdownMenuItem>Option 1</GlmDropdownMenuItem>,
              <GlmDropdownMenuItem onClick={spy}>Option 2</GlmDropdownMenuItem>,
              <GlmDropdownMenuItem>Option 3</GlmDropdownMenuItem>,
            ],
          },
        });
        dropdownMenu.getTrigger('Menu Trigger').focus().realPress('Space');
        dropdownMenu.items.eq(0).should('be.focused');

        cy.realPress('ArrowDown');
        cy.get('@second-item-click-listener').should('not.have.been.called');
        dropdownMenu.items.eq(1).should('be.focused').realPress('Space');
        cy.get('@second-item-click-listener').should('have.been.calledOnce');
        dropdownMenu.itemsList.should('not.exist');
        dropdownMenu.getTrigger('Menu Trigger').should('be.focused');
      });
    });

    describe('mouse', () => {
      it('closes when losing focus', () => {
        const dropdownMenu = renderDropdownMenu({
          slots: {
            trigger: () => 'Menu Trigger',
            items: () => [
              <GlmDropdownMenuItem>Option 1</GlmDropdownMenuItem>,
              <GlmDropdownMenuItem>Option 2</GlmDropdownMenuItem>,
              <GlmDropdownMenuItem>Option 3</GlmDropdownMenuItem>,
            ],
          },
        });
        dropdownMenu.getTrigger('Menu Trigger').realClick();
        dropdownMenu.itemsList.should('be.visible');

        cy.get('body').realClick({ position: 'bottom' });
        dropdownMenu.itemsList.should('not.exist');
      });
      it('focuses when hovering', () => {
        const dropdownMenu = renderDropdownMenu({
          slots: {
            trigger: () => 'Menu Trigger',
            items: () => [
              <GlmDropdownMenuItem>Option 1</GlmDropdownMenuItem>,
              <GlmDropdownMenuItem>Option 2</GlmDropdownMenuItem>,
              <GlmDropdownMenuItem>Option 3</GlmDropdownMenuItem>,
            ],
          },
        });
        dropdownMenu.getTrigger('Menu Trigger').realClick();
        dropdownMenu.itemsList.should('be.visible');
        dropdownMenu.items.eq(0).should('be.focused');

        dropdownMenu.items.eq(2).realHover();
        dropdownMenu.items.eq(2).should('be.focused');
      });
      it('selects an item clicking', () => {
        const spy = cy.spy().as('second-item-click-listener');
        const dropdownMenu = renderDropdownMenu({
          slots: {
            trigger: () => 'Menu Trigger',
            items: () => [
              <GlmDropdownMenuItem>Option 1</GlmDropdownMenuItem>,
              <GlmDropdownMenuItem onClick={spy}>Option 2</GlmDropdownMenuItem>,
              <GlmDropdownMenuItem>Option 3</GlmDropdownMenuItem>,
            ],
          },
        });
        dropdownMenu.getTrigger('Menu Trigger').realClick();
        cy.get('@second-item-click-listener').should('not.have.been.called');

        dropdownMenu.items.eq(1).realClick();
        dropdownMenu.itemsList.should('not.exist');
        cy.get('@second-item-click-listener').should('have.been.calledOnce');
        dropdownMenu.getTrigger('Menu Trigger').should('be.focused');
      });
      it('closes if trigger is clicked', () => {
        const dropdownMenu = renderDropdownMenu({
          slots: {
            trigger: () => 'Menu Trigger',
            items: () => [
              <GlmDropdownMenuItem>Option 1</GlmDropdownMenuItem>,
              <GlmDropdownMenuItem>Option 2</GlmDropdownMenuItem>,
              <GlmDropdownMenuItem>Option 3</GlmDropdownMenuItem>,
            ],
          },
        });

        dropdownMenu.getTrigger('Menu Trigger').realClick();
        dropdownMenu.itemsList.should('be.visible');

        dropdownMenu.getTrigger('Menu Trigger').realClick();
        dropdownMenu.itemsList.should('not.exist');
      });
    });
  });

  describe('groups', () => {
    describe('keyboard', () => {
      it('loops when using arrows', () => {
        const dropdownMenu = renderDropdownMenu({
          slots: {
            trigger: () => 'Menu Trigger',
            items: () => [
              <GlmDropdownMenuGroup name="First">
                <GlmDropdownMenuItem>Option 1</GlmDropdownMenuItem>
                <GlmDropdownMenuItem>Option 2</GlmDropdownMenuItem>
              </GlmDropdownMenuGroup>,
              <GlmDropdownMenuGroup name="Second">
                <GlmDropdownMenuItem>Option 3</GlmDropdownMenuItem>
                <GlmDropdownMenuItem>Option 4</GlmDropdownMenuItem>
              </GlmDropdownMenuGroup>,
            ],
          },
        });

        dropdownMenu.getTrigger('Menu Trigger').focus().realPress('Enter');
        dropdownMenu.items.eq(0).should('be.focused');

        cy.realPress('ArrowDown');
        dropdownMenu.items.eq(1).should('be.focused');

        cy.realPress('ArrowDown');
        dropdownMenu.items.eq(2).should('be.focused');

        cy.realPress('ArrowDown');
        dropdownMenu.items.eq(3).should('be.focused');

        // Loop
        cy.realPress('ArrowDown');
        dropdownMenu.items.eq(0).should('be.focused');
        // Loop back
        cy.realPress('ArrowUp');
        dropdownMenu.items.eq(3).should('be.focused');
      });
    });
  });

  it.skip('screenshots', () => {
    cy.mount(() => <GlmDropdownMenuShowcase />);
    cy.getByTestId('glm-dropdownMenu')
      .should('have.length.greaterThan', 0)
      .each((dropdownMenu) => {
        cy.wrap(dropdownMenu).compareSnapshot(dropdownMenu.attr('title')!);
      });
  });
});

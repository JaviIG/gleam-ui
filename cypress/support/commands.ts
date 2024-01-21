/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
/// <reference types="cypress-visual-regression" />
import '@testing-library/cypress/add-commands';
import { addCompareSnapshotCommand } from 'cypress-visual-regression/dist/command';
import { mount } from 'cypress/vue';

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      getByTestId(id: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add('mount', mount);
Cypress.Commands.add('getByTestId', (id: string) => cy.get(`[data-testid="${id}"]`));
addCompareSnapshotCommand();

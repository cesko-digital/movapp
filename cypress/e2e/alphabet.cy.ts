/// <reference types="Cypress" />

import { checkHeaderLink } from "../support/cypressHelpers";

describe('Test Movapp - Alphabet page', () => {
    beforeEach(() => {
      cy.visit('/alphabet');
    });
    
    it('Test ukrainian version of alphabet', () => {
        cy.contains('button', 'Ukrajinská abeceda').click()
        cy.contains('button', 'Ukrajinská abeceda').parent().next()
            .invoke('children')
            .should('have.length', 33)
    });

    
    it('Test czech version of alphabet', () => {
        cy.contains('button', 'Česká abeceda').click()
        cy.contains('button', 'Česká abeceda').parent().next()
            .invoke('children')
            .should('have.length', 42)
    })
});
    

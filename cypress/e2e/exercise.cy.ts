/// <reference types="Cypress" />

import { checkHeaderLink } from "../support/cypressHelpers";

      describe('Test Movapp - Exercise page', () => {
        beforeEach(() => {
            cy.visit('/exercise');
        });
    
        it('Test czech version of exercise', () => {
        cy.contains('button', 'Základy').click();
        cy.contains ('button', 'Začít').click();
        });

        it('Test some categories of exercise', () => {
            cy.contains ('button', 'Město').click();
            cy.contains ('button', 'Práce').click();
            cy.contains ('button', 'Začít').click();

        });
        
    });
  


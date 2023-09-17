/// <reference types="Cypress" />

import { checkHeaderLink } from "../support/cypressHelpers";

describe('Test Movapp - For Kids page', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.contains('header nav li button', 'Pro děti').as('menu').click()
        cy.get('@menu').find('~ div ul li a').contains('Slovíčka')
            .should('be.visible')
            .click()

    
    it('Page with cards is visible', () => {
        cy.get('#panenka').should('exist').and('be.visible')
            })

        cy.contains('header nav li button', 'Pro děti').as('menu').click()
        cy.get('@menu').find('~ div ul li a').contains('Pohádky')
        .should('be.visible')
        .click()

        
        cy.contains('header nav li button', 'Pro děti').as('menu').click()
        cy.get('@menu').find('~ div ul li a').contains('Pexeso')
            .should('be.visible')
            .click()

        cy.contains('header nav li button', 'Pro děti').as('menu').click()
        cy.get('@menu').find('~ div ul li a').contains('Obrázkový kvíz')
                .should('be.visible')
                .click()
    })

    it('Link in menu is correctly bordered', () => {
        cy.contains('header nav li button', 'Pro děti').parents('li')
        .should('have.class', 'border-b-2')
        
           
    })

})
    
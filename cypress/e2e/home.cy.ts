/// <reference types="Cypress" />

describe('Test Movapp - Home page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Test that page has correct h1', () => {
    cy.get('h1').should('contain.text', 'Naučte se základy češtiny a ukrajinštiny pro běžné životní situace');
    cy.get('h1').invoke('text').should('not.be.empty') 
  });

  it('Test that page has a correct title', () => {
    cy.title().should("be.eq", "Movapp.cz – aby se Češi a Ukrajinci snadno domluvili");
  });

   it('Test that Nav bar has a correct sections', () => {
    cy.contains('header a', 'Abeceda').invoke('attr', 'href').should('equal', '/alphabet')
    cy.contains('header a', 'Slovníček').invoke('attr', 'href').should('equal', '/dictionary')
    cy.contains('header button', 'Pro děti').invoke('text').should('equal', 'Pro děti');
    cy.contains('header a', 'Wiki').invoke('attr', 'href').should('equal', '/wiki');
    cy.contains('header a', 'O nás').invoke('attr', 'href').should('equal', '/about');
    cy.contains('header a', 'Kontakty').invoke('attr', 'href').should('equal', '/contacts');
  });

  it('Test visibility of the elements in Header', () => {
    cy.contains('header a', 'Abeceda').should('be.visible');
    cy.contains('header a', 'Slovníček').should('be.visible');
    cy.contains('header button', 'Pro děti').should('be.visible');
    cy.contains('header a', 'Wiki').should('be.visible');
    cy.contains('header a', 'O nás').should('be.visible');
    cy.contains('header a', 'Kontakty').should('be.visible');
  });

it('Test body part of the page', () => {
    cy.contains('h2', 'Pro děti').should('be.visible');
    cy.contains('h2', 'Wiki').should('be.visible');
    cy.contains('h2', 'Movapp je').should('be.visible');
    cy.contains('h2', 'Ukrajinská abeceda').should('be.visible');
  });

it('Test of footer of the page', () => {
    cy.contains('Movapp mluví dalšími jazyky').should('be.visible');
    cy.contains('Slovensky').should('be.visible');
    cy.contains('Polski').should('be.visible')
    
  });
})

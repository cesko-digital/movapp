/// <reference types="Cypress" />

describe('Test Movapp - Home page', () => {
  beforeEach(() => {
    cy.visit("https://www.movapp.cz/");
  });

  it('it renders', () => {
    cy.get('h1').should('contain.text', 'Naučte se základy češtiny a ukrajinštiny pro běžné životní situace');
    cy.title().should("be.eq", "Movapp.cz – aby se Češi a Ukrajinci snadno domluvili");

    // Hlavna karta s odkazmi
    cy.contains('Slovníček').should('be.visible');
    cy.contains('Pro děti').should('be.visible');
    cy.contains('Wiki').should('be.visible');
    cy.contains('Movapp je');
    cy.contains('Ukrajinská abeceda').should('be.visible');

    // Lokalizacie
    cy.contains('Movapp mluví dalšími jazyky').should('be.visible');
    cy.contains('Slovensky').should('be.visible');
    cy.contains('Polski').should('be.visible')
    

    // TODO: Otestovat vsetko co treba na hlavnej stranke
  });
});

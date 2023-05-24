/// <reference types="Cypress" />
import { checkLink, checkVisibility } from '../support/cypressHelpers';

describe('Test Movapp - Home page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Test that page has correct h1', () => {
    cy.get('h1').as('heading');
    cy.get('@heading').should('contain.text', 'Naučte se základy češtiny a ukrajinštiny pro běžné životní situace');
    cy.get('@heading').invoke('text').should('not.be.empty');
  });

  it('Test that page has a correct title', () => {
    cy.title().should('be.eq', 'Movapp.cz – aby se Češi a Ukrajinci snadno domluvili');
  });

  it('Test that Nav bar has a correct sections', () => {
    checkLink('Abeceda', '/alphabet');
    checkLink('Slovníček', '/dictionary');
    checkLink('Procvičování', '/exercise');
    checkLink('Wiki', '/wiki');
    checkLink('O nás', '/about');
    checkLink('Kontakty', '/contacts');

    cy.contains('header button', 'Pro děti').invoke('text').should('equal', 'Pro děti');
  });

  it('Test body part of the page', () => {
    checkVisibility('h2', 'Pro děti');
    checkVisibility('h2', 'Wiki');
    checkVisibility('h2', 'Movapp je');
    checkVisibility('h2', 'Ukrajinská abeceda');
  });

  it('Test of languages of the page', () => {
    cy.contains('Movapp mluví dalšími jazyky').should('be.visible');
    cy.contains('Slovensky').should('be.visible');
    cy.contains('Polski').should('be.visible');
  });

  it('Test of the footer of the page', function(){
    cy.contains('facebook').should('have.attr', 'href').and('include', 'facebook');
    cy.contains('instagram').should('have.attr', 'href').and('include', 'instagram');
    cy.contains('twitter').should('have.attr', 'href').and('include', 'twitter');
    cy.contains('linkedin').should('have.attr', 'href').and('include', 'linkedin');
    cy.contains('telegram').should('have.attr', 'href').and('include', 't.me/movappcz');
    
  
    cy.contains('Pomáhej Ukrajině').should('have.attr', 'href').and('include', 'pomahejukrajine');
    cy.contains('Stojíme za Ukrajinou').should('have.attr', 'href').and('include', 'stojimezaukrajinou');
    cy.contains('Česko.Digital').should('have.attr', 'href').and('include', 'cesko.digital');

    cy.contains('footer button', 'Našli jste chybu nebo máte návrh na zlepšení?').invoke('text').should('equal', 'Našli jste chybu nebo máte návrh na zlepšení?');

    cy.contains('GitHub').should('have.attr', 'href').and('include', 'github');
    cy.contains('CC BY-NC 4.0 Mezinárodní').should('have.attr', 'href').and('include', 'creativecommons');
   

    
 
    
  })

})

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

  it('Test of footer of the page', () => {
    cy.contains('Movapp mluví dalšími jazyky').should('be.visible');
    cy.contains('Slovensky').should('be.visible');
    cy.contains('Polski').should('be.visible');
  });
});

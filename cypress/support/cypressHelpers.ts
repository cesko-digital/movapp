/// <reference types="Cypress" />
export const checkHeaderLink = (text: string, href: string) => {
  cy.contains('header a', text)
    .should('be.visible')
    .and(($a) => {
      expect($a.attr('href')).to.eq(href);
    });
};

export const checkVisibility = (tag: string, text: string) => {
  cy.contains(tag, text).should('be.visible');
};

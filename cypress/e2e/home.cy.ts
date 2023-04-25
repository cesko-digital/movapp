describe('Movapp - Home page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('it renders', () => {
    cy.get('h1').should('contain.text', 'Naučte se základy češtiny a ukrajinštiny pro běžné životní situace');

    // Hlavna karta s odkazmi
    cy.contains('Slovníček').should('be.visible');
    cy.contains('Pro děti').should('be.visible');
    cy.contains('Wiki').should('be.visible');
    cy.contains('Ukrajinská abeceda').should('be.visible');

    // Lokalizacie
    cy.contains('Movapp mluví dalšími jazyky').should('be.visible');
    cy.contains('Slovensky').should('be.visible');

    // TODO: Otestovat vsetko co treba na hlavnej stranke
  });
});

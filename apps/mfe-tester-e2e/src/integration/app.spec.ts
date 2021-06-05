import { getParagraphText } from '../support/app.po';

describe('mfe-tester', () => {
  it('should display home title', () => {
    cy.visit('/home');
    getParagraphText().contains('home works!');
  });

  it('should display about title', () => {
    cy.visit('/about');
    getParagraphText().contains('about works!');
  });

  it('should display contact title', () => {
    cy.visit('/contact');
    getParagraphText().contains('contact works!');
  });
});

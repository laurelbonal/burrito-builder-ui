describe("Burrito Builder", () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3001/api/v1/orders', {
      statusCode: 200,
      fixture: 'data'
    }).as('getOrders');
    cy.intercept('POST', 'http://localhost:3001/api/v1/orders', (req) => {
      req.reply({
        statusCode: 201,
        body: {
          id: 4, 
          name: req.body.name,
          ingredients: req.body.ingredients,
        },
      });
    }).as('postOrder');
    cy.intercept('DELETE', 'http://localhost:3001/api/v1/orders/*', {
      statusCode: 200
    }).as('deleteOrder');
    cy.visit('http://localhost:3000');
  });
  it('should display all ingredient buttons', () => {
    cy.wait('@getOrders');
    const ingredients = [
      "beans",
      "steak",
      "carnitas",
      "sofritas",
      "lettuce",
      "queso fresco",
      "pico de gallo",
      "hot sauce",
      "guacamole",
      "jalapenos",
      "cilantro",
      "sour cream"
    ];
    ingredients.forEach(ingredient => {
      cy.contains(ingredient).should('be.visible');
    });
  });

  it("displays orders", () => {
    cy.wait('@getOrders');
    cy.get('h1').contains('Burrito Builder');
    cy.get('.order').should('have.length', 3);
    cy.get('.order').first().within(() => {
      cy.get('h3').contains('Pat');
      cy.get('.ingredient-list').within(() => {
        cy.get('li').contains('beans');
        cy.get('li').contains('lettuce');
        cy.get('li').contains('carnitas');
        cy.get('li').contains('queso fresco');
        cy.get('li').contains('jalapeno');
      });
    });
    cy.get('.order').last().within(() => {
      cy.get('h3').contains('Alex');
      cy.get('.ingredient-list').within(() => {
        cy.get('li').contains('sofritas');
        cy.get('li').contains('beans');
        cy.get('li').contains('sour cream');
        cy.get('li').contains('carnitas');
        cy.get('li').contains('queso fresco');
      });
    });
  });

  it('should allow a user to add an order', () => {
    cy.get('input[name="name"]').type('Test User');
    cy.contains('beans').click();
    cy.contains('steak').click();
    cy.get('button[type="submit"]').click();
    cy.wait('@postOrder');
    cy.get('.order').should('have.length', 4);
    cy.get('.order').last().within(() => {
      cy.get('h3').contains('Test User');
      cy.get('.ingredient-list').within(() => {
        cy.get('li').contains('beans');
        cy.get('li').contains('steak');
      });
    });
  });

  it('should not allow a user to submit an order without a name', () => {
    cy.contains('beans').click();
    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('input[name="name"]').type('Test User');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('should not allow a user to submit an order without an ingredient selected', ()=>{
    cy.get('input[name="name"]').type('Test User');
    cy.get('button[type="submit"]').should('be.disabled')
    cy.contains('beans').click();
    cy.get('button[type="submit"]').should('not.be.disabled');
  })

  it('should allow a user to delete an order', () => {
    cy.get('.order').first().within(() => {
      cy.get('button').contains('Delete Order').click();
    });
    cy.wait('@deleteOrder');
    cy.get('.order').should('have.length', 2);
    cy.get('.order').first().contains('Sam');
  });
});
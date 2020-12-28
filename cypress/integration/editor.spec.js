describe('general tests', () => {
  it('updates the state according to simple text with marks', () => {
    cy.visit('/Editor')
    cy.get('div[contenteditable]').type(
      'hi, {ctrl+b}I am bold text{ctrl+b} and I am regular text.'
    )
    cy.get('button').click()
    cy.window().then(win => {
      expect(win.editorContent.firstElementChild.outerHTML).to.equal(
        `<p>hi, <strong>I am bold text</strong> and I am regular text.</p>`
      )
    })
  })
})

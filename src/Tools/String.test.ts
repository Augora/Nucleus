import { slugify } from './String'

describe('Slugify function', () => {
  it('should slugify', () => {
    const res = slugify('Hello World!')
    expect(res).toBe('hello-world')
  })

  it('should slugify "Premier Ministre"', () => {
    const res = slugify('Premier Ministre')
    expect(res).toBe('premier-ministre')
  })

  it('should slugify "Ministère de l\'Économie, des Finances et de la Souveraineté industrielle et numérique"', () => {
    const res = slugify(
      "Ministère de l'Économie, des Finances et de la Souveraineté industrielle et numérique"
    )
    expect(res).toBe(
      'ministere-de-leconomie-des-finances-et-de-la-souverainete-industrielle-et-numerique'
    )
  })
})

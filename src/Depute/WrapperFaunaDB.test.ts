import { getDeputeBySlug } from './WrapperFaunaDB'

describe('MapAdresse function', () => {
  it('should ', async () => {
    const depute = (await getDeputeBySlug('cedric-roussel')).data
    expect(depute.Slug).toBe('cedric-roussel')
  })
})

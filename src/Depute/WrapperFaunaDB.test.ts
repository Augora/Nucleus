import { GetDeputeBySlug } from './WrapperFaunaDB'

describe('MapAdresse function', () => {
  it('should ', async () => {
    const depute = (await GetDeputeBySlug('cedric-roussel')).data
    expect(depute.Slug).toBe('cedric-roussel')
  })
})

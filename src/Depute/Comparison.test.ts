import { AreTheSameDeputes } from './Comparison'

describe('AreTheSameDeputes function', () => {
  it('should return false when the first SitesWeb array is empty', async () => {
    const areTheSame = AreTheSameDeputes(
      {
        Slug: 'test',
        SitesWeb: [],
      },
      {
        Slug: 'test',
        SitesWeb: ['a'],
      }
    )
    expect(areTheSame).toBe(false)
  })

  it('should return false when the second SitesWeb array is empty', async () => {
    const areTheSame = AreTheSameDeputes(
      {
        Slug: 'test',
        SitesWeb: ['a'],
      },
      {
        Slug: 'test',
        SitesWeb: [],
      }
    )
    expect(areTheSame).toBe(false)
  })
})

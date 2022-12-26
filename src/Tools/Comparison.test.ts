import {
  RetrieveIdByPath,
  NormalizeArrayToObject,
  CompareLists,
  Action,
  CompareGenericObjects,
} from './Comparison'

describe('RetrieveIdByPath function', () => {
  it('should retrieve id, simple path', () => {
    const res = RetrieveIdByPath(
      {
        id: 'lel',
      },
      'id'
    )
    expect(res).toBe('lel')
  })

  it('should retrieve id, nested path', () => {
    const res = RetrieveIdByPath(
      {
        id: {
          a: 'xD',
        },
      },
      'id.a'
    )
    expect(res).toBe('xD')
  })
})

describe('NormalizeArrayToObject function', () => {
  it('should retrieve an empty array and normalize it to an object', () => {
    const res = NormalizeArrayToObject([], 'id')
    expect(res.lel).toBeUndefined()
    expect(res.lel2).toBeUndefined()
  })

  it('should retrieve an array with one item and normalize it to an object', () => {
    const res = NormalizeArrayToObject(
      [
        {
          id: 'lel',
        },
      ],
      'id'
    )
    expect(res.lel).toBeDefined()
    expect(res.lel2).toBeUndefined()
  })

  it('should retrieve an array and normalize it to an object', () => {
    const res = NormalizeArrayToObject(
      [
        {
          id: 'lel',
        },
        {
          id: 'lel2',
        },
      ],
      'id'
    )
    expect(res.lel).toBeDefined()
    expect(res.lel2).toBeDefined()
  })
})

describe('CompareLists function', () => {
  describe('Simple Model', () => {
    interface SampleData {
      id: string
      a?: string
    }

    it('should compare two empty lists, returns no diff', () => {
      const listA = []
      const listB = []
      const res = CompareLists(listA, listB, CompareGenericObjects, '')
      expect(res.length).toBe(0)
    })

    it('should compare empty with 1 item, return one diff', () => {
      const listA = [{ id: 'a' }]
      const listB = []
      const res = CompareLists<SampleData>(
        listA,
        listB,
        CompareGenericObjects,
        'id'
      )
      expect(res.length).toBe(1)
      expect(res[0].Action).toBe(Action.Create)
    })

    it('should compare 2 identical lists, return no diff', () => {
      const listA = [{ id: 'a' }]
      const listB = [{ id: 'a' }]
      const res = CompareLists<SampleData>(
        listA,
        listB,
        CompareGenericObjects,
        'id'
      )
      expect(res.length).toBe(0)
    })

    it('should compare 2 lists, return one update', () => {
      const listA = [{ id: 'a', a: '5' }]
      const listB = [{ id: 'a' }]
      const res = CompareLists<SampleData>(
        listA,
        listB,
        CompareGenericObjects,
        'id'
      )
      expect(res.length).toBe(1)
      expect(res[0].Action).toBe(Action.Update)
      expect(res[0].NewData.a).toBe('5')
    })

    it('should compare 2 lists, return one remove', () => {
      const listA = []
      const listB = [{ id: 'a', a: '5' }]
      const res = CompareLists<SampleData>(
        listA,
        listB,
        CompareGenericObjects,
        'id'
      )
      expect(res.length).toBe(1)
      expect(res[0].Action).toBe(Action.Remove)
      expect(res[0].NewData.id).toBe('a')
      expect(res[0].PreviousData.id).toBe('a')
    })
  })

  describe('Complex Model', () => {
    interface ComplexData {
      Slug: string
      Age?: number
      Mandat?: {
        DebutMandat: string
      }
      Mail?: string[]
    }

    it('should compare two empty lists, returns no diff', () => {
      const listA = []
      const listB = []
      const res = CompareLists(listA, listB, CompareGenericObjects, '')
      expect(res.length).toBe(0)
    })

    it('should compare two lists, returns one diff which is age', () => {
      const listA = [
        {
          Slug: 'kbs',
          Age: 29,
        },
      ]
      const listB = [
        {
          Slug: 'kbs',
          Age: 30,
        },
      ]
      const res = CompareLists<ComplexData>(
        listA,
        listB,
        CompareGenericObjects,
        'Slug'
      )
      expect(res.length).toBe(1)
      console.log(res)
      expect(res[0].Diffs.length > 0).toBe(true)
      expect(res[0].Diffs[0].FieldName).toBe('Age')
      expect(res[0].Diffs[0].IsSame).toBe(false)
    })

    it('should compare two lists, but a field is missing in desination', () => {
      const listA = [
        {
          Slug: 'kbs',
          Age: null,
        },
      ]
      const listB = [
        {
          Slug: 'kbs',
        },
      ]
      const res = CompareLists<ComplexData>(
        listA,
        listB,
        CompareGenericObjects,
        'Slug'
      )
      expect(res.length).toBe(0)
    })

    it('should compare two lists, returns one diff which is Mandat.DebutMandat', () => {
      const listA = [
        {
          Slug: 'kbs',
          Age: 30,
          Mandat: {
            DebutMandat: '01/01/1900',
          },
        },
      ]
      const listB = [
        {
          Slug: 'kbs',
          Age: 30,
          Mandat: {
            DebutMandat: '02/01/1900',
          },
        },
      ]
      const res = CompareLists(listA, listB, CompareGenericObjects, 'Slug')
      expect(res.length).toBe(1)
      expect(res[0].Diffs.length > 0).toBe(true)
      expect(res[0].Diffs[0].FieldName).toBe('Mandat.DebutMandat')
      expect(res[0].Diffs[0].IsSame).toBe(false)
    })

    it('should compare two lists, returns one diff which is Mail[0]', () => {
      const listA = [
        {
          Slug: 'kbs',
          Mail: ['lel@oklm.fr'],
        },
      ]
      const listB = [
        {
          Slug: 'kbs',
          Mail: [],
        },
      ]
      const res = CompareLists(listA, listB, CompareGenericObjects, '')
      expect(res.length).toBe(1)
      expect(res[0].Diffs.length > 0).toBe(true)
      expect(res[0].Diffs[0].FieldName).toBe('Mail[0]')
      expect(res[0].Diffs[0].IsSame).toBe(false)
    })

    it('should compare two lists, returns one diff which is Mail[1]', () => {
      const listA = [
        {
          Slug: 'kbs',
          Mail: ['lel@oklm.fr', 'test'],
        },
      ]
      const listB = [
        {
          Slug: 'kbs',
          Mail: ['lel@oklm.fr', 'pastest'],
        },
      ]
      const res = CompareLists(listA, listB, CompareGenericObjects, '')
      expect(res.length).toBe(1)
      expect(res[0].Diffs.length > 0).toBe(true)
      expect(res[0].Diffs[0].FieldName).toBe('Mail[1]')
      expect(res[0].Diffs[0].IsSame).toBe(false)
    })
  })
})

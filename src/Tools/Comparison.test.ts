import {
  RetrieveIdByPath,
  NormalizeArrayToObject,
  CompareLists,
  Action,
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
  interface SampleData {
    id: string
    a?: number
  }

  const compareFunction = (item1: SampleData, item2: SampleData) =>
    item1.a === item2.a

  it('should compare two empty lists, returns no diff', () => {
    const listA = []
    const listB = []
    const res = CompareLists(listA, listB, compareFunction, '')
    expect(res.length).toBe(0)
  })

  it('should compare empty with 1 item, return one diff ', () => {
    const listA = [{ id: 'a' }]
    const listB = []
    const res = CompareLists<SampleData>(listA, listB, compareFunction, 'id')
    expect(res.length).toBe(1)
    expect(res[0].Action).toBe(Action.Create)
  })

  it('should compare 2 identical lists, return no diff ', () => {
    const listA = [{ id: 'a' }]
    const listB = [{ id: 'a' }]
    const res = CompareLists<SampleData>(listA, listB, compareFunction, 'id')
    expect(res.length).toBe(0)
  })

  it('should compare 2 lists, return one update ', () => {
    const listA = [{ id: 'a', a: 5 }]
    const listB = [{ id: 'a' }]
    const res = CompareLists<SampleData>(listA, listB, compareFunction, 'id')
    expect(res.length).toBe(1)
    expect(res[0].Action).toBe(Action.Update)
    expect(res[0].NewData.a).toBe(5)
  })

  it('should compare 2 lists, return one remove ', () => {
    const listA = []
    const listB = [{ id: 'a', a: 5 }]
    const res = CompareLists<SampleData>(listA, listB, compareFunction, 'id')
    expect(res.length).toBe(1)
    expect(res[0].Action).toBe(Action.Remove)
    expect(res[0].NewData.id).toBe('a')
    expect(res[0].PreviousData.id).toBe('a')
  })
})

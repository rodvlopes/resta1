jest.mock('./MMUtil.ts')
import { findSolutions, Search } from './Search'

describe('Search (with a fake engine)', () => {
  const engineStub = {
    seq: '',
  }

  let solutions

  const getPossibleMoves = () => {
    return engineStub.seq === ''
      ? ['01', '02', '03']
      : engineStub.seq.endsWith('03')
      ? ['01', '02']
      : engineStub.seq.endsWith('02')
      ? ['01']
      : []
  }

  beforeEach(() => {
    engineStub.seq = ''
  })

  test('check a single solution was found', () => {
    solutions = new Search({
      goal: (sequence: string) => {
        engineStub.seq = sequence
        return sequence === '030201'
      },
      getPossibleMoves,
    }).execute()

    expect(solutions).toEqual(['030201'])
  })

  test('check it stops when maxSolutions is hit', () => {
    solutions = new Search({
      goal: (sequence: string) => {
        engineStub.seq = sequence
        return sequence !== ''
      },
      getPossibleMoves,
    }).execute()

    expect(solutions).toEqual(['03', '02', '01']) //three solutions found!

    engineStub.seq = ''

    solutions = new Search({
      goal: (sequence: string) => {
        engineStub.seq = sequence
        return sequence !== ''
      },
      getPossibleMoves,
      maxSolutions: 1,
    }).execute()

    expect(solutions).toEqual(['03']) // only one found because it was limited to 1
  })
})

describe('Search the actual Engine', () => {
  test('check it finds a real solution when it is close to the end', () => {
    const solutions = findSolutions('3166707175370635475530103271494365562965010916400269044436')
    expect(solutions).toEqual([
      '31667071753706354755301032714943655629650109164002690444362618',
      '31667071753706354755301032714943655629650109164002690444362607',
    ])
  })

  test('check it finds a real solution when it is far from the end', () => {
    const solutions = findSolutions('3166707175370635475530103271494365562965010916')
    expect(solutions.length).toBe(66)
  })

  //took v1: 5.203s, v2: 4.273s on a macbook m1
  test('performance check 1', () => {
    const solutions = findSolutions('3166707175370635475530103271494365562965')
    expect(solutions.length).toBe(6204)
  })

  // //took v1: 13.893s, v2: 11.215s on a macbook m1
  // test('performance check 1', () => {
  //   const solutions = findSolutions('31667071753706354755301032714943655629')
  //   expect(solutions.length).toBe(19308)
  // })

  // //took v1: 738.987s on a macbook m1
  // test('performance check 2', () => {
  //   const solutions = findSolutions('316670717537063547553010327149436556')
  //   expect(solutions.length).toBe(202596)
  // })
})

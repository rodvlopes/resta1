jest.mock('./MMUtil.ts')
import { findSolutions } from './Search'

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

  //took v1: 5.203s, v2: 4.273s, v3: 1.703 s on a macbook m1
  test('performance check 1', () => {
    const solutions = findSolutions('3166707175370635475530103271494365562965')
    expect(solutions.length).toBe(6204)
  })

  //took v1: 13.893s, v2: 11.215s, v3: 3.633s on a macbook m1
  // test('performance check 2', () => {
  //   const solutions = findSolutionsLight('31667071753706354755301032714943655629')
  //   expect(solutions.length).toBe(19308)
  // })

  // // took v1: 34.987s, v3: 9.648s on a macbook m1
  // test('performance check 3', () => {
  //   const solutions = findSolutionsLight('316670717537063547553010327149436556')
  //   expect(solutions.length).toBe(45934)
  // })

  // took v3: 1.448s on a macbook m1
  test('performance check 3 - 1 solution limit', () => {
    const solutions = findSolutions('316670717537063547553010327149436556', false, 1)
    expect(solutions.length).toBe(1)
  })
})

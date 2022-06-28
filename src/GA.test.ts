import {
  applyMutation,
  CHROMESOME_LENGTH,
  fitnessFunction,
  generateInitialPopulation,
  generateRandomIndividual,
  GENE_LENGTH,
  IndividualT,
  mutate,
  normalizeScore,
  POPULATION_SIZE,
  select,
  sortByScore,
  start,
} from './GA'
import { buildSequence } from './PegSolitaire'

test('start', () => {
  expect(start()).toBe(true)
})

test('generateRandomIndividual', () => {
  const individual = generateRandomIndividual()
  expect(individual.chromosome.length).toBe(CHROMESOME_LENGTH * GENE_LENGTH)
  const sequence = buildSequence(individual.chromosome)
  const genesCount = sequence.reduce((acc: number[], it) => {
    acc[it] = (acc[it] || 1) + 1
    return acc
  }, [])
  //assure that it's roughly random
  expect(genesCount.find((gc) => gc > 0.2 * CHROMESOME_LENGTH)).toBe(undefined)
})

test('generateInitialPopulation', () => {
  expect(generateInitialPopulation().length).toBe(POPULATION_SIZE)
})

test('fitnessFunction', () => {
  const WORST_SCORE = 0
  expect(fitnessFunction('0102030405')).toBe(WORST_SCORE)

  const BEST_SCORE = 31
  expect(fitnessFunction('31667071753706354755301032714943655629650109164002690444362607')).toBe(
    BEST_SCORE
  )
})

test('normalizeScore', () => {
  const population = [{ score: 10 } as IndividualT, { score: 5 } as IndividualT]
  normalizeScore(population)
  expect(population.map((p) => p.score)).toEqual([1, 0.5])
})

test('sortByScore', () => {
  const population = [{ score: 1 } as IndividualT, { score: 0.5 } as IndividualT]
  sortByScore(population)
  expect(population.map((p) => p.score)).toEqual([0.5, 1])
})

test('select', () => {
  const population = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.0, 0.0].map(
    (s) => ({ score: s } as IndividualT)
  )
  const elite25pp = [1, 0.9, 0.8]
  const selection = select(population)
  expect(selection.length).toBe(population.length)
  selection.map((couple) => couple[0].score).forEach((elite) => expect(elite25pp).toContain(elite))
})

test('mutate', () => {
  //running with the real Math.random
  expect(mutate('9988').length).toBe(4) //must keep the same length
  expect(mutate('99')).not.toBe('99') //must change the only gene in this chromosome

  //mocked Math.random
  jest.spyOn(global.Math, 'random').mockReturnValue(0.2)
  expect(mutate('010203040506')).toBe('011503040506') //change the second gene to 15

  //clean up
  jest.spyOn(global.Math, 'random').mockRestore()
})

test('applyMutation', () => {
  const population = [{ chromosome: '0102' } as IndividualT, { chromosome: '0102' } as IndividualT]
  applyMutation(population, 0) //0% mutation rate
  expect(population.length).toBe(2) //must keep the same length
  expect(population[0].chromosome).toBe('0102') //no changes expected
  expect(population[1].chromosome).toBe('0102') //no changes expected

  applyMutation(population, 0.5) //50% mutation rate
  expect(population.length).toBe(2) //must keep the same length
  expect(population[0].chromosome).not.toBe('0102') //changes expected on the first individual
  expect(population[1].chromosome).toBe('0102') //no changes expected
})

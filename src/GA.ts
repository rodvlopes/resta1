jest.mock('./MMUtil.ts')
import { Engine, validMoves } from './PegSolitaire'

export const genes = validMoves.map((m) => m[3])
export const WORST_GAME_SCORE = 32
export const CHROMESOME_LENGTH = 31
export const GENE_LENGTH = 2
export const POPULATION_SIZE = 100

export type IndividualT = { chromosome: string; score: number }
export type CoupleT = [IndividualT, IndividualT]

export function start(population?: IndividualT[]) {
  /**
   * Initialization:
   * The genetic algorithm starts by generating an initial population.
   * This initial population consists of all the probable solutions to the given problem.
   * The most popular technique for initialization is the use of random strings.
   */
  const initialPopulation = generateInitialPopulation()

  /**
   * Fitness assignment:
   * The fitness function helps in establishing the fitness of all individuals in the population.
   * It assigns a fitness score to every individual, which further determines the probability
   * of being chosen for reproduction.
   */
  initialPopulation.forEach((i) => {
    i.score = fitnessFunction(i.chromosome)
  })
  normalizeScore(initialPopulation)

  /**
   * Selection:
   * In this phase, individuals are selected for the reproduction of offspring.
   * The selected individuals are then arranged in pairs of two to enhance reproduction.
   */

  const selection = select(initialPopulation)

  /**
   * Reproduction:
   * This phase involves the creation of a child population.
   *  - Crossover: This operator swaps the genetic information of two parents to reproduce an offspring.
   *  - Mutation: This operator adds new genetic information to the new child population.
   */

  const offspring = reprocude(selection)

  /**
   * Replacement:
   * Replace the population with the new child population.
   */

  /**
   * Termination:
   * Stopping criterion is used to provide the basis for termination. The algorithm will terminate after the threshold fitness solution has been attained.
   */

  return true
}

export function reprocude(couples: CoupleT[]): IndividualT[] {
  return couples.map(([mother, father]) => ({
    score: 0,
    chromosome: crossover(mother.chromosome, father.chromosome),
  }))
}

export function mutate(chromosome: string): string {
  //TODO: change chromesome type to array
  const geneToMutate = Math.floor(Math.random() * (chromosome.length / GENE_LENGTH)) * GENE_LENGTH
  const newGene = genes[Math.floor(Math.random() * genes.length)]
  return (
    chromosome.substring(0, geneToMutate) +
    newGene +
    chromosome.substring(geneToMutate + GENE_LENGTH)
  )
}

// mutable
export function applyMutation(population: IndividualT[], rate = 0.02) {
  const numOfIndivualsToMutate = Math.floor(population.length * rate)
  for (let i = 0; i < numOfIndivualsToMutate; i++) {
    population[i].chromosome = mutate(population[i].chromosome)
  }
}

export function crossover(chromosome1: string, chromosome2: string): string {
  return chromosome1
}

// Mutate population
export function sortByScore(population: IndividualT[]) {
  population.sort((a, b) => a.score - b.score)
}

// Mutate population
export function select(population: IndividualT[]): CoupleT[] {
  //25% elite combined with a random among the plebs
  sortByScore(population)
  const _25pp = (population.length * 1) / 4
  const _75pp = (population.length * 3) / 4
  const elite = () => population[Math.floor(Math.random() * _25pp) + _75pp]
  const plebeian = () => population[Math.floor(Math.random() * population.length)]
  return population.map(() => [elite(), plebeian()])
}

export function fitnessFunction(chromosome: string): number {
  // greater is better
  return WORST_GAME_SCORE - new Engine(chromosome).score
}

// Mutate population
export function normalizeScore(population: IndividualT[]) {
  const max = Math.max(...population.map((p) => p.score))
  population.forEach((p) => (p.score /= max))
}

function randomGene() {
  return genes[Math.floor(Math.random() * genes.length)]
}

export function generateRandomIndividual(): IndividualT {
  const chromosome = new Array(CHROMESOME_LENGTH)
    .fill(0)
    .map((_it) => randomGene())
    .join('')
  return { chromosome, score: 0 }
}

export function generateInitialPopulation(): IndividualT[] {
  return new Array(POPULATION_SIZE).fill(0).map((_it) => generateRandomIndividual())
}

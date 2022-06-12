import { Engine } from './PegSolitaire'

export function findSolutions(
  initialSequence = '',
  inTheMiddle = false,
  maxSolutions?: number
): string[] {
  const boardEngine = new Engine(initialSequence)

  return new Search({
    maxSolutions: maxSolutions,
    goal: (sequence: string) => {
      boardEngine.reset()
      boardEngine.runSequence(sequence)
      return inTheMiddle
        ? !boardEngine.centralHole.empty() && boardEngine.score === 1
        : boardEngine.score === 1
    },
    getPossibleMoves: () => boardEngine.possibleMoves.map((m) => m[3]),
  }).execute(initialSequence)
}

interface SearchI {
  // functions that tell when a solution is hit
  goal: (seq: string) => boolean

  // ids of all possible moves in the current state
  getPossibleMoves: () => string[]

  // limit the number of solutions
  maxSolutions?: number
}

export class Search implements SearchI {
  goal!: (seq: string) => boolean
  getPossibleMoves!: () => string[]
  maxSolutions?: number
  solutionsFound: string[] = []

  constructor(config: SearchI) {
    Object.assign(this, config)
  }

  execute(initialSequence = '') {
    const movestack: string[] = [...this.getPossibleMoves()]
    // console.log(initialSequence, movestack)
    while (movestack.length > 0) {
      if (this.maxSolutions && this.solutionsFound.length >= this.maxSolutions) {
        break
      }

      const mi = movestack.pop()
      const s = initialSequence + mi
      if (this.goal(s)) {
        this.solutionsFound.push(s)
      } else {
        this.execute(s)
      }
    }

    return this.solutionsFound
  }
}

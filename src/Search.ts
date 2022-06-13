import { buildSequence, Engine, EngineLight } from './PegSolitaire'

export function findSolutionsLight(
  initialSequence = '',
  inTheMiddle = false,
  maxSolutions?: number
): string[] {
  return depthSearch(new EngineLight(initialSequence), inTheMiddle, maxSolutions)
}

export function findSolutions(
  initialSequence = '',
  inTheMiddle = false,
  maxSolutions?: number
): string[] {
  const boardEngine = new Engine(initialSequence)
  const initialHolesPosition = boardEngine.holes

  return new Search({
    maxSolutions: maxSolutions,
    goal: (sequence: string) => {
      boardEngine.holes = initialHolesPosition.map((h) => h.clone())
      boardEngine.sequence = buildSequence(initialSequence)
      boardEngine.runSequence(sequence.replace(initialSequence, ''))
      return boardEngine.isWinner(inTheMiddle)
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

export function depthSearch(
  initialEngine: EngineLight,
  inTheMiddle = false,
  maxSolutions?: number
): string[] {
  const solutionsFound: string[] = []

  const execute = (engine: EngineLight) => {
    const movestack: string[] = engine.possibleMoves.map((m) => m[3])
    // console.log(initialSequence, movestack)
    while (movestack.length > 0) {
      if (maxSolutions && solutionsFound.length >= maxSolutions) {
        break
      }

      const mi = movestack.pop()
      const newEngine = engine.runMove(mi || '')
      if (newEngine.isWinner(inTheMiddle)) {
        solutionsFound.push(newEngine.sequence.toString())
      } else {
        execute(newEngine)
      }
    }
  }

  execute(initialEngine)

  return solutionsFound
}

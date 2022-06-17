import { Engine } from './PegSolitaire'

export function findSolutions(
  initialSequence = '',
  inTheMiddle = false,
  maxSolutions?: number
): string[] {
  return depthSearch(new Engine(initialSequence), inTheMiddle, maxSolutions)
}

export function depthSearch(
  initialEngine: Engine,
  inTheMiddle = false,
  maxSolutions?: number
): string[] {
  const solutionsFound: string[] = []

  const execute = (engine: Engine) => {
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

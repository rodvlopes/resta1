//winning sequence: "31667071753706354755301032714943655629650109164002690444362607"
import React from 'react'
import useD3 from './Hooks'
import { buildWorker } from './MMUtil'

// simple react setState example: https://codepen.io/Hafoux/pen/ZEOwzdQ?editors=1010

/*
var positions = 
         [00,01,02,
          03,04,05,
    06,07,08,09,10,11,12,
    13,14,15,16,17,18,19,
    20,21,22,23,24,25,26,
          27,28,29,
          30,31,32]

    33 positions
*/

const pad2 = (i: number): string => `${i.toString()}`.padStart(2, '0')

type MoveT = [from: number, mid: number, to: number, id: string]

type BoardHoleStateT = 'peg' | 'empty' | 'destination' | 'selected'

// TODO: segregate boardSlot behavior and view
export class BoardHole {
  x: number
  y: number
  id: number
  state: BoardHoleStateT
  validMoves: MoveT[]
  refMove: MoveT | null
  static central = 16

  constructor(
    { x, y }: { x: number; y: number },
    id: number,
    validMoves: MoveT[],
    state = (id === BoardHole.central ? 'empty' : 'peg') as BoardHoleStateT,
    holew = 0,
    holeh = 0,
    dholew = 0,
    dholeh = 0
  ) {
    this.id = id
    this.validMoves = validMoves
    this.state = state
    this.refMove = null
    //Adiciona o deslocamento para centralizar o círculo
    this.x = x * holew + dholew
    this.y = y * holeh + dholeh
  }

  isEmpty() {
    return this.state === 'empty' || this.state === 'destination'
  }

  isDestination() {
    return this.state === 'destination'
  }

  isSelected() {
    return this.state === 'selected'
  }

  cleanState() {
    switch (this.state) {
      case 'selected':
        this.state = 'peg'
        break
      case 'destination':
        this.state = 'empty'
        break
    }
  }

  possibleMoves(holes: BoardHole[]) {
    return this.validMoves.filter(
      ([from, mid, to]: MoveT) =>
        !holes[from].isEmpty() && !holes[mid].isEmpty() && holes[to].isEmpty()
    )
  }

  reset() {
    this.state = this.id === BoardHole.central ? 'empty' : 'peg'
  }

  select() {
    this.state = 'selected'
  }

  setEmpty() {
    this.state = 'empty'
  }

  setPeg() {
    this.state = 'peg'
  }

  setDestination(move: MoveT) {
    this.state = 'destination'
    this.refMove = move
  }

  clone() {
    return new BoardHole({ x: this.x, y: this.y }, this.id, this.validMoves, this.state)
  }
}

type SequenceT = number[]

export function buildSequence(seq: string | SequenceT): SequenceT {
  const sequence =
    typeof seq === 'string' ? (seq.match(/.{2}/g) || []).map((mi: string) => parseInt(mi)) : seq

  sequence.toString = () => stringfySequence(sequence)
  return sequence
}

export function stringfySequence(seq: SequenceT): string {
  return seq.map((mi) => pad2(mi)).join('')
}

// prettier-ignore
const validMoves : readonly MoveT[] = Object.freeze([
  [0, 1, 2],    [0, 3, 8],    [1, 4, 9],    [2, 1, 0],    [2, 5, 10],   [3, 4, 5],
  [3, 8, 15],   [4, 9, 16],   [5, 4, 3],    [5, 10, 17],  [6, 7, 8],    [6, 13, 20],
  [7, 8, 9],    [7, 14, 21],  [8, 3, 0],    [8, 7, 6],    [8, 9, 10],   [8, 15, 22],
  [9, 4, 1],    [9, 8, 7],    [9, 10, 11],  [9, 16, 23],  [10, 5, 2],   [10, 9, 8],
  [10, 11, 12], [10, 17, 24], [11, 10, 9],  [11, 18, 25], [12, 11, 10], [12, 19, 26],
  [13, 14, 15], [14, 15, 16], [15, 8, 3],   [15, 14, 13], [15, 16, 17], [15, 22, 27],
  [16, 9, 4],   [16, 15, 14], [16, 17, 18], [16, 23, 28], [17, 10, 5],  [17, 16, 15],
  [17, 18, 19], [17, 24, 29], [18, 17, 16], [19, 18, 17], [20, 13, 6],  [20, 21, 22],
  [21, 14, 7],  [21, 22, 23], [22, 15, 8],  [22, 21, 20], [22, 23, 24], [22, 27, 30],
  [23, 16, 9],  [23, 22, 21], [23, 24, 25], [23, 28, 31], [24, 17, 10], [24, 23, 22],
  [24, 25, 26], [24, 29, 32], [25, 18, 11], [25, 24, 23], [26, 19, 12], [26, 25, 24],
  [27, 22, 15], [27, 28, 29], [28, 23, 16], [29, 24, 17], [29, 28, 27], [30, 27, 22],
  [30, 31, 32], [31, 28, 23], [32, 29, 24], [32, 31, 30], 
].map((m, mi) => [...m, pad2(mi)] as MoveT))

// prettier-ignore
const defaultBoardHoles = Object.freeze([
                              {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0},
                              {x: 2, y: 1}, {x: 3, y: 1}, {x: 4, y: 1},
  {x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2}, {x: 4, y: 2}, {x: 5, y: 2}, {x: 6, y: 2},
  {x: 0, y: 3}, {x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}, {x: 4, y: 3}, {x: 5, y: 3}, {x: 6, y: 3},
  {x: 0, y: 4}, {x: 1, y: 4}, {x: 2, y: 4}, {x: 3, y: 4}, {x: 4, y: 4}, {x: 5, y: 4}, {x: 6, y: 4},
                              {x: 2, y: 5}, {x: 3, y: 5}, {x: 4, y: 5},
                              {x: 2, y: 6}, {x: 3, y: 6}, {x: 4, y: 6},
])

const holesValidMoves = defaultBoardHoles.map((_pos, i) => validMoves.filter((m) => i === m[0]))

const buildInitalBoardHolesState = () =>
  defaultBoardHoles.map((pos, i) => {
    return new BoardHole(pos, i, holesValidMoves[i])
  })

export class Engine {
  holes: BoardHole[]
  validMoves = validMoves
  centralHole: BoardHole
  sequence: SequenceT = buildSequence([])

  constructor(sequence: string | SequenceT = '', holes = buildInitalBoardHolesState()) {
    this.holes = holes
    this.centralHole = holes[BoardHole.central]
    typeof sequence === 'string'
      ? this.runSequence(sequence)
      : (this.sequence = buildSequence(sequence))
  }

  get score(): number {
    return this.holes.length - this.sequence.length - 1
  }

  isWinner(inTheMiddle = false): boolean {
    return inTheMiddle ? !this.centralHole.isEmpty() && this.score === 1 : this.score === 1
  }

  runMove(m: MoveT) {
    const [from, mid, to, moveIndex] = m
    const holeFrom = this.holes[from]
    const holeMid = this.holes[mid]
    const holeTo = this.holes[to]
    if (holeFrom.possibleMoves(this.holes).includes(m)) {
      holeTo.setPeg()
      holeMid.setEmpty()
      holeFrom.setEmpty()
      this.sequence.push(parseInt(moveIndex))
      return true
    } else {
      console.log('Movement not allowed on this state: ', m.toString())
      return false
    }
  }

  runSequence(seq: string) {
    buildSequence(seq).forEach((mi) => {
      this.runMove(validMoves[mi])
    })
  }

  reset() {
    this.holes.forEach((hole) => hole.reset())
    this.sequence = [] as SequenceT
  }

  get possibleMoves() {
    return this.holes.map((hole) => hole.possibleMoves(this.holes)).flat()
  }
}

type BoardConfigT = {
  width?: number
  height?: number
  container?: string
  noView?: boolean
  compactView?: boolean
  sequence?: string
}

function Board2({
  width = window.innerWidth - 6,
  height = window.innerHeight - 6,
  compactView = false,
  sequence = '',
}: BoardConfigT = {}) {
  const holew = Math.floor(width / 7),
    dholew = Math.floor(holew / 2),
    holeh = Math.floor(height / 7),
    dholeh = Math.floor(holeh / 2),
    holeRadius = Math.floor(0.35 * Math.min(holew, holeh)),
    THRESHOLD_TO_FIND_SOLUTIONS = 13

  const lazyEngineBuilder = () =>
    new Engine(
      sequence,
      defaultBoardHoles.map((pos, i) => {
        const holesValidMoves = validMoves.filter((m) => i === m[0])
        return new BoardHole(pos, i, holesValidMoves, undefined, holew, holeh, dholew, dholeh)
      })
    )

  const [engine] = React.useState(lazyEngineBuilder)
  // Engine is mutable (for performance), so React needs to rely on stateCounter to update
  const [stateCounter, setStateCounter] = React.useState(0)
  const incState = () => setStateCounter((i) => ++i)
  const [solutionFinderWorker, setSolutionFinderWorker]: [Worker | undefined, any] =
    React.useState()
  const [solutionsFound, setSolutionsFound]: [any[] | undefined, any] = React.useState()

  const cleanState = () => {
    engine.holes.forEach((hole) => hole.cleanState())
  }

  const selectHole = (hole: BoardHole) => {
    hole.select()
    hole.possibleMoves(engine.holes).forEach((m) => engine.holes[m[2]].setDestination(m)) //m[2] -> holeTo
  }

  const runSequenceAnimated = (seq: string) => {
    buildSequence(seq).forEach((mi, i) => {
      setTimeout(() => {
        const m = validMoves[mi]
        engine.runMove(m)
        incState()
      }, 500 * i)
    })
  }

  const runSequence = (seq: string) => {
    engine.runSequence(seq)
    incState()
  }

  const undoLastMove = () => {
    if (engine.sequence.length > 0) {
      const mi = engine.sequence.pop()
      if (mi === undefined) {
        return
      }
      const [from, mid, to] = validMoves[mi]
      engine.holes[to].state = 'empty'
      engine.holes[mid].state = 'peg'
      engine.holes[from].state = 'peg'
      incState()
    }
  }

  const reset = () => {
    engine.holes.forEach((hole) => hole.reset())
    console.log('reset')
    engine.reset()
    incState()
  }

  const navigateToSequence = () => (window.location.href = `?sequence=${engine.sequence}`)

  const clickHoleHandler = (_ev: PointerEvent, hole: BoardHole) => {
    if (hole.isDestination()) {
      //run movement and remove one peg
      if (hole.refMove) {
        engine.runMove(hole.refMove)
        cleanState()
        incState() //force update
      }
    } else if (hole.isEmpty()) {
      //nothing to do
    } else {
      //select peg
      cleanState()
      selectHole(hole)
      incState()
    }
  }

  const ref = useD3(
    (svg) => {
      svg.selectAll('*').remove()

      const g = svg
        .selectAll('g.node')
        .data(engine.holes)
        .enter()
        .append('svg:g')
        .attr('class', 'node')
        .attr('transform', function (d: any) {
          return 'translate(' + d.x + ',' + d.y + ')'
        })
        .on('click', clickHoleHandler)

      g.append('svg:circle')
        .attr('class', (hole: any) => hole.state)
        .attr('r', holeRadius)

      if (compactView) {
        svg
          .append('svg:text')
          .attr('x', width - 21)
          .attr('y', height - 10)
          .attr('class', 'score')
          .text(() => engine.score.toString())
      } else {
        g.append('svg:text')
          .attr('x', '-0.5em')
          .attr('dy', '.31em')
          .text((_d: any, i: number) => pad2(i))

        svg
          .append('svg:text')
          .attr('x', width - 130)
          .attr('y', height - 30 + 'px')
          .attr('text-anchor', 'end')
          .attr('class', 'remaining')
          .text(`Remaining ${engine.score}`)
          .on('click', () => navigateToSequence())

        console.log(`Remaining ${engine.score}`)

        svg
          .append('svg:text')
          .attr('x', 30)
          .attr('y', height - 30 + 'px')
          .attr('class', 'solutions')
          .text(() =>
            engine.isWinner()
              ? 'tu é o cara!'
              : solutionsFound
              ? `There are ${solutionsFound.length} possible solutions`
              : ''
          )

        svg
          .append('svg:text')
          .attr('x', width - 130)
          .attr('y', 30 + 'px')
          .attr('text-anchor', 'end')
          .attr('class', 'resetButton')
          .text('Reset')
          .on('click', () => reset())
      }
    },
    [stateCounter, solutionsFound, compactView]
  )

  const findSolutions = () => {
    console.log('findSolutions triggered')
    if (solutionFinderWorker) {
      solutionFinderWorker.terminate()
    }

    const worker = buildWorker()

    worker.addEventListener(
      'message',
      (e) => {
        if (e.data.solutions) {
          setSolutionsFound(e.data.solutions)
          console.log('Solutions found:', e.data.solutions)
        } else {
          console.log(e.data)
        }
      },
      false
    )

    worker.onerror = (event) => console.error(event)

    worker.postMessage({ initialSequence: stringfySequence(engine.sequence), inTheMiddle: true })

    setSolutionFinderWorker(worker)
  }

  React.useEffect(() => {
    console.log('useEffect', engine.score)
    if (engine.score < THRESHOLD_TO_FIND_SOLUTIONS) {
      findSolutions()
    }
  }, [engine.score])

  const handleUndoKeyPress = ({ ctrlKey, metaKey, key }: KeyboardEvent) => {
    if ((ctrlKey || metaKey) && key === 'z') {
      undoLastMove()
    }
  }

  React.useEffect(() => {
    window.addEventListener('keydown', handleUndoKeyPress)
    return () => {
      window.removeEventListener('keydown', handleUndoKeyPress)
    }
  }, [])

  // @ts-ignore
  window.runSequence = runSequence

  return (
    <>
      <p onClick={() => runSequenceAnimated('316670')}>{engine.score}</p>
      <p onClick={() => runSequence('6670')}>{engine.score}</p>
      <p>{sequence}</p>
      <svg
        // @ts-ignore
        ref={ref}
        style={{
          height,
          width,
        }}
      ></svg>
    </>
  )
}

export default Board2

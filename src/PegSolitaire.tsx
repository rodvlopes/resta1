import React from 'react'
import useD3 from './Hooks'
import { buildWorker } from './MMUtil'

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
type BoardHoleStateT = null | 'peg' | 'empty' | 'destination' | 'selected'

export class BoardHoleView {
  x: number
  y: number
  id: number
  peg: PegT
  selected: BoardHoleStateT
  validMoves: MoveT[]
  refMove: MoveT | null
  holeRadius: number
  static central = 16

  constructor(
    { x, y }: { x: number; y: number },
    id: number,
    validMoves: MoveT[],
    peg: PegT,
    selected: BoardHoleStateT = null,
    width = 0,
    height = 0
  ) {
    const holew = Math.floor(width / 7),
      dholew = Math.floor(holew / 2),
      holeh = Math.floor(height / 7),
      dholeh = Math.floor(holeh / 2),
      holeRadius = Math.floor(0.35 * Math.min(holew, holeh))

    this.id = id
    this.validMoves = validMoves
    this.peg = peg
    this.selected = selected
    this.refMove = null
    //Adiciona o deslocamento para centralizar o círculo
    this.x = x * holew + dholew
    this.y = y * holeh + dholeh
    this.holeRadius = holeRadius
  }

  get state(): BoardHoleStateT {
    return this.selected ? this.selected : this.peg ? 'peg' : 'empty'
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

  cleanSelection() {
    this.selected = null
    return this
  }

  select() {
    this.selected = 'selected'
    return this
  }

  setDestination(move: MoveT) {
    this.selected = 'destination'
    this.refMove = move
    return this
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
const boardHolesViewPositions = Object.freeze([
                              {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0},
                              {x: 2, y: 1}, {x: 3, y: 1}, {x: 4, y: 1},
  {x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2}, {x: 4, y: 2}, {x: 5, y: 2}, {x: 6, y: 2},
  {x: 0, y: 3}, {x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}, {x: 4, y: 3}, {x: 5, y: 3}, {x: 6, y: 3},
  {x: 0, y: 4}, {x: 1, y: 4}, {x: 2, y: 4}, {x: 3, y: 4}, {x: 4, y: 4}, {x: 5, y: 4}, {x: 6, y: 4},
                              {x: 2, y: 5}, {x: 3, y: 5}, {x: 4, y: 5},
                              {x: 2, y: 6}, {x: 3, y: 6}, {x: 4, y: 6},
])

const holesValidMoves = boardHolesViewPositions.map((_pos, i) =>
  validMoves.filter((m) => i === m[0])
)

const holePossibleMoves = (holeId: number, holes: number[]) => {
  return holesValidMoves[holeId].filter(
    ([from, mid, to]: MoveT) => holes[from] === 1 && holes[mid] === 1 && holes[to] === 0
  )
}

type PegT = 0 | 1

export class Engine {
  holes: PegT[]
  sequence: SequenceT = buildSequence([])

  constructor(
    sequence: string | SequenceT = '',
    // prettier-ignore
    holes: PegT[] = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ]
  ) {
    this.holes = holes
    typeof sequence === 'string'
      ? this.initializeSequence(sequence)
      : (this.sequence = buildSequence(sequence))
  }

  get centralHole() {
    return this.holes[BoardHoleView.central]
  }

  get score(): number {
    return this.holes.length - this.sequence.length - 1
  }

  isWinner(inTheMiddle = false): boolean {
    return inTheMiddle ? this.centralHole === 0 && this.score === 1 : this.score === 1
  }

  runMove(m: MoveT | string): Engine {
    m = typeof m === 'string' ? validMoves[parseInt(m)] : m
    const [from, mid, to, moveIndex] = m
    if (holePossibleMoves(from, this.holes).includes(m)) {
      const newHoles = [...this.holes]
      newHoles[to] = 1
      newHoles[mid] = 0
      newHoles[from] = 0
      const newSequence = [...this.sequence, parseInt(moveIndex)]
      return new Engine(newSequence, newHoles)
    } else {
      console.log('Movement not allowed on this state: ', m.toString())
      return this
    }
  }

  //Mutable
  private initializeSequence(seq: string) {
    buildSequence(seq).forEach((mi) => {
      const m = validMoves[mi]
      const [from, mid, to, moveIndex] = m
      if (holePossibleMoves(from, this.holes).includes(m)) {
        this.holes[to] = 1
        this.holes[mid] = 0
        this.holes[from] = 0
        this.sequence.push(parseInt(moveIndex))
      } else {
        console.log('Movement not allowed on this state: ', m.toString())
      }
    })
  }

  get possibleMoves() {
    return this.holes.map((_hole, holeId) => holePossibleMoves(holeId, this.holes)).flat()
  }

  undoLastMove(): Engine {
    if (this.sequence.length > 0) {
      const newSequence = [...this.sequence]
      const mi = newSequence.pop()
      if (mi === undefined) {
        return this
      }
      const [from, mid, to] = validMoves[mi]
      const newHoles = [...this.holes]
      newHoles[to] = 0
      newHoles[mid] = 1
      newHoles[from] = 1
      return new Engine(newSequence, newHoles)
    }
    return this
  }
}

const lazyEngineBuilder = (sequence: string) => () => new Engine(sequence)

const lazyHolesBuilder = (engine: Engine, width: number, height: number) => () =>
  boardHolesViewPositions.map(
    (pos, i) => new BoardHoleView(pos, i, holesValidMoves[i], engine.holes[i], null, width, height)
  )

type BoardConfigT = {
  width?: number
  height?: number
  container?: string
  noView?: boolean
  compactView?: boolean
  sequence?: string
}

function Board({
  width = window.innerWidth - 6,
  height = window.innerHeight - 6,
  compactView = false,
  sequence = '',
}: BoardConfigT = {}) {
  const THRESHOLD_TO_FIND_SOLUTIONS = 14

  const [engine, setEngine] = React.useState(lazyEngineBuilder(sequence))
  const [holes, setHoles] = React.useState(lazyHolesBuilder(engine, width, height))
  holes.forEach((h, i) => {
    h.peg = engine.holes[i]
  })

  const [solutionFinderWorker, setSolutionFinderWorker]: [Worker | undefined, any] =
    React.useState()
  const [solutionsFound, setSolutionsFound]: [any[] | undefined, any] = React.useState()

  const cleanSelection = () => {
    setHoles(holes.map((h) => h.cleanSelection()))
  }

  const selectHole = (hole: BoardHoleView) => {
    hole.select()
    holePossibleMoves(hole.id, engine.holes).forEach((m) => holes[m[2]].setDestination(m)) //m[2] -> holeTo
    setHoles([...holes])
  }

  const runSequenceAnimated = (seq: string) => {
    buildSequence(seq).forEach((mi, i) => {
      setTimeout(() => {
        const m = validMoves[mi]
        setEngine(engine.runMove(m))
      }, 500 * i)
    })
  }

  const runSequence = (seq: string) => {
    setEngine(new Engine(seq))
  }

  const reset = () => {
    console.log('reset')
    setEngine(new Engine())
  }

  const navigateToSequence = () => (window.location.href = `?sequence=${engine.sequence}`)

  const clickHoleHandler = (_ev: PointerEvent, hole: BoardHoleView) => {
    if (hole.isDestination()) {
      //run movement and remove one peg
      if (hole.refMove) {
        cleanSelection()
        setEngine(engine.runMove(hole.refMove))
      }
    } else if (hole.isEmpty()) {
      //nothing to do
    } else {
      //select peg
      cleanSelection()
      selectHole(hole)
    }
  }

  const ref = useD3(
    (svg) => {
      svg.selectAll('*').remove()

      const g = svg
        .selectAll('g.node')
        .data(holes)
        .enter()
        .append('svg:g')
        .attr('class', 'node')
        .attr('transform', function (d: any) {
          return 'translate(' + d.x + ',' + d.y + ')'
        })
        .on('click', clickHoleHandler)

      g.append('svg:circle')
        .attr('class', (hole: BoardHoleView) => hole.state)
        .attr('r', (hole: BoardHoleView) => hole.holeRadius)

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
              ? 'You are the one!'
              : solutionsFound
              ? `There are ${solutionsFound.length} possible solutions.`
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
    [engine, holes, solutionsFound, compactView]
  )

  const receiveMessageFromFinder = React.useCallback((e: MessageEvent) => {
    if (e.data.solutions) {
      setSolutionsFound(e.data.solutions)
      console.log('Solutions found:', e.data.solutions)
    } else {
      console.log(e.data)
    }
  }, [])

  const findSolutions = () => {
    console.log('findSolutions triggered')
    if (solutionFinderWorker) {
      solutionFinderWorker.removeEventListener('message', receiveMessageFromFinder, false)
      solutionFinderWorker.terminate()
    }

    const worker = buildWorker()
    worker.addEventListener('message', receiveMessageFromFinder, false)

    worker.onerror = (event) => console.error(event)

    worker.postMessage({
      initialSequence: stringfySequence(engine.sequence),
      inTheMiddle: false,
      // maxSolutions: 1,
    })

    setSolutionFinderWorker(worker)
  }

  React.useEffect(() => {
    console.log('useEffect', engine.score)
    if (engine.score < THRESHOLD_TO_FIND_SOLUTIONS) {
      findSolutions()
    } else {
      setSolutionsFound(undefined)
    }
  }, [engine.score])

  const undoLastMove = () => {
    setEngine((engine) => engine.undoLastMove())
  }

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

  Object.assign(window, { runSequence, runSequenceAnimated })

  return (
    <>
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

export default Board

// winning sequence: "31667071753706354755301032714943655629650109164002690444362607"
// simple react setState example: https://codepen.io/Hafoux/pen/ZEOwzdQ?editors=1010

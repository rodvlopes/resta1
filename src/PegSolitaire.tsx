//winning sequence: "31667071753706354755301032714943655629650109164002690444362607"
import React from 'react'
import useD3 from './Hooks'
import { buildWorker } from './Util'

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

//TODO: rename Slot/Spot to Hole
//TODO: set a namespace

const pad2 = (i: number): string => `${i.toString()}`.padStart(2, '0')
// const clone = (obj : any) => JSON.SON.stringify(obj)

type MoveT = [from: number, mid: number, to: number, id: string]

// TODO: segregate boardSlot behavior and view
class BoardSlot {
  x: number
  y: number
  id: number
  state: '' | 'empty' | 'destination' | 'selected' //TODO: rename '' -> 'peg'
  validMoves: MoveT[]
  refMove: MoveT | null

  constructor(
    { x, y }: { x: number; y: number },
    id: number,
    validMoves: MoveT[],
    slotw = 0,
    sloth = 0,
    dslotw = 0,
    dsloth = 0
  ) {
    this.id = id
    this.state = id === 16 ? 'empty' : '' //TODO: name 16-magic-number
    this.validMoves = validMoves
    this.validMoves = validMoves
    this.refMove = null
    //Adiciona o deslocamento para centralizar o círculo
    this.x = x * slotw + dslotw
    this.y = y * sloth + dsloth
  }

  empty() {
    return this.state === 'empty' || this.state === 'destination'
  }

  destination() {
    return this.state === 'destination'
  }

  selected() {
    return this.state === 'selected'
  }

  cleanState() {
    switch (this.state) {
      case 'selected':
        this.state = ''
        break
      case 'destination':
        this.state = 'empty'
        break
    }
  }

  possibleMoves(boardSlots: BoardSlot[]) {
    return this.validMoves.filter(
      ([from, mid, to]: MoveT) =>
        !boardSlots[from].empty() && !boardSlots[mid].empty() && boardSlots[to].empty()
    )
  }

  reset() {
    this.state = this.id === 16 ? 'empty' : ''
  }

  select() {
    this.state = 'selected'
  }

  setEmpty() {
    this.state = 'empty'
  }

  setPeg() {
    this.state = ''
  }

  setDestination(move: MoveT) {
    this.state = 'destination'
    this.refMove = move
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

const buildInitalBoardHolesState = () =>
  defaultBoardHoles.map((pos, i) => {
    const slotValidMoves = validMoves.filter((m) => i === m[0])
    return new BoardSlot(pos, i, slotValidMoves)
  })

//PURE JS dependecy free
export class Engine {
  holes: BoardSlot[]
  validMoves = validMoves
  centralHole: BoardSlot
  sequence: SequenceT = buildSequence([])

  constructor(sequence: string | SequenceT = '', holes = buildInitalBoardHolesState()) {
    this.holes = holes
    this.centralHole = holes[16]
    typeof sequence === 'string'
      ? this.runSequence(sequence)
      : (this.sequence = buildSequence(sequence))
  }

  get score(): number {
    return 32 - this.sequence.length //TODO: name 32-magic-number
  }

  runMove(m: MoveT) {
    const [from, mid, to, moveIndex] = m
    const slotFrom = this.holes[from]
    const slotMid = this.holes[mid]
    const slotTo = this.holes[to]
    if (slotFrom.possibleMoves(this.holes).includes(m)) {
      slotTo.setPeg()
      slotMid.setEmpty()
      slotFrom.setEmpty()
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
  const slotw = Math.floor(width / 7),
    dslotw = Math.floor(slotw / 2),
    sloth = Math.floor(height / 7),
    dsloth = Math.floor(sloth / 2),
    spotRadius = Math.floor(0.35 * Math.min(slotw, sloth))

  const lazyEngineBuilder = () =>
    new Engine(
      sequence,
      defaultBoardHoles.map((pos, i) => {
        const slotValidMoves = validMoves.filter((m) => i === m[0])
        return new BoardSlot(pos, i, slotValidMoves, slotw, sloth, dslotw, dsloth)
      })
    )

  const [engine] = React.useState(lazyEngineBuilder)
  const [stateCounter, setStateCounter] = React.useState(0)
  const incState = () => setStateCounter((i) => ++i)
  // const nextState = (eng: Engine) => new Engine(eng.sequence, eng.holes)

  // const [initialSequence, setInitialSequence] = React.useState(sequenceStr)
  const [solutionFinderWorker, setSolutionFinderWorker]: [Worker | undefined, any] =
    React.useState()
  const [solutionsFound, setSolutionsFound]: [any[] | undefined, any] = React.useState()

  const score = engine.score //TODO: name 32-magic-number

  const cleanState = () => {
    engine.holes.forEach((spot) => spot.cleanState())
  }

  const selectSpot = (spot: BoardSlot) => {
    spot.select()
    spot.possibleMoves(engine.holes).forEach((m) => engine.holes[m[2]].setDestination(m)) //m[2] -> slotTo
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
      engine.holes[mid].state = ''
      engine.holes[from].state = ''
      incState()
    }
  }

  const reset = () => {
    engine.holes.forEach((slot) => slot.reset())
    console.log('reset')
    engine.reset()
    incState()
  }

  const navigateToSequence = () => (window.location.href = `?sequence=${engine.sequence}`)

  const clickSpotHandler = (_ev: PointerEvent, spot: BoardSlot) => {
    if (spot.destination()) {
      //run movement and remove one peg
      if (spot.refMove) {
        engine.runMove(spot.refMove)
        cleanState()
        incState() //force update
      }
    } else if (spot.empty()) {
      //nothing to do
    } else {
      //select peg
      cleanState()
      selectSpot(spot)
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
        .on('click', clickSpotHandler)

      g.append('svg:circle')
        .attr('class', (spot: any) => spot.state)
        .attr('r', spotRadius)

      if (compactView) {
        svg
          .append('svg:text')
          .attr('x', width - 21)
          .attr('y', height - 10)
          .attr('class', 'score')
          .text(() => score.toString())
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
          .text(`Remaining ${score}`)
          .on('click', () => navigateToSequence())

        console.log(`Remaining ${score}`)

        svg
          .append('svg:text')
          .attr('x', 30)
          .attr('y', height - 30 + 'px')
          .attr('class', 'solucoes')
          .text(() =>
            score === 1
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

  //TODO: name 13-magic-number
  React.useEffect(() => {
    console.log('useEffect', score)
    if (score < 13) {
      findSolutions()
    }
  }, [score])

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
      <p onClick={() => runSequenceAnimated('316670')}>{score}</p>
      <p onClick={() => runSequence('6670')}>{score}</p>
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
